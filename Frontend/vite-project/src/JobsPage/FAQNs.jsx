
// <div className="container">
// <h1 className="text-xl text-gray-800"> AjiraUnity ni nini?</h1> 
// <p>
// AjiraUnity ni jukwaa la 
// kidijitali linalounganisha waajiri na wafanyakazi. Kupitia jukwaa hili, 
// unaweza kupata au kutangaza kazi za aina zote—kuanzia
//  vibarua na kazi za nyumbani hadi kazi rasmi za kitaalamu maofisini.
// </p>




// <h1>
// Je, ni nani anaweza kutumia AjiraUnity?
// </h1> 

// <p>
// AjiraUnity inalenga wafanyakazi na waajiri wote:

// Wafanyakazi: Wote walio na umri wa miaka 18 au zaidi.

// Waajiri: Watu binafsi au kampuni zinazotaka kutangaza nafasi za kazi.
// </p>




// <h1>
//      Je, naweza kutangaza kazi bila kuwa na kampuni?
// </h1>
// <p>
// Ndiyo, kabisa! Unaweza kutangaza kazi kama mtu binafsi au kama kampuni.
//  Iwe unatafuta fundi, mfanyakazi wa ndani, au msaidizi wa ofisi—ilimradi una
//   fursa ya kazi unayotaka kuitangaza, AjiraUnity ndiyo sehemu yako! 
// </p>



//  <h1>
// Je, ni lazima niwe na elimu kubwa au CV kuomba kazi?
//  </h1> 
//  <p>
//       Hapana.  Unaweza kuomba kazi kulingana na ujuzi (skills) au elimu uliyo nayo. Kuna fursa za kazi za mtaani, vibarua, 
//   na kazi za kitaalamu. Kila mtafuta kazi ana nafasi ya kupata fursa kulingana na uwezo wake.
//  </p>
 


// <h1>
// Ninawezaje kujisajili kama mtafuta kazi?
// </h1> 

// <ul>

//     Bofya Tengeneza Akaunti / Create Account.

// Chagua Start Seeking Job.

// Jaza maelezo yako kwa usahihi.

// Thibitisha barua pepe (email) yako.

// Baada ya hapo, ingia (Log in) na uanze kutengeneza wasifu (profile) wako wa kazi.


// </ul>



// <h1>
// Ninawezaje kujisajili kama Mwajiri?
// </h1>
// <ul>

//     Bofya Tengeneza Akaunti / Create Account.

// Chagua Start Posting Jobs.

// Jaza taarifa zako kwa usahihi.

// Thibitisha barua pepe yako.

// Baada ya hapo, unaweza kuanza kutangaza nafasi za kazi mara moja.
    
// </ul>





// <h1>Je, naweza kupata ajira karibu na eneo langu?</h1> 
// <p> 
//  Ndiyo. AjiraUnity inakuwezesha kutafuta kazi kulingana na eneo ulilopo. 
// Unaweza kutafuta kwa jina la mtaa, kata, wilaya, au mkoa wowote nchini Tanzania.
// </p>



// <h1>Je, ni salama kutumia AjiraUnity? </h1> 
// <p>Ndiyo, usalama wako ni kipaumbele chetu. Tunajitahidi kudhibiti: </p>
// Matangazo ya kitapeli (scams).

// Mifumo hatari au ujumbe usiohitajika (spam).

// Tunashauri watumiaji wote kufanya uhakiki kabla ya kuanza makubaliano ya kazi.

// </div>



