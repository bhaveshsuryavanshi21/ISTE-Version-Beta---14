import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, ChevronRight, CalendarDays, UserRound, MapPin, Map,
  BriefcaseBusiness, IndianRupee, Users, GraduationCap,
  Accessibility, ArrowRight, ArrowLeft
} from "lucide-react";

const initialForm = {
  age: "",
  gender: "",
  state: "Madhya Pradesh",
  district: "",
  occupation: "",
  income: "",
  category: "",
  education: "",
  disability: false
};

const districts = [
  "Bhopal", "Indore", "Jabalpur", "Gwalior", "Seoni",
  "Rewa", "Ujjain", "Sagar", "Satna", "Chhindwara",
  "Dewas", "Raisen", "Vidisha", "Betul", "Other"
];

const occupationQuestions = {
  farmer: [
    { id: "land_ownership", title: "Do you own agricultural land?", options: ["Yes", "No", "Leased land"] },
    { id: "land_size", title: "What is your agricultural land size?", options: ["Below 1 hectare", "1–2 hectares", "Above 2 hectares", "No land"] },
    { id: "farming_type", title: "What type of farming do you practice?", options: ["Crop farming", "Dairy farming", "Both", "Other"] },
    { id: "kisan_card", title: "Do you have a Kisan Credit Card?", options: ["Yes", "No", "Not sure"] }
  ],
  student: [
    { id: "course", title: "What are you currently studying?", options: ["School", "Diploma", "Undergraduate", "Postgraduate", "Other"] },
    { id: "institution", title: "Which type of institution do you attend?", options: ["Government", "Private", "Government-aided"] },
    { id: "scholarship", title: "Are you currently receiving a scholarship?", options: ["Yes", "No"] },
    { id: "hostel", title: "Do you live in a hostel?", options: ["Yes", "No"] }
  ],
  employed: [
    { id: "job_type", title: "What type of employment do you have?", options: ["Government", "Private", "Contractual"] },
    { id: "salary", title: "What is your monthly salary?", options: ["Below ₹10,000", "₹10,000–₹25,000", "₹25,000–₹50,000", "Above ₹50,000"] },
    { id: "pf", title: "Do you receive EPF benefits?", options: ["Yes", "No", "Not sure"] }
  ],
  self_employed: [
    { id: "work_type", title: "What type of work do you do?", options: ["Freelancing", "Services", "Artisan", "Other"] },
    { id: "registration", title: "Is your work or business registered?", options: ["Yes", "No", "In process"] },
    { id: "annual_income", title: "What is your approximate annual income?", options: ["Below ₹1 lakh", "₹1–2.5 lakh", "₹2.5–5 lakh", "Above ₹5 lakh"] }
  ],
  business: [
    { id: "business_type", title: "What type of business do you operate?", options: ["Retail", "Manufacturing", "Services", "Other"] },
    { id: "registration", title: "Is your business registered?", options: ["Yes", "No", "In process"] },
    { id: "udyam", title: "Do you have Udyam Registration?", options: ["Yes", "No", "Not sure"] },
    { id: "annual_income", title: "What is your approximate annual business income?", options: ["Below ₹1 lakh", "₹1–2.5 lakh", "₹2.5–5 lakh", "Above ₹5 lakh"] }
  ],
  unemployed: [
    { id: "job_seeking", title: "Are you currently looking for a job?", options: ["Yes", "No"] },
    { id: "skill_training", title: "Have you completed any skill training?", options: ["Yes", "No", "Currently enrolled"] },
    { id: "employment_exchange", title: "Are you registered with an employment exchange?", options: ["Yes", "No"] }
  ],
  homemaker: [
    { id: "shg", title: "Are you a member of a Self Help Group (SHG)?", options: ["Yes", "No"] },
    { id: "income_activity", title: "Are you involved in an income-generating activity?", options: ["Yes", "No", "Planning to start"] },
    { id: "ration_card", title: "Does your family have a ration card?", options: ["Yes", "No"] }
  ],
  other: [
    { id: "work_type", title: "Which option best describes your current work?", options: ["Daily wage worker", "Artisan", "Retired", "Other"] },
    { id: "ration_card", title: "Does your family have a ration card?", options: ["Yes", "No"] }
  ]
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        {Icon && <Icon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
        {children}
      </div>
    </div>
  );
}

