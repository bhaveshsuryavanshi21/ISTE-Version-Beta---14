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
    title="Jan Sahayak API",
    description="Government Scheme Eligibility Assistant",
    version="1.0.0",
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


@app.get("/")
def home():
    return {"message": "Jan Sahayak Backend is Running!"}


# API 1: Get all active schemes
@app.get("/api/schemes")
def get_schemes():
    try:
        with engine.connect() as connection:
            result = connection.execute(
                text(
                    """
                    SELECT
                        id,
                        name_en AS name,
                        ministry,
                        description_en AS description,
                        government_level AS government,
                        category,
                        benefit_en AS benefit_summary,
                        last_verified_at
                    FROM public.schemes
                    WHERE is_active = TRUE
                    ORDER BY name_en
                    """
                )
            )
            return [dict(row) for row in result.mappings().all()]

    except SQLAlchemyError as error:
        logger.exception("Database error while retrieving schemes")
        raise HTTPException(
            status_code=503,
            detail="Scheme data is temporarily unavailable.",
        ) from error


# API 2: Get details of one scheme
@app.get("/api/schemes/{scheme_id}")
def get_scheme_details(scheme_id: int):
    try:
        with engine.connect() as connection:
            result = connection.execute(
                text(
                    """
                    SELECT
                        id,
                        name_en AS name,
                        ministry,
                        description_en AS description,
                        government_level AS government,
                        category,
                        benefit_en AS benefits,
                        official_url,
                        guidelines_url,
                        last_verified_at
                    FROM public.schemes
                    WHERE id = :scheme_id
                      AND is_active = TRUE
                    """
                ),
                {"scheme_id": scheme_id},
            )
            scheme = result.mappings().first()

            if scheme is None:
                raise HTTPException(status_code=404, detail="Scheme not found.")

            document_result = connection.execute(
                text(
                    """
                    SELECT
                        id,
                        name_en AS name,
                        description_en AS description,
                        is_mandatory
                    FROM public.scheme_documents
                    WHERE scheme_id = :scheme_id
                      AND is_active = TRUE
                    ORDER BY display_order, id
                    """
                ),
                {"scheme_id": scheme_id},
            )

            rule_result = connection.execute(
                text(
                    """
                    SELECT
                        rule_code,
                        explanation_en AS description
                    FROM public.scheme_rules
                    WHERE scheme_id = :scheme_id
                      AND is_active = TRUE
                      AND explanation_en IS NOT NULL
                    ORDER BY id
                    """
                ),
                {"scheme_id": scheme_id},
            )

            source_result = connection.execute(
                text(
                    """
                    SELECT title, source_type, url, last_checked_at
                    FROM public.scheme_sources
                    WHERE scheme_id = :scheme_id
                      AND is_active = TRUE
                    ORDER BY id
                    """
                ),
                {"scheme_id": scheme_id},
            )

            scheme_data = dict(scheme)
            scheme_data["documents"] = [
                dict(row) for row in document_result.mappings().all()
            ]
            scheme_data["eligibility_conditions"] = [
                dict(row) for row in rule_result.mappings().all()
            ]
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
            detail="Unable to retrieve scheme details.",
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
    if value in {"not_sure", "not sure", "unknown", "don't know"}:
        return None

    if operator == "eq":
        if isinstance(expected, bool):
            if value in {"yes", "true", "1"}:
                actual_value = True
            elif value in {"no", "false", "0"}:
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
    language = "hi" if language == "hi" else "en"

    try:
        with engine.connect() as connection:
            scheme = None

            if scheme_id is not None:
                scheme_result = connection.execute(
                    text(
                        """
                        SELECT id, name_en, name_hi
                        FROM public.schemes
                        WHERE id = :scheme_id
                          AND is_active = TRUE
                        """
                    ),
                    {"scheme_id": scheme_id},
                )
                scheme = scheme_result.mappings().first()

                if scheme is None:
                    raise HTTPException(status_code=404, detail="Scheme not found.")

                scheme = dict(scheme)

            result = connection.execute(
                text(
                    """
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
                    """
                ),
                {"scheme_id": scheme_id},
            )

            questions = []
            for row in result.mappings().all():
                label = row["label_hi"] if language == "hi" and row["label_hi"] else row["label_en"]
                help_text = (
                    row["help_text_hi"]
                    if language == "hi" and row["help_text_hi"]
                    else row["help_text_en"]
                )

                questions.append(
                    {
                        "id": str(row["id"]),
                        "scheme_id": row["scheme_id"],
                        "field_key": row["field_key"],
                        "label": label,
                        "help_text": help_text,
                        "type": row["type"],
                        "options": row["options"] or [],
                        "required": row["is_required"],
                    }
                )

            return {"scheme": scheme, "questions": questions}

    except HTTPException:
        raise
    except SQLAlchemyError as error:
        logger.exception("Database error while retrieving eligibility questions")
        raise HTTPException(
            status_code=503,
            detail="Unable to retrieve eligibility questions.",
        ) from error