import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Hakikisha umesakinisha lucide-react au tumia SVG ya kawaida

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "AjiraUnity ni nini?",
            answer: "AjiraUnity ni jukwaa la kidijitali linalounganisha waajiri na watafuta kazi. Kupitia jukwaa hili, unaweza kupata au kutangaza kazi za aina zote—kuanzia vibarua na kazi za nyumbani hadi kazi rasmi za kitaalamu maofisini."
        },
        {
            question: "Je, ni nani anaweza kutumia AjiraUnity?",
            answer: "AjiraUnity inalenga watafuta kazi na waajiri wote:",
            list: [
                { bold: "Watafuta kazi:", text: "Wote walio na umri wa miaka 18 au zaidi." },
                { bold: "Waajiri:", text: "Watu binafsi au kampuni zinazotaka kutangaza nafasi za kazi." }
            ]
        },
        {
            question: "Je, naweza kutangaza kazi bila kuwa na kampuni?",
            answer: "Ndiyo, kabisa! Unaweza kutangaza kazi kama mtu binafsi au kama kampuni. Iwe unatafuta fundi, mfanyakazi wa nyumbani, au msaidizi wa ofisi—mradi una fursa ya kazi unayotaka kuitangaza, AjiraUnity ndiyo sehemu yako!"
        },
        {
            question: "Je, ni lazima niwe na elimu kubwa au CV kuomba kazi?",
            answer: "Hapana. Unaweza kuomba kazi kulingana na ujuzi (skills) au elimu uliyo nayo. Kuna fursa za kazi za mtaani, vibarua, na kazi za kitaalamu. Kila mtafuta kazi ana nafasi ya kupata fursa kulingana na uwezo wake."
        },
        {
            question: "Ninawezaje kujisajili kama mtafuta kazi?",
            steps: [
                "Bofya **Tengeneza Akaunti / Create Account**.",
                "Chagua **Start Seeking Job**.",
                "Jaza maelezo yako kwa usahihi.",
                "Thibitisha barua pepe (email) yako.",
                "Baada ya hapo, ingia (Log in) na uanze kutengeneza wasifu (profile) wako wa kazi."
            ]
        },
        {
            question: "Ninawezaje kujisajili kama Mwajiri?",
            steps: [
                "Bofya **Tengeneza Akaunti / Create Account**.",
                "Chagua **Start Posting Jobs**.",
                "Jaza taarifa zako kwa usahihi.",
                "Thibitisha barua pepe yako.",
                "Baada ya hapo, unaweza kuanza kutangaza nafasi za kazi mara moja."
            ]
        },
        {
            question: "Je, naweza kupata ajira karibu na eneo langu?",
            answer: "Ndiyo. AjiraUnity inakuwezesha kutafuta kazi kulingana na eneo ulilopo. Unaweza kutafuta kwa jina la mtaa, kata, wilaya, au mkoa wowote nchini Tanzania."
        },
        {
            question: "Je, ni salama kutumia AjiraUnity?",
            answer: "Ndiyo, usalama wako ni kipaumbele chetu. Tunajitahidi kudhibiti:",
            list: [
                { text: "Matangazo ya kitapeli (scams)" },
                { text: "Mifumo hatari au ujumbe usiohitajika (spam)" }
            ],
            footer: "Tunashauri watumiaji wote kufanya uhakiki wa ziada kabla ya kuanza makubaliano ya kazi."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Maswali Yanayoulizwa Mara Kwa Mara
                    </h1>
                    <p className="text-gray-600 italic">
                        (Frequently Asked Questions - FAQs)
                    </p>
                </header>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
                            >
                                <span className="text-lg font-semibold text-gray-800 leading-tight">
                                    {faq.question}
                                </span>
                                <ChevronDown 
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                                        openIndex === index ? 'rotate-180' : ''
                                    }`} 
                                />
                            </button>

                            {/* Content Section */}
                            <div 
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="p-5 pt-0 border-t border-gray-100 text-gray-700 leading-relaxed">
                                    {faq.answer && <p>{faq.answer}</p>}
                                    
                                    {faq.list && (
                                        <ul className="list-disc list-inside mt-3 space-y-2">
                                            {faq.list.map((item, i) => (
                                                <li key={i}>
                                                    {item.bold && <strong>{item.bold} </strong>}
                                                    {item.text}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {faq.steps && (
                                        <ol className="list-decimal list-inside mt-3 space-y-3">
                                            {faq.steps.map((step, i) => (
                                                <li key={i} className="pl-2">
                                                    {/* Inashughulikia bold text ndani ya steps */}
                                                    {step.split('**').map((part, index) => 
                                                        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                                                    )}
                                                </li>
                                            ))}
                                        </ol>
                                    )}

                                    {faq.footer && (
                                        <p className="mt-4 text-sm bg-blue-50 p-3 rounded-md text-blue-800">
                                            {faq.footer}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}