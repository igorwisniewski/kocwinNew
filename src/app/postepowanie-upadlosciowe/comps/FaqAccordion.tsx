"use client";
import React, { useState, useRef } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const defaultFaqs = [
    {
        q: 'Czy upadłość oznacza, że jestem niewiarygodny?',
        a: 'Absolutnie nie. To legalna forma wyjścia z długów – wybierają ją osoby, które chcą działać odpowiedzialnie i odbudować swoje życie.'
    },
    {
        q: 'Czy stracę pracę przez ogłoszenie upadłości?',
        a: 'Nie. Informacja o upadłości nie trafia do pracodawcy i nie wpływa na Twoje zatrudnienie. Możesz nadal pracować, rozwijać się i zarabiać.'
    },
    {
        q: 'Czy mogę prowadzić firmę po upadłości?',
        a: 'Tak. Jeśli sąd ustali plan spłaty, nie ma przeszkód, byś znów mógł legalnie prowadzić działalność gospodarczą.'
    },
    {
        q: 'Czy muszę spłacić wszystkie długi?',
        a: 'Nie. Po wykonaniu planu spłaty – lub jeśli sąd zadecyduje o jego pominięciu – pozostałe zobowiązania są prawnie umarzane.'
    },
    {
        q: 'Czy muszę iść do sądu?',
        a: 'Nie. Cała procedura może odbyć się bez Twojej obecności na sali sądowej - w wyjątkowych przypadkach sąd wzywa na dodatkowe wyjaśnienia.'
    },
    {
        q: 'Czy mogę ogłosić upadłość konsumencką mając komornika?',
        a: 'Tak. Upadłość konsumencka zatrzymuje postępowania egzekucyjne. Komornik nie może dalej prowadzić działań wobec Ciebie po ogłoszeniu upadłości.'
    },
    {
        q: 'Ile trwa proces upadłości konsumenckiej?',
        a: 'To zależy od sytuacji – od złożenia wniosku do ogłoszenia upadłości może minąć nawet tylko kilka dni. Cały proces, w zależności od złożości, trwa zwykle od kilku miesięcy do 2 lat.'
    },
    {
        q: 'Czy mogę ogłosić upadłość, jeśli mam pracę?',
        a: 'Tak. Dochody nie wykluczają możliwości ogłoszenia upadłości. Sąd analizuje Twoje wydatki, sytuację rodzinną i realne możliwości spłaty.'
    },
];

export default function FaqAccordion({ content }: { content?: any }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".animate-faq", {
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: "power3.out"
        });
    }, { scope: container });

    const title = content?.title || "Najczęściej zadawane pytania";
    const subtitle = content?.subtitle || "Wszystko, co warto wiedzieć o procedurze oddłużeniowej";
    const faqs = content?.items && content.items.length > 0 ? content.items : defaultFaqs;

    const toggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section ref={container} className="bg-slate-50 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-16 animate-faq">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        {subtitle}
                    </p>
                </div>

                <div className="space-y-4 animate-faq">
                    {faqs.map((faq: any, idx: number) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={faq.id || idx}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition shadow-sm"
                            >
                                <button
                                    onClick={() => toggle(idx)}
                                    className="w-full p-6 text-left flex justify-between items-center gap-4 focus:outline-none"
                                >
                                    <span className="font-semibold text-gray-900 text-base md:text-lg">
                                        {faq.q}
                                    </span>
                                    {isOpen ? (
                                        <MinusIcon className="w-5 h-5 text-green-700 shrink-0" />
                                    ) : (
                                        <PlusIcon className="w-5 h-5 text-gray-500 shrink-0" />
                                    )}
                                </button>
                                {isOpen && (
                                    <div className="px-6 pb-6 pt-0 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-100 mt-2 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