function Stepper({ step }) {
  const labels = ["Personal Details", "Additional Questions", "Results"];
  return (
    <div className="mx-auto mb-8 flex max-w-4xl items-center px-2">
      {labels.map((label, index) => {
        const number = index + 1;
        const active = number === step;
        const completed = number < step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex min-w-[85px] flex-col items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                active || completed ? "bg-emerald-800 text-white" : "border border-slate-300 bg-white text-slate-500"
              }`}>
                {completed ? "✓" : number}
              </div>
              <span className={`text-center text-xs sm:text-sm ${active ? "font-semibold text-emerald-800" : "text-slate-500"}`}>
                {label}
              </span>
            </div>
            {number !== 3 && <div className={`mb-6 h-[2px] flex-1 ${completed ? "bg-emerald-700" : "bg-slate-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function Eligibility() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [additionalAnswers, setAdditionalAnswers] = useState({});

  const updateField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const goTo = nextStep => {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePersonalDetails = event => {
    event.preventDefault();

    if (
      !form.age || Number(form.age) < 1 || Number(form.age) > 120 ||
      !form.gender || !form.state || !form.district ||
      !form.occupation || !form.income || !form.category || !form.education
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setAdditionalAnswers({});
    goTo(2);
  };

  const handleAdditionalQuestions = event => {
    event.preventDefault();

    const questions = occupationQuestions[form.occupation] || [];
    const hasUnanswered = questions.some(question => !additionalAnswers[question.id]);

    if (hasUnanswered) {
      alert("Please answer all the questions.");
      return;
    }

    const eligibilityData = {
      personalDetails: form,
      additionalAnswers
    };

    sessionStorage.setItem("janSahayakEligibility", JSON.stringify(eligibilityData));

    // Results.jsx reads the same data from route state or sessionStorage.
    navigate("/results", { state: { eligibilityData } });
  };

  const questions = occupationQuestions[form.occupation] || [];

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
        <Home size={17} /> Home <ChevronRight size={17} /> Check Eligibility
        <ChevronRight size={17} /> <span className="font-medium text-slate-900">Step {step}</span>
      </div>

      <div className="mb-7">
        <h1 className="text-3xl font-bold text-slate-950">Check Your Eligibility</h1>
        <p className="mt-2 text-base text-slate-500">
          {step === 1
            ? "Fill in your details to discover government schemes you may qualify for."
            : "Answer a few questions based on your occupation."}
        </p>
      </div>

      <Stepper step={step} />

      {step === 1 && (
        <form onSubmit={handlePersonalDetails} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-1 text-xl font-bold text-slate-900">Personal Details</h2>
          <p className="mb-7 text-sm text-slate-500">Please fill in your basic information.</p>

          <div className="grid grid-cols-1 gap-x-7 gap-y-6 md:grid-cols-2">
            <Field label="Age" icon={CalendarDays}>
              <input type="number" min="1" max="120" required value={form.age}
                onChange={e => updateField("age", e.target.value)}
                placeholder="Enter your age" className={`${inputClass} pl-10`} />
            </Field>

            <Field label="Gender" icon={UserRound}>
              <select required value={form.gender} onChange={e => updateField("gender", e.target.value)}
                className={`${inputClass} pl-10`}>
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="State" icon={MapPin}>
              <select required value={form.state} onChange={e => updateField("state", e.target.value)}
                className={`${inputClass} pl-10`}>
                {["Madhya Pradesh", "Uttar Pradesh", "Maharashtra", "Rajasthan", "Gujarat", "Bihar", "Delhi", "Other"]
                  .map(value => <option key={value} value={value}>{value}</option>)}
              </select>
            </Field>

            <Field label="District" icon={Map}>
              <select required value={form.district} onChange={e => updateField("district", e.target.value)}
                className={`${inputClass} pl-10`}>
                <option value="">Select district</option>
                {districts.map(value => <option key={value}>{value}</option>)}
              </select>
            </Field>

            <Field label="Occupation" icon={BriefcaseBusiness}>
              <select required value={form.occupation}
                onChange={e => {
                  updateField("occupation", e.target.value);
                  setAdditionalAnswers({});
                }}
                className={`${inputClass} pl-10`}>
                <option value="">Select occupation</option>
                <option value="farmer">Farmer</option>
                <option value="student">Student</option>
                <option value="employed">Salaried / Employed</option>
                <option value="self_employed">Self-employed</option>
                <option value="business">Business Owner</option>
                <option value="unemployed">Unemployed</option>
                <option value="homemaker">Homemaker</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Annual Family Income" icon={IndianRupee}>
              <select required value={form.income} onChange={e => updateField("income", e.target.value)}
                className={`${inputClass} pl-10`}>
                <option value="">Select income range</option>
                <option value="below_1_lakh">Below ₹1 lakh</option>
                <option value="1_to_2_5_lakh">₹1 lakh – ₹2.5 lakh</option>
                <option value="2_5_to_5_lakh">₹2.5 lakh – ₹5 lakh</option>
                <option value="5_to_8_lakh">₹5 lakh – ₹8 lakh</option>
                <option value="above_8_lakh">Above ₹8 lakh</option>
              </select>
            </Field>

            <Field label="Social Category" icon={Users}>
              <select required value={form.category} onChange={e => updateField("category", e.target.value)}
                className={`${inputClass} pl-10`}>
                <option value="">Select category</option>
                <option value="general">General</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </Field>

            <Field label="Education Level" icon={GraduationCap}>
              <select required value={form.education} onChange={e => updateField("education", e.target.value)}
                className={`${inputClass} pl-10`}>
                <option value="">Select education level</option>
                <option value="illiterate">No formal education</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="higher_secondary">Higher Secondary</option>
                <option value="graduate">Graduate</option>
                <option value="postgraduate">Postgraduate</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>

          <label className="mt-7 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
            <input type="checkbox" checked={form.disability}
              onChange={e => updateField("disability", e.target.checked)}
              className="h-4 w-4 accent-emerald-800" />
            <Accessibility size={19} /> Do you have a disability? (Optional)
          </label>

          <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
            <button type="submit" className="flex items-center gap-2 rounded-lg bg-emerald-800 px-7 py-3 font-semibold text-white hover:bg-emerald-900">
              Next Step <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleAdditionalQuestions} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-1 text-xl font-bold text-slate-900">Additional Questions</h2>
          <p className="mb-7 text-sm text-slate-500">These questions are based on your selected occupation.</p>

          <div className="mb-7 rounded-lg bg-emerald-50 p-4">
            <p className="text-sm text-emerald-900">Selected occupation</p>
            <p className="mt-1 font-semibold capitalize text-emerald-800">
              {form.occupation.replaceAll("_", " ")}
            </p>
          </div>

          <div className="space-y-7">
            {questions.map((question, index) => (
              <div key={question.id}>
                <h3 className="mb-3 font-semibold text-slate-800">
                  {index + 1}. {question.title} <span className="text-red-500">*</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {question.options.map(option => (
                    <label key={option}
                      className={`cursor-pointer rounded-lg border px-5 py-3 text-sm transition ${
                        additionalAnswers[question.id] === option
                          ? "border-emerald-700 bg-emerald-50 font-semibold text-emerald-800"
                          : "border-slate-200 text-slate-700 hover:border-emerald-600"
                      }`}>
                      <input type="radio" name={question.id} value={option}
                        checked={additionalAnswers[question.id] === option}
                        onChange={() => setAdditionalAnswers(prev => ({ ...prev, [question.id]: option }))}
                        className="sr-only" />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
            <button type="button" onClick={() => goTo(1)}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
              <ArrowLeft size={18} /> Previous
            </button>
            <button type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-7 py-3 font-semibold text-white hover:bg-emerald-900">
              View My Results <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
