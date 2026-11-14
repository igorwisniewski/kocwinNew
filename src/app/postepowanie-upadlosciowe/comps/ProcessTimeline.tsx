"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const defaultSteps = [
    {
        no: '1',
        name: 'Bezpłatna analiza sytuacji i przygotowanie wniosku',
        description: 'Szczegółowo weryfikujemy Twoje zadłużenie, majątek i dochody. Tworzymy kompletny wniosek o upadłość wraz z wymaganym uzasadnieniem prawnym.'
    },
    {
        no: '2',
        name: 'Złożenie wniosku do właściwego sądu',
        description: 'Składamy wniosek elektronicznie przez Krajowy Rejestr Zadłużonych. Dbamy o brak braków formalnych, co przyspiesza wydanie postanowienia.'
    },
    {
        no: '3',
        name: 'Ogłoszenie upadłości przez sąd – wstrzymanie windykacji',
        description: 'Sąd wydaje postanowienie o ogłoszeniu upadłości. Z tą chwilą zatrzymują się wszelkie postępowania komornicze i naliczanie odsetek.'
    },
    {
        no: '4',
        name: 'Współpraca z syndykiem i plan spłaty',
        description: 'Reprezentujemy Cię przed wyznaczonym syndykiem. Walczymy o jak najkorzystniejsze warunki planu spłaty lub całkowite umorzenie bez planu.'
    },
    {
        no: '5',
        name: 'Prawomocne umorzenie długów i nowy start',
        description: 'Po wykonaniu planu spłaty (lub od razu przy braku majątku) sąd wydaje orzeczenie o umorzeniu zobowiązań. Jesteś w 100% wolny od długów!'
    }
];

export default function ProcessTimeline({ content }: { content?: any }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".timeline-line", {
            scrollTrigger: {
                trigger: container.current,
                start: "top center",
                end: "bottom center",
                scrub: 1,
            },
            scaleY: 0,
            transformOrigin: "top center",
            ease: "none",
        });

        const items = gsap.utils.toArray('.timeline-item');
        // @ts-expect-error norma
        items.forEach((item: never) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                ease: 'power3.out'
            });
        });
    }, { scope: container });

    const title = content?.title || "Etapy upadłości konsumenckiej";
    const subtitle = content?.subtitle || "Jasny plan działania od pierwszego kontaktu po prawomocne oddłużenie";
    const steps = content?.steps && content.steps.length > 0 ? content.steps : defaultSteps;

    return (
        <section ref={container} className="bg-slate-50 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        {subtitle}
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="timeline-line absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-green-300 transform -translate-x-1/2" />

                    <div className="space-y-12">
                        {steps.map((step: any, idx: number) => {
                            const isEven = idx % 2 === 0;
                            return (
                                <div
                                    key={step.id || step.no || idx}
                                    className={`timeline-item relative flex flex-col md:flex-row items-start ${
                                        isEven ? 'md:flex-row-reverse' : ''
                                    }`}
                                >
                                    <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-green-700 text-white font-bold flex items-center justify-center transform -translate-x-1/2 text-sm shadow z-10">
                                        {step.no || idx + 1}
                                    </div>

                                    <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}>
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-bold text-gray-900">{step.name}</h3>
                                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
