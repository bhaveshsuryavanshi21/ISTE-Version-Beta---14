import { Link, useOutletContext } from "react-router-dom";
import {
  HelpCircle,
  ShieldCheck,
  Mic,
  FileText,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

const CONTENT = {
  en: {
    title: "Help & Privacy",
    intro: "Learn how Jan Sahayak works and how your information is handled.",
    sections: [
      {
        icon: HelpCircle,
        title: "How Jan Sahayak works",
        text: "Jan Sahayak helps citizens discover government schemes, answer relevant eligibility questions and understand preliminary eligibility results.",
      },
      {
        icon: ShieldCheck,
        title: "Your information and privacy",
        text: "Your answers are sent to our backend for eligibility assessment. The current prototype does not permanently save your answers. Assessment result summaries are stored in your browser using localStorage.",
      },
      {
        icon: FileText,
        title: "Saved assessment history",
        text: "The latest 20 assessments are retained in your browser. They are not automatically synced across devices or browsers. You can delete individual records or clear your history from My Results.",
      },
      {
        icon: Mic,
        title: "Voice assistance",
        text: "Voice input uses browser speech recognition where supported. Browser speech recognition may process audio through an external service. Spoken results use your browser's speech synthesis capability. Manual typing remains available.",
      },
      {
        icon: FileText,
        title: "Document checklist",
        text: "The prototype displays scheme document requirements and lets you print or save the checklist as a PDF. It does not currently collect or upload your identity documents.",
      },
      {
        icon: ExternalLink,
        title: "Official scheme information",
        text: "Eligibility results are preliminary. Always follow the official government website and scheme guidelines before applying. The prototype's available rules may be incomplete or require verification.",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "Does Jan Sahayak guarantee scheme approval?",
        a: "No. It provides preliminary screening, not an official government decision.",
      },
      {
        q: "Are my answers permanently stored?",
        a: "The current backend processes your answers but does not permanently save them. Result summaries are stored locally in your browser.",
      },
      {
        q: "Can I use the application without voice input?",
        a: "Yes. You can answer questions by typing or selecting options.",
      },
      {
        q: "How can I delete my saved results?",
        a: "Open My Results and use the delete controls to remove individual records or clear your history.",
      },
    ],
    home: "Back to Home",
  },

  hi: {
    title: "सहायता और गोपनीयता",
    intro: "जानें कि जन सहायक कैसे काम करता है और आपकी जानकारी का उपयोग कैसे होता है।",
    sections: [
      {
        icon: HelpCircle,
        title: "जन सहायक कैसे काम करता है",
        text: "जन सहायक नागरिकों को सरकारी योजनाएँ खोजने, पात्रता से जुड़े प्रश्नों के उत्तर देने और प्रारंभिक पात्रता परिणाम समझने में मदद करता है।",
      },
      {
        icon: ShieldCheck,
        title: "आपकी जानकारी और गोपनीयता",
        text: "पात्रता जाँच के लिए आपके उत्तर हमारे बैकएंड को भेजे जाते हैं। वर्तमान प्रोटोटाइप आपके उत्तरों को स्थायी रूप से सहेजता नहीं है। परिणामों का सारांश आपके ब्राउज़र के localStorage में रखा जाता है।",
      },
      {
        icon: FileText,
        title: "सहेजे गए परिणाम",
        text: "आपके ब्राउज़र में नवीनतम 20 जाँचों का इतिहास रखा जाता है। यह दूसरे डिवाइस या ब्राउज़र से अपने आप साझा नहीं होता। आप मेरे परिणाम पेज से रिकॉर्ड हटा सकते हैं।",
      },
      {
        icon: Mic,
        title: "आवाज़ की सुविधा",
        text: "आवाज़ से उत्तर देने के लिए समर्थित ब्राउज़र की स्पीच रिकग्निशन सुविधा इस्तेमाल होती है। ऑडियो किसी बाहरी सेवा द्वारा प्रोसेस किया जा सकता है। परिणाम सुनने के लिए ब्राउज़र की स्पीच सुविधा इस्तेमाल होती है। आप उत्तर टाइप भी कर सकते हैं।",
      },
      {
        icon: FileText,
        title: "दस्तावेज़ चेकलिस्ट",
        text: "यह प्रोटोटाइप आवश्यक दस्तावेज़ों की सूची दिखाता है और उसे प्रिंट या PDF के रूप में सेव करने देता है। अभी पहचान पत्र या अन्य दस्तावेज़ अपलोड नहीं किए जाते।",
      },
      {
        icon: ExternalLink,
        title: "आधिकारिक योजना की जानकारी",
        text: "पात्रता परिणाम प्रारंभिक हैं। आवेदन करने से पहले आधिकारिक सरकारी वेबसाइट और योजना के दिशा-निर्देश अवश्य देखें। प्रोटोटाइप में उपलब्ध नियम अधूरे हो सकते हैं या सत्यापन की आवश्यकता हो सकती है।",
      },
    ],
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqs: [
      {
        q: "क्या जन सहायक सरकारी मंज़ूरी की गारंटी देता है?",
        a: "नहीं। यह केवल प्रारंभिक पात्रता जाँच करता है। अंतिम निर्णय सरकार का होता है।",
      },
      {
        q: "क्या मेरे उत्तर हमेशा के लिए सहेजे जाते हैं?",
        a: "वर्तमान बैकएंड उत्तरों को प्रोसेस करता है, लेकिन उन्हें स्थायी रूप से सहेजता नहीं है। परिणामों का सारांश आपके ब्राउज़र में रखा जाता है।",
      },
      {
        q: "क्या मैं आवाज़ के बिना इसका उपयोग कर सकता हूँ?",
        a: "हाँ। आप उत्तर टाइप कर सकते हैं या दिए गए विकल्प चुन सकते हैं।",
      },
      {
        q: "मैं अपने सहेजे गए परिणाम कैसे हटाऊँ?",
        a: "मेरे परिणाम पेज पर जाएँ और किसी रिकॉर्ड को हटाने या पूरा इतिहास साफ़ करने के विकल्प का उपयोग करें।",
      },
    ],
    home: "मुख्य पृष्ठ पर जाएँ",
  },
};

export default function Help() {
  const context = useOutletContext();
  const language = context?.language || "en";
  const t = CONTENT[language] || CONTENT.en;

  return (
    <div className="mx-auto max-w-[1100px]">

      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={17} />
        {t.home}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {t.title}
        </h1>
        <p className="mt-2 text-slate-500">
          {t.intro}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {t.sections.map((section, index) => {
          const Icon = section.icon;

          return (
            <section
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon size={23} />
                </div>

                <h2 className="font-bold text-slate-900">
                  {section.title}
                </h2>
              </div>

              <p className="text-sm leading-7 text-slate-600">
                {section.text}
              </p>
            </section>
          );
        })}
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          {t.faqTitle}
        </h2>

        <div className="space-y-4">
          {t.faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-slate-100 pb-4 last:border-0"
            >
              <h3 className="font-semibold text-slate-800">
                {faq.q}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}