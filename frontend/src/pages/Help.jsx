
import { Link, useOutletContext } from "react-router-dom";
import {
  HelpCircle,
  ShieldCheck,
  Mic,
  FileText,
  ExternalLink,
  ArrowLeft,
  UserCheck,
  Trash2,
} from "lucide-react";

const CONTENT = {
  en: {
    title: "Help & Privacy",
    intro: "Understand how JanSahayak works and how your information is handled.",
    home: "Back to Home",
    sections: [
      {
        icon: HelpCircle,
        title: "How JanSahayak works",
        text: "JanSahayak helps citizens discover government schemes, answer relevant eligibility questions and understand preliminary eligibility results. It currently covers five central and Madhya Pradesh schemes.",
      },
      {
        icon: ShieldCheck,
        title: "Your information and privacy",
        text: "Your answers are sent to our backend for eligibility assessment. The current prototype does not permanently store your personal answers in the database. Assessment results are temporarily kept in your browser session.",
      },
      {
        icon: Trash2,
        title: "Clearing your information",
        text: "Use the Clear My Data option on the Results page to remove the assessment results managed by this application from the current browser session. Closing the browser session also clears session storage. This does not erase browser history or downloaded documents.",
      },
      {
        icon: Mic,
        title: "Voice assistance",
        text: "You can answer questions using your voice and listen to questions and results in Hindi or English. Voice recognition depends on browser support and an internet connection. Your browser's speech recognition service may process audio externally. Manual answers are always available.",
      },
      {
        icon: FileText,
        title: "Document checklist",
        text: "JanSahayak displays document requirements configured for each scheme. You can print or save the checklist as a PDF. The prototype does not collect or upload your identity documents.",
      },
      {
        icon: ExternalLink,
        title: "Official scheme information",
        text: "Each assessment is preliminary. Scheme rules can change, and some conditions may require official verification. Always check the official scheme website and its latest guidelines before applying.",
      },
      {
        icon: UserCheck,
        title: "When you need human assistance",
        text: "If your information is uncertain, conflicting or cannot be verified, do not rely on an automatic result. Contact the relevant government department, local scheme office, Common Service Centre (CSC), or Gram Panchayat for assistance.",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "Does JanSahayak guarantee scheme approval?",
        a: "No. It provides preliminary eligibility screening. The relevant government authority makes the final decision.",
      },
      {
        q: "Are my answers permanently stored?",
        a: "The current prototype processes your answers without permanently saving them in the database. Assessment results are temporarily stored in your browser session.",
      },
      {
        q: "Can I use JanSahayak without voice input?",
        a: "Yes. You can select options or type your answers manually.",
      },
      {
        q: "What if I do not know an answer?",
        a: "Do not guess. Use an available 'Not sure' option where provided. The result may require further verification.",
      },
      {
        q: "What should I do if my result says Needs Verification?",
        a: "Check the official source linked on the result and contact the relevant government department or CSC if you need help.",
      },
      {
        q: "Can I use JanSahayak on a shared phone?",
        a: "Yes. Use Clear My Data on the Results page before handing the phone to another person. Avoid saving or downloading documents containing personal information on a shared device.",
      },
    ],
  },

  hi: {
    title: "सहायता और गोपनीयता",
    intro: "जानें कि जनसहायक कैसे काम करता है और आपकी जानकारी का उपयोग कैसे होता है।",
    home: "मुख्य पृष्ठ पर जाएँ",
    sections: [
      {
        icon: HelpCircle,
        title: "जनसहायक कैसे काम करता है",
        text: "जनसहायक नागरिकों को सरकारी योजनाएँ खोजने, पात्रता से जुड़े प्रश्नों के उत्तर देने और प्रारंभिक परिणाम समझने में मदद करता है। इसमें अभी केंद्र सरकार और मध्य प्रदेश की पाँच योजनाएँ शामिल हैं।",
      },
      {
        icon: ShieldCheck,
        title: "आपकी जानकारी और गोपनीयता",
        text: "पात्रता जाँच के लिए आपके उत्तर हमारे बैकएंड को भेजे जाते हैं। वर्तमान प्रोटोटाइप आपके व्यक्तिगत उत्तरों को डेटाबेस में स्थायी रूप से सेव नहीं करता। जाँच के परिणाम आपके ब्राउज़र सत्र में अस्थायी रूप से रखे जाते हैं।",
      },
      {
        icon: Trash2,
        title: "अपनी जानकारी मिटाना",
        text: "परिणाम पेज पर मेरा डेटा मिटाएँ विकल्प का उपयोग करके इस ऐप द्वारा रखे गए जाँच परिणामों को वर्तमान ब्राउज़र सत्र से हटा सकते हैं। ब्राउज़र सत्र बंद करने पर session storage भी साफ़ हो जाता है। इससे ब्राउज़र हिस्ट्री या डाउनलोड किए गए दस्तावेज़ नहीं मिटते।",
      },
      {
        icon: Mic,
        title: "आवाज़ की सुविधा",
        text: "आप हिंदी या अंग्रेज़ी में बोलकर उत्तर दे सकते हैं और प्रश्नों तथा परिणामों को सुन सकते हैं। यह सुविधा ब्राउज़र के समर्थन और इंटरनेट पर निर्भर करती है। ब्राउज़र की आवाज़ पहचान सेवा ऑडियो को बाहरी रूप से प्रोसेस कर सकती है। आप उत्तर स्वयं टाइप भी कर सकते हैं।",
      },
      {
        icon: FileText,
        title: "दस्तावेज़ों की सूची",
        text: "जनसहायक प्रत्येक योजना के लिए उपलब्ध दस्तावेज़ों की सूची दिखाता है। आप इसे प्रिंट या PDF के रूप में सेव कर सकते हैं। यह प्रोटोटाइप आपके पहचान पत्र या अन्य दस्तावेज़ अपलोड नहीं करता।",
      },
      {
        icon: ExternalLink,
        title: "योजना की आधिकारिक जानकारी",
        text: "हर पात्रता परिणाम प्रारंभिक होता है। सरकारी योजनाओं के नियम बदल सकते हैं और कुछ शर्तों की आधिकारिक पुष्टि आवश्यक हो सकती है। आवेदन करने से पहले योजना की आधिकारिक वेबसाइट और नवीनतम दिशा-निर्देश अवश्य देखें।",
      },
      {
        icon: UserCheck,
        title: "मानवीय सहायता कब लें",
        text: "यदि आपकी जानकारी अनिश्चित, विरोधाभासी या सत्यापित नहीं हो पा रही है, तो केवल स्वचालित परिणाम पर निर्भर न रहें। संबंधित सरकारी विभाग, स्थानीय योजना कार्यालय, कॉमन सर्विस सेंटर (CSC) या ग्राम पंचायत से सहायता लें।",
      },
    ],
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqs: [
      {
        q: "क्या जनसहायक सरकारी मंज़ूरी की गारंटी देता है?",
        a: "नहीं। यह केवल प्रारंभिक पात्रता जाँच करता है। अंतिम निर्णय संबंधित सरकारी विभाग का होता है।",
      },
      {
        q: "क्या मेरे उत्तर स्थायी रूप से सेव होते हैं?",
        a: "वर्तमान प्रोटोटाइप आपके उत्तरों को प्रोसेस करता है, लेकिन उन्हें डेटाबेस में स्थायी रूप से सेव नहीं करता। जाँच के परिणाम आपके ब्राउज़र सत्र में अस्थायी रूप से रखे जाते हैं।",
      },
      {
        q: "क्या मैं आवाज़ के बिना जनसहायक का उपयोग कर सकता हूँ?",
        a: "हाँ। आप विकल्प चुन सकते हैं या अपने उत्तर स्वयं टाइप कर सकते हैं।",
      },
      {
        q: "अगर मुझे किसी प्रश्न का उत्तर नहीं पता तो क्या करूँ?",
        a: "अनुमान न लगाएँ। जहाँ 'पता नहीं' का विकल्प उपलब्ध हो, उसका उपयोग करें। ऐसे मामलों में आगे सत्यापन आवश्यक हो सकता है।",
      },
      {
        q: "अगर परिणाम में पुष्टि आवश्यक लिखा आए तो क्या करूँ?",
        a: "परिणाम में दिए गए आधिकारिक स्रोत को देखें और आवश्यकता होने पर संबंधित सरकारी विभाग या CSC से संपर्क करें।",
      },
      {
        q: "क्या मैं साझा मोबाइल पर जनसहायक का उपयोग कर सकता हूँ?",
        a: "हाँ। मोबाइल किसी दूसरे व्यक्ति को देने से पहले परिणाम पेज पर मेरा डेटा मिटाएँ विकल्प का उपयोग करें। साझा डिवाइस पर व्यक्तिगत जानकारी वाले दस्तावेज़ डाउनलोड या सेव करने से बचें।",
      },
    ],
  },
};

export default function Help() {
  const context = useOutletContext() || {};
  const language = context.language === "hi" ? "hi" : "en";
  const t = CONTENT[language];

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700"
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
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
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