# API 4: Evaluate citizen answers against active scheme rules
@app.post("/api/eligibility/check")
def check_eligibility(request: EligibilityCheckRequest):
    language = "hi" if request.language == "hi" else "en"

    try:
        with engine.connect() as connection:
            # Map question IDs (sent by React) to the rule field keys.
            question_result = connection.execute(
                text(
                    """
                    SELECT id, scheme_id, field_key
                    FROM public.scheme_questions
                    WHERE is_active = TRUE
                      AND (
                          CAST(:scheme_id AS BIGINT) IS NULL
                          OR scheme_id = CAST(:scheme_id AS BIGINT)
                      )
                    """
                ),
                {"scheme_id": request.scheme_id},
            )

            answers_by_scheme = defaultdict(dict)
            for question in question_result.mappings().all():
                question_id = str(question["id"])
                if question_id in request.answers:
                    answers_by_scheme[question["scheme_id"]][question["field_key"]] = (
                        request.answers[question_id]
                    )

            rules_result = connection.execute(
                text(
                    """
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
                        s.official_url,
                        s.last_verified_at
                    FROM public.scheme_rules AS r
                    JOIN public.schemes AS s ON s.id = r.scheme_id
                    WHERE r.is_active = TRUE
                      AND s.is_active = TRUE
                      AND (
                          CAST(:scheme_id AS BIGINT) IS NULL
                          OR r.scheme_id = CAST(:scheme_id AS BIGINT)
                      )
                    ORDER BY r.scheme_id, r.rule_group, r.id
                    """
                ),
                {"scheme_id": request.scheme_id},
            )

            all_rules = rules_result.mappings().all()
            rules_by_scheme = defaultdict(list)
            for rule in all_rules:
                rules_by_scheme[rule["scheme_id"]].append(rule)

            # If a specific scheme has no active rules, report verification needed.
            if request.scheme_id is not None and request.scheme_id not in rules_by_scheme:
                scheme_result = connection.execute(
                    text("SELECT id, name_en, official_url, last_verified_at FROM public.schemes WHERE id = :sid AND is_active = TRUE"),
                    {"sid": request.scheme_id},
                )
                scheme = scheme_result.mappings().first()
                if scheme is None:
                    raise HTTPException(status_code=404, detail="Scheme not found.")
                return {
                    "assessment_id": None,
                    "results": [{
                        "scheme_id": scheme["id"],
                        "scheme_name": scheme["name_en"],
                        "status": "needs_verification",
                        "explanation": "Eligibility rules for this scheme are not configured yet.",
                        "conditions": [],
                        "missing_information": ["Verified eligibility rules"],
                        "official_url": scheme["official_url"],
                        "last_verified_at": scheme["last_verified_at"],
                    }],
                }

            results = []
            for current_scheme_id, rules in rules_by_scheme.items():
                answers = answers_by_scheme[current_scheme_id]
                first_rule = rules[0]

                # This initial prototype only screens the PM-JAY 70+ route.
                if current_scheme_id == 4:
                    age = answers.get("age_years")
                    try:
                        age_value = float(age) if age not in (None, "") else None
                    except (TypeError, ValueError):
                        age_value = None

                    if age_value is None or age_value < 70:
                        reason = (
                            "Age information is needed to assess the senior-citizen pathway."
                            if age_value is None
                            else "This prototype screens the PM-JAY 70+ pathway only. Other PM-JAY eligibility must be verified through official beneficiary records."
                        )
                        results.append({
                            "scheme_id": current_scheme_id,
                            "scheme_name": first_rule["name_en"],
                            "status": "needs_verification",
                            "explanation": reason,
                            "conditions": [],
                            "missing_information": ["Age or official PM-JAY beneficiary verification"],
                            "official_url": first_rule["official_url"],
                            "last_verified_at": first_rule["last_verified_at"],
                        })
                        continue

                # Renewal applicants require a separate PM-USP ruleset.
                if current_scheme_id == 5 and answers.get("application_type") == "renewal":
                    results.append({
                        "scheme_id": current_scheme_id,
                        "scheme_name": first_rule["name_en"],
                        "status": "needs_verification",
                        "explanation": "The current ruleset screens fresh applications only. Renewal conditions need separate verification.",
                        "conditions": [],
                        "missing_information": ["Official renewal criteria"],
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
                    passed = evaluate_rule(actual, rule["operator"], rule["expected_value"])
                    rule_type = rule["rule_type"]
                    group = rule["rule_group"]

                    explanation = (
                        rule["explanation_hi"]
                        if language == "hi" and rule["explanation_hi"]
                        else rule["explanation_en"]
                    )
                    label = field_key.replace("_", " ").title()

                    conditions.append({
                        "id": rule["rule_code"],
                        "label": label,
                        "explanation": explanation,
                        "outcome": "passed" if passed is True else "not_met" if passed is False else "needs_verification",
                    })

                    if passed is True:
                        group_results[group].append(True)
                    elif passed is False and rule_type not in {"application_requirement", "assessment_scope"}:
                        group_results[group].append(False)
                        hard_failures.append(label)
                    else:
                        # Missing, uncertain, or unsatisfied application requirements
                        # do not become a false eligibility rejection.
                        group_results[group].append(None)
                        missing_information.append(explanation or label)

                # Conditions within one group are AND; groups are alternatives (OR).
                group_passed = any(
                    all(value is True for value in values)
                    for values in group_results.values()
                )
                group_uncertain = any(
                    all(value is not False for value in values) and any(value is None for value in values)
                    for values in group_results.values()
                )

                if group_passed:
                    status = "potentially_eligible"
                    explanation = "Your answers satisfy the configured screening conditions. This is a preliminary assessment, not official government approval."
                elif group_uncertain:
                    status = "needs_verification"
                    explanation = "Some information is missing, uncertain, or requires verification. We cannot confirm eligibility from the available answers."
                elif hard_failures:
                    status = "not_eligible"
                    explanation = "At least one configured eligibility condition appears not to be satisfied. This is a screening result, not an official government rejection."
                else:
                    status = "needs_verification"
                    explanation = "The available rules are insufficient to make a reliable decision. Please verify with the official scheme authority."

                results.append({
                    "scheme_id": current_scheme_id,
                    "scheme_name": first_rule["name_en"],
                    "status": status,
                    "explanation": explanation,
                    "conditions": conditions,
                    "missing_information": list(dict.fromkeys(missing_information)),
                    "official_url": first_rule["official_url"],
                    "last_verified_at": first_rule["last_verified_at"],
                })

            return {"assessment_id": None, "results": results}

    except HTTPException:
        raise
    except SQLAlchemyError as error:
        logger.exception("Database error during eligibility assessment")
        raise HTTPException(
            status_code=503,
            detail="Eligibility assessment is temporarily unavailable.",
        ) from error
