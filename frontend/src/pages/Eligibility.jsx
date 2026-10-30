
import { useState } from "react";
import {
  CalendarDays,
  UserRound,
  MapPin,
  Map,
  BriefcaseBusiness,
  IndianRupee,
  Users,
  GraduationCap,
  Accessibility,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

const initialDetails = {
  age: "",
  gender: "",
  state: "Madhya Pradesh",
  district: "",
  occupation: "",
  income: "",
  category: "",
  education: "",
  disability: false,
};

const initialAdditional = {
  farmer: "",
  landOwnership: "",
  student: "",
  housing: "",
  healthInsurance: "",
  bankAccount: "",
  aadhaar: "",
};

const districts = [
  "Bhopal",
  "Indore",
  "Jabalpur",
  "Gwalior",
  "Ujjain",
  "Sagar",
  "Rewa",
  "Satna",
  "Seoni",
  "Chhindwara",
  "Dewas",
  "Ratlam",
  "Vidisha",
  "Raisen",
  "Other",
];

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function StepIndicator({ step }) {
  const steps = [
    "Personal Details",
    "Additional Questions",
    "Results",
  ];

  return (
    <div className="mb-8 flex items-center justify-between">
      {steps.map((label, index) => {
        const number = index + 1;
        const active = step === number;
        const completed = step > number;

        return (
          <div
            key={label}
            className="relative flex flex-1 flex-col items-center"
          >
            {index !== 0 && (
              <div
                className={`absolute right-1/2 top-5 h-[2px] w-full ${
                  completed || active
                    ? "bg-emerald-700"
                    : "bg-slate-200"
                }`}
              />
            )}

            <div
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                active || completed
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {completed ? <CheckCircle2 size={19} /> : number}
            </div>

            <span
              className={`mt-2 text-center text-xs font-medium sm:text-sm ${
                active
                  ? "text-emerald-800"
                  : "text-slate-500"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block min-w-0">
      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        {Icon && <Icon size={16} className="text-slate-500" />}
        {label} <span className="text-rose-500">*</span>
      </span>
      {children}
    </label>
  );
}

function SelectField({ label, icon, value, onChange, options }) {
  return (
    <Field label={label} icon={icon}>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

// STEP 1: Personal Details
function PersonalDetails({ details, setDetails, onNext }) {
  const update = (field, value) => {
    setDetails((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Personal Details
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Please fill in your basic information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

        <Field label="Age" icon={CalendarDays}>
          <input
            required
            type="number"
            min="1"
            max="120"
            value={details.age}
            onChange={(e) => update("age", e.target.value)}
            placeholder="Enter your age"
            className={inputClass}
          />
        </Field>

        <SelectField
          label="Gender"
          icon={UserRound}
          value={details.gender}
          onChange={(value) => update("gender", value)}
          options={["Male", "Female", "Other", "Prefer not to say"]}
        />

        <SelectField
          label="State"
          icon={MapPin}
          value={details.state}
          onChange={(value) => {
            update("state", value);
            update("district", "");
          }}
          options={[
            "Madhya Pradesh",
            "Maharashtra",
            "Uttar Pradesh",
            "Rajasthan",
            "Gujarat",
            "Other",
          ]}
        />

        <SelectField
          label="District"
          icon={Map}
          value={details.district}
          onChange={(value) => update("district", value)}
          options={
            details.state === "Madhya Pradesh"
              ? districts
              : ["Other"]
          }
        />

        <SelectField
          label="Occupation"
          icon={BriefcaseBusiness}
          value={details.occupation}
          onChange={(value) => update("occupation", value)}
          options={[
            "Farmer",
            "Student",
            "Self Employed",
            "Private Sector Employee",
            "Government Employee",
            "Unemployed",
            "Homemaker",
            "Other",
          ]}
        />

        <SelectField
          label="Annual Family Income"
          icon={IndianRupee}
          value={details.income}
          onChange={(value) => update("income", value)}
          options={[
            "Below ₹1 Lakh",
            "₹1 Lakh - ₹2.5 Lakh",
            "₹2.5 Lakh - ₹5 Lakh",
            "₹5 Lakh - ₹8 Lakh",
            "Above ₹8 Lakh",
          ]}
        />

        <SelectField
          label="Social Category"
          icon={Users}
          value={details.category}
          onChange={(value) => update("category", value)}
          options={[
            "General",
            "OBC",
            "SC",
            "ST",
            "Other",
            "Prefer not to say",
          ]}
        />

        <SelectField
          label="Education Level"
          icon={GraduationCap}
          value={details.education}
          onChange={(value) => update("education", value)}
          options={[
            "No Formal Education",
            "Primary",
            "Secondary",
            "Higher Secondary",
            "Graduate",
            "Postgraduate",
            "Other",
          ]}
        />
      </div>

      <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={details.disability}
          onChange={(e) => update("disability", e.target.checked)}
          className="h-4 w-4 accent-emerald-700"
        />
        <Accessibility size={18} />
        Do you have a disability? (Optional)
      </label>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
        >
          Next Step <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

// Reusable Yes / No question
function YesNoQuestion({ label, value, onChange }) {
  return (
    <Field label={label}>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        <option value="">Select an option</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
        <option value="Not Applicable">Not Applicable</option>
      </select>
    </Field>
  );
}

// STEP 2: Additional Questions
function AdditionalQuestions({
  details,
  answers,
  setAnswers,
  onNext,
  onBack,
}) {
  const update = (field, value) => {
    setAnswers((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Additional Questions
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Answer a few more questions to help us identify relevant schemes.
        </p>
      </div>

      <div className="mb-5 rounded-lg bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-900">
          Your selected occupation: {details.occupation}
        </p>
        <p className="mt-1 text-xs text-emerald-800">
          Please answer based on your current circumstances.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

        {details.occupation === "Farmer" && (
          <>
            <YesNoQuestion
              label="Do you own or cultivate agricultural land?"
              value={answers.landOwnership}
              onChange={(value) => update("landOwnership", value)}
            />

            <YesNoQuestion
              label="Are you currently engaged in farming?"
              value={answers.farmer}
              onChange={(value) => update("farmer", value)}
            />
          </>
        )}

        {details.occupation === "Student" && (
          <YesNoQuestion
            label="Are you currently enrolled in an educational institution?"
            value={answers.student}
            onChange={(value) => update("student", value)}
          />
        )}

        <YesNoQuestion
          label="Do you have a bank account?"
          value={answers.bankAccount}
          onChange={(value) => update("bankAccount", value)}
        />

        <YesNoQuestion
          label="Do you have an Aadhaar card?"
          value={answers.aadhaar}
          onChange={(value) => update("aadhaar", value)}
        />

        <YesNoQuestion
          label="Do you own a pucca house?"
          value={answers.housing}
          onChange={(value) => update("housing", value)}
        />

        <YesNoQuestion
          label="Do you currently have health insurance?"
          value={answers.healthInsurance}
          onChange={(value) => update("healthInsurance", value)}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={18} /> Previous
        </button>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
        >
          View Results <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

// STEP 3: Results
function EligibilityResults({ details, answers, onBack }) {
  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={30} className="text-emerald-700" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Your Information is Ready!
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Your details have been collected successfully.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 p-5">
        <h3 className="mb-4 font-semibold text-slate-900">
          Personal Details Summary
        </h3>

        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          {[
            ["Age", details.age],
            ["Gender", details.gender],
            ["State", details.state],
            ["District", details.district],
            ["Occupation", details.occupation],
            ["Annual Income", details.income],
            ["Social Category", details.category],
            ["Education", details.education],
            ["Disability", details.disability ? "Yes" : "No"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-slate-500">{label}</p>
              <p className="mt-1 font-semibold text-slate-800">
                {value || "Not provided"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 p-5">
        <h3 className="mb-3 font-semibold text-slate-900">
          Additional Answers
        </h3>

        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          {Object.entries(answers)
            .filter(([, value]) => value !== "")
            .map(([key, value]) => (
              <div key={key}>
                <p className="capitalize text-slate-500">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {value}
                </p>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        These details are ready for eligibility assessment. Actual scheme
        matches will be determined only after applying verified official
        eligibility rules. This demo does not confirm eligibility.
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={18} /> Previous
        </button>

        <button
          onClick={() => window.location.href = "/schemes"}
          className="flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
        >
          Explore Schemes <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function Eligibility() {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState(initialDetails);
  const [answers, setAnswers] = useState(initialAdditional);

  return (
    <div className="mx-auto max-w-[1050px]">

      {/* Breadcrumb */}
      <button
        onClick={() => window.location.href = "/"}
        className="mb-5 flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-800"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Check Your Eligibility
        </h1>
        <p className="mt-2 text-sm text-slate-500 md:text-base">
          Fill in your details to see which government schemes you may qualify for.
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator step={step} />

      {/* Main Form Card */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 md:p-8">

        {step === 1 && (
          <PersonalDetails
            details={details}
            setDetails={setDetails}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <AdditionalQuestions
            details={details}
            answers={answers}
            setAnswers={setAnswers}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <EligibilityResults
            details={details}
            answers={answers}
            onBack={() => setStep(2)}
          />
        )}
      </section>

      {/* Footer Note */}
      <p className="mt-5 text-center text-xs text-slate-400">
        Your information should be handled securely and used only for scheme assessment.
      </p>
    </div>
  );
}
