
from collections import defaultdict
from typing import Any
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from database import engine


logger = logging.getLogger(__name__)

app = FastAPI(
    title="JanSahayak API",
    description="Multilingual Government Scheme Eligibility Assistant",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_language(language: str) -> str:
    return "hi" if language == "hi" else "en"


def translated_value(row: dict, english_key: str, hindi_key: str, language: str):
    if language == "hi" and row.get(hindi_key):
        return row[hindi_key]
    return row.get(english_key)


@app.get("/")
def home():
    return {
        "message": "JanSahayak Backend is Running!",
        "message_hi": "जनसहायक बैकएंड चालू है!"
    }


# API 1: Get all active schemes
@app.get("/api/schemes")
def get_schemes(language: str = "en"):
    language = get_language(language)

    try:
        with engine.connect() as connection:
            result = connection.execute(
                text("""
                    SELECT
                        s.id,
                        s.name_en,
                        to_jsonb(s)->>'name_hi' AS name_hi,
                        s.ministry,
                        s.description_en,
                        to_jsonb(s)->>'description_hi' AS description_hi,
                        s.government_level AS government,
                        s.category,
                        s.benefit_en,
                        to_jsonb(s)->>'benefit_hi' AS benefit_hi,
                        s.last_verified_at
                    FROM public.schemes AS s
                    WHERE s.is_active = TRUE
                    ORDER BY s.name_en
                """)
            )

            schemes = []

            for row in result.mappings().all():
                scheme = dict(row)

                scheme["name"] = translated_value(
                    scheme, "name_en", "name_hi", language
                )

                scheme["description"] = translated_value(
                    scheme, "description_en", "description_hi", language
                )

                scheme["benefit_summary"] = translated_value(
                    scheme, "benefit_en", "benefit_hi", language
                )

                schemes.append(scheme)

            return schemes

    except SQLAlchemyError as error:
        logger.exception("Database error while retrieving schemes")
        raise HTTPException(
            status_code=503,
            detail=(
                "Scheme data is temporarily unavailable."
                if language == "en"
                else "योजना की जानकारी अभी उपलब्ध नहीं है।"
            ),
        ) from error


# API 2: Get details of one scheme
@app.get("/api/schemes/{scheme_id}")
def get_scheme_details(scheme_id: int, language: str = "en"):
    language = get_language(language)

    try:
        with engine.connect() as connection:
            result = connection.execute(
                text("""
                    SELECT
                        s.id,
                        s.name_en,
                        to_jsonb(s)->>'name_hi' AS name_hi,
                        s.ministry,
                        s.description_en,
                        to_jsonb(s)->>'description_hi' AS description_hi,
                        s.government_level AS government,
                        s.category,
                        s.benefit_en,
                        to_jsonb(s)->>'benefit_hi' AS benefit_hi,
                        s.official_url,
                        s.guidelines_url,
                        s.last_verified_at
                    FROM public.schemes AS s
                    WHERE s.id = :scheme_id
                      AND s.is_active = TRUE
                """),
                {"scheme_id": scheme_id},
            )

            scheme = result.mappings().first()

            if scheme is None:
                raise HTTPException(
                    status_code=404,
                    detail=(
                        "Scheme not found."
                        if language == "en"
                        else "योजना नहीं मिली।"
                    ),
                )

            scheme_data = dict(scheme)

            scheme_data["name"] = translated_value(
                scheme_data, "name_en", "name_hi", language
            )

            scheme_data["description"] = translated_value(
                scheme_data, "description_en", "description_hi", language
            )

            scheme_data["benefits"] = translated_value(
                scheme_data, "benefit_en", "benefit_hi", language
            )

            document_result = connection.execute(
                text("""
                    SELECT
                        d.id,
                        d.name_en,
                        to_jsonb(d)->>'name_hi' AS name_hi,
                        d.description_en,
                        to_jsonb(d)->>'description_hi' AS description_hi,
                        d.is_mandatory
                    FROM public.scheme_documents AS d
                    WHERE d.scheme_id = :scheme_id
                      AND d.is_active = TRUE
                    ORDER BY d.display_order, d.id
                """),
                {"scheme_id": scheme_id},
            )

            documents = []

            for row in document_result.mappings().all():
                document = dict(row)

                document["name"] = translated_value(
                    document, "name_en", "name_hi", language
                )

                document["description"] = translated_value(
                    document, "description_en", "description_hi", language
                )

                documents.append(document)

            rule_result = connection.execute(
                text("""
                    SELECT
                        r.rule_code,
                        r.explanation_en,
                        r.explanation_hi
                    FROM public.scheme_rules AS r
                    WHERE r.scheme_id = :scheme_id
                      AND r.is_active = TRUE
                      AND (
                          r.explanation_en IS NOT NULL
                          OR r.explanation_hi IS NOT NULL
                      )
                    ORDER BY r.id
                """),
                {"scheme_id": scheme_id},
            )

            conditions = []

            for row in rule_result.mappings().all():
                rule = dict(row)

                rule["description"] = translated_value(
                    rule, "explanation_en", "explanation_hi", language
                )

                conditions.append(rule)

            source_result = connection.execute(
                text("""
                    SELECT
                        title,
                        source_type,
                        url,
                        last_checked_at
                    FROM public.scheme_sources
                    WHERE scheme_id = :scheme_id
                      AND is_active = TRUE
                    ORDER BY id
                """),
                {"scheme_id": scheme_id},
            )

            scheme_data["documents"] = documents
            scheme_data["eligibility_conditions"] = conditions
            scheme_data["sources"] = [
                dict(row) for row in source_result.mappings().all()
            ]

            return scheme_data

    except HTTPException:
        raise

    except SQLAlchemyError as error:
        logger.exception("Database error while retrieving scheme details")
        raise HTTPException(
            status_code=503,
            detail=(
                "Unable to retrieve scheme details."
                if language == "en"
                else "योजना की जानकारी प्राप्त नहीं हो सकी।"
            ),
        ) from error


# Request body for the eligibility-check API
class EligibilityCheckRequest(BaseModel):
    scheme_id: int | None = None
    answers: dict[str, Any] = Field(default_factory=dict)
    language: str = "en"


# Compare one citizen answer with one stored rule
def evaluate_rule(actual: Any, operator: str, expected: Any):
    if actual is None or actual == "":
        return None

    value = str(actual).strip().lower()

    if value in {
        "not_sure",
        "not sure",
        "unknown",
        "don't know",
        "पता नहीं",
        "निश्चित नहीं",
    }:
        return None

    if operator == "eq":
        if isinstance(expected, bool):
            if value in {"yes", "true", "1", "हाँ", "हां"}:
                actual_value = True
            elif value in {"no", "false", "0", "नहीं"}:
                actual_value = False
            else:
                return None

            return actual_value is expected

        if isinstance(expected, (int, float)) and not isinstance(expected, bool):
            try:
                return float(actual) == float(expected)
            except (TypeError, ValueError):
                return None

        return value == str(expected).strip().lower()

    if operator == "in":
        if not isinstance(expected, list):
            return None

        allowed = {str(item).strip().lower() for item in expected}
        return value in allowed

    if operator in {"gt", "gte", "lt", "lte"}:
        try:
            actual_number = float(actual)
            expected_number = float(expected)
        except (TypeError, ValueError):
            return None

        if operator == "gt":
            return actual_number > expected_number

        if operator == "gte":
            return actual_number >= expected_number

        if operator == "lt":
            return actual_number < expected_number

        return actual_number <= expected_number

    logger.warning("Unsupported eligibility rule operator: %s", operator)
    return None


# API 3: Get relevant eligibility questions
@app.get("/api/eligibility/questions")
def get_eligibility_questions(
    scheme_id: int | None = None,
    language: str = "en",
):
    language = get_language(language)

    try:
        with engine.connect() as connection:
            scheme = None

            if scheme_id is not None:
                scheme_result = connection.execute(
                    text("""
                        SELECT
                            id,
                            name_en,
                            name_hi
                        FROM public.schemes
                        WHERE id = :scheme_id
                          AND is_active = TRUE
                    """),
                    {"scheme_id": scheme_id},
                )

                scheme = scheme_result.mappings().first()

                if scheme is None:
                    raise HTTPException(
                        status_code=404,
                        detail=(
                            "Scheme not found."
                            if language == "en"
                            else "योजना नहीं मिली।"
                        ),
                    )

                scheme = dict(scheme)
                scheme["name"] = translated_value(
                    scheme, "name_en", "name_hi", language
                )

            result = connection.execute(
                text("""
                    SELECT
                        id,
                        scheme_id,
                        field_key,
                        label_en,
                        label_hi,
                        help_text_en,
                        help_text_hi,
                        type,
                        options,
                        is_required,
                        display_order
                    FROM public.scheme_questions
                    WHERE is_active = TRUE
                      AND (
                          CAST(:scheme_id AS BIGINT) IS NULL
                          OR scheme_id = CAST(:scheme_id AS BIGINT)
                      )
                    ORDER BY scheme_id, display_order, id
                """),
                {"scheme_id": scheme_id},
            )

            questions = []

            for row in result.mappings().all():
                question = dict(row)

                questions.append({
                    "id": str(question["id"]),
                    "scheme_id": question["scheme_id"],
                    "field_key": question["field_key"],
                    "label": translated_value(
                        question, "label_en", "label_hi", language
                    ),
                    "help_text": translated_value(
                        question, "help_text_en", "help_text_hi", language
                    ),
                    "type": question["type"],
                    "options": question["options"] or [],
                    "required": question["is_required"],
                    "display_order": question["display_order"],
                })

            return {
                "scheme": scheme,
                "questions": questions,
                "language": language,
            }

    except HTTPException:
        raise

    except SQLAlchemyError as error:
        logger.exception("Database error while retrieving eligibility questions")
        raise HTTPException(
            status_code=503,
            detail=(
                "Unable to retrieve eligibility questions."
                if language == "en"
                else "पात्रता संबंधी प्रश्न प्राप्त नहीं हो सके।"
            ),
        ) from error


# API 4: Evaluate citizen answers against active scheme rules
@app.post("/api/eligibility/check")
def check_eligibility(request: EligibilityCheckRequest):
    language = get_language(request.language)

    try:
        with engine.connect() as connection:
            question_result = connection.execute(
                text("""
                    SELECT
                        id,
                        scheme_id,
                        field_key
                    FROM public.scheme_questions
                    WHERE is_active = TRUE
                      AND (
                          CAST(:scheme_id AS BIGINT) IS NULL
                          OR scheme_id = CAST(:scheme_id AS BIGINT)
                      )
                """),
                {"scheme_id": request.scheme_id},
            )

            answers_by_scheme = defaultdict(dict)

            for question in question_result.mappings().all():
                question_id = str(question["id"])

                if question_id in request.answers:
                    answers_by_scheme[question["scheme_id"]][
                        question["field_key"]
                    ] = request.answers[question_id]

            rules_result = connection.execute(
                text("""
                    SELECT
                        r.id,
                        r.scheme_id,
                        r.rule_code,
                        r.rule_group,
                        r.field_key,
                        r.operator,
                        r.expected_value,
                        r.rule_type,
                        r.explanation_en,
                        r.explanation_hi,
                        s.name_en,
                        s.name_hi,
                        s.official_url,
                        s.last_verified_at
                    FROM public.scheme_rules AS r
                    JOIN public.schemes AS s
                      ON s.id = r.scheme_id
                    WHERE r.is_active = TRUE
                      AND s.is_active = TRUE
                      AND (
                          CAST(:scheme_id AS BIGINT) IS NULL
                          OR r.scheme_id = CAST(:scheme_id AS BIGINT)
                      )
                    ORDER BY r.scheme_id, r.rule_group, r.id
                """),
                {"scheme_id": request.scheme_id},
            )

            rules_by_scheme = defaultdict(list)

            for rule in rules_result.mappings().all():
                rules_by_scheme[rule["scheme_id"]].append(rule)

            if (
                request.scheme_id is not None
                and request.scheme_id not in rules_by_scheme
            ):
                scheme_result = connection.execute(
                    text("""
                        SELECT
                            id,
                            name_en,
                            name_hi,
                            official_url,
                            last_verified_at
                        FROM public.schemes
                        WHERE id = :sid
                          AND is_active = TRUE
                    """),
                    {"sid": request.scheme_id},
                )

                scheme = scheme_result.mappings().first()

                if scheme is None:
                    raise HTTPException(
                        status_code=404,
                        detail=(
                            "Scheme not found."
                            if language == "en"
                            else "योजना नहीं मिली।"
                        ),
                    )

                return {
                    "assessment_id": None,
                    "results": [{
                        "scheme_id": scheme["id"],
                        "scheme_name": translated_value(
                            dict(scheme), "name_en", "name_hi", language
                        ),
                        "status": "needs_verification",
                        "explanation": (
                            "Eligibility rules for this scheme are not configured yet."
                            if language == "en"
                            else "इस योजना के पात्रता नियम अभी उपलब्ध नहीं हैं।"
                        ),
                        "conditions": [],
                        "missing_information": [
                            "Verified eligibility rules"
                            if language == "en"
                            else "सत्यापित पात्रता नियम"
                        ],
                        "official_url": scheme["official_url"],
                        "last_verified_at": scheme["last_verified_at"],
                    }],
                }

            results = []

            for current_scheme_id, rules in rules_by_scheme.items():
                answers = answers_by_scheme[current_scheme_id]
                first_rule = rules[0]

                scheme_name = translated_value(
                    dict(first_rule), "name_en", "name_hi", language
                )

                # PM-JAY: prototype screens only the 70+ pathway.
                if current_scheme_id == 4:
                    age = answers.get("age_years")

                    try:
                        age_value = (
                            float(age)
                            if age not in (None, "")
                            else None
                        )
                    except (TypeError, ValueError):
                        age_value = None

                    if age_value is None or age_value < 70:
                        if language == "hi":
                            reason = (
                                "वरिष्ठ नागरिक पात्रता जाँचने के लिए आयु की जानकारी आवश्यक है।"
                                if age_value is None
                                else "यह प्रोटोटाइप केवल PM-JAY की 70+ आयु वाली श्रेणी की जाँच करता है। अन्य पात्रता की पुष्टि आधिकारिक लाभार्थी रिकॉर्ड से करें।"
                            )
                        else:
                            reason = (
                                "Age information is needed to assess the senior-citizen pathway."
                                if age_value is None
                                else "This prototype screens the PM-JAY 70+ pathway only. Other PM-JAY eligibility must be verified through official beneficiary records."
                            )

                        results.append({
                            "scheme_id": current_scheme_id,
                            "scheme_name": scheme_name,
                            "status": "needs_verification",
                            "explanation": reason,
                            "conditions": [],
                            "missing_information": [
                                "आयु या आधिकारिक PM-JAY लाभार्थी सत्यापन"
                                if language == "hi"
                                else "Age or official PM-JAY beneficiary verification"
                            ],
                            "official_url": first_rule["official_url"],
                            "last_verified_at": first_rule["last_verified_at"],
                        })
                        continue

                # PM-USP: renewal applications need separate verification.
                if (
                    current_scheme_id == 5
                    and answers.get("application_type") == "renewal"
                ):
                    results.append({
                        "scheme_id": current_scheme_id,
                        "scheme_name": scheme_name,
                        "status": "needs_verification",
                        "explanation": (
                            "The current ruleset screens fresh applications only. Renewal conditions need separate verification."
                            if language == "en"
                            else "वर्तमान नियम केवल नए आवेदनों की जाँच करते हैं। नवीनीकरण की शर्तों की अलग से पुष्टि आवश्यक है।"
                        ),
                        "conditions": [],
                        "missing_information": [
                            "Official renewal criteria"
                            if language == "en"
                            else "नवीनीकरण के आधिकारिक नियम"
                        ],
                        "official_url": first_rule["official_url"],
                        "last_verified_at": first_rule["last_verified_at"],
                    })
                    continue

                conditions = []
                missing_information = []
                group_results = defaultdict(list)
                hard_failures = []

                for rule in rules:
                    field_key = rule["field_key"]
                    actual = answers.get(field_key)

                    passed = evaluate_rule(
                        actual,
                        rule["operator"],
                        rule["expected_value"],
                    )

                    rule_type = rule["rule_type"]
                    group = rule["rule_group"]

                    explanation = translated_value(
                        dict(rule),
                        "explanation_en",
                        "explanation_hi",
                        language,
                    )

                    label = (
                        field_key.replace("_", " ").title()
                        if field_key
                        else (
                            "पात्रता की शर्त"
                            if language == "hi"
                            else "Eligibility condition"
                        )
                    )

                    if passed is True:
                        outcome = "passed"
                    elif passed is False:
                        outcome = "not_met"
                    else:
                        outcome = "needs_verification"

                    conditions.append({
                        "id": rule["rule_code"],
                        "label": label,
                        "explanation": explanation,
                        "outcome": outcome,
                    })

                    if passed is True:
                        group_results[group].append(True)

                    elif (
                        passed is False
                        and rule_type not in {
                            "application_requirement",
                            "assessment_scope",
                        }
                    ):
                        group_results[group].append(False)
                        hard_failures.append(label)

                    else:
                        group_results[group].append(None)
                        missing_information.append(
                            explanation or label
                        )

                # Conditions in one group are AND.
                # Alternative groups are OR.
                group_passed = any(
                    all(value is True for value in values)
                    for values in group_results.values()
                )

                group_uncertain = any(
                    all(value is not False for value in values)
                    and any(value is None for value in values)
                    for values in group_results.values()
                )

                if group_passed:
                    status = "potentially_eligible"
                    explanation = (
                        "Your answers satisfy the configured screening conditions. This is a preliminary assessment, not official government approval."
                        if language == "en"
                        else "आपके उत्तर उपलब्ध पात्रता शर्तों से मेल खाते हैं। यह प्रारंभिक जाँच है, सरकारी स्वीकृति नहीं।"
                    )

                elif group_uncertain:
                    status = "needs_verification"
                    explanation = (
                        "Some information is missing, uncertain, or requires verification. We cannot confirm eligibility from the available answers."
                        if language == "en"
                        else "कुछ जानकारी उपलब्ध नहीं है या उसकी पुष्टि आवश्यक है। अभी पात्रता की पुष्टि नहीं की जा सकती।"
                    )

                elif hard_failures:
                    status = "not_eligible"
                    explanation = (
                        "At least one configured eligibility condition appears not to be satisfied. This is a screening result, not an official government rejection."
                        if language == "en"
                        else "उपलब्ध जानकारी के अनुसार कम से कम एक पात्रता शर्त पूरी नहीं होती। यह प्रारंभिक जाँच है, सरकारी अस्वीकृति नहीं।"
                    )

                else:
                    status = "needs_verification"
                    explanation = (
                        "The available rules are insufficient to make a reliable decision. Please verify with the official scheme authority."
                        if language == "en"
                        else "विश्वसनीय निर्णय लेने के लिए उपलब्ध नियम पर्याप्त नहीं हैं। कृपया योजना के आधिकारिक विभाग से पुष्टि करें।"
                    )

                results.append({
                    "scheme_id": current_scheme_id,
                    "scheme_name": scheme_name,
                    "status": status,
                    "explanation": explanation,
                    "conditions": conditions,
                    "missing_information": list(
                        dict.fromkeys(missing_information)
                    ),
                    "official_url": first_rule["official_url"],
                    "last_verified_at": first_rule["last_verified_at"],
                })

            return {
                "assessment_id": None,
                "language": language,
                "results": results,
            }

    except HTTPException:
        raise

    except SQLAlchemyError as error:
        logger.exception("Database error during eligibility assessment")
        raise HTTPException(
            status_code=503,
            detail=(
                "Eligibility assessment is temporarily unavailable."
                if language == "en"
                else "पात्रता की जाँच अभी उपलब्ध नहीं है।"
            ),
        ) from error
