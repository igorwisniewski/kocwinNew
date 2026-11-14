"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CheckBadgeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import DonutChart from './DonutChart';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const defaultCaseStudies = [
    {
        id: 1,
        debtAmount: '96 tys.',
        remissionPercentage: 100,
        remissionAmount: '96 000 zł',
        repaymentPlan: 'brak planu spłaty',
        description: 'Po rozwodzie klientka została z długami zaciągniętymi wspólnie z byłym partnerem. Wychowując dwójkę dzieci bez stałej pracy, nie miała szans na regulowanie zobowiązań. Wniosek został pozytywnie rozpatrzony — sąd ogłosił upadłość i całkowicie umorzył jej długi.',
        client: 'Pani Gosia, 41 lat, Wrocław'
    },
    {
        id: 2,
        debtAmount: '142 tys.',
        remissionPercentage: 91,
        remissionAmount: '129 220 zł',
        repaymentPlan: '355 zł / 30 m-cy',
        description: 'Klient, emeryt z Warszawy, miał zajętą część świadczenia. Zadłużenie rosło latami. Po naszej analizie, sąd ogłosił upadłość i zatwierdził plan spłaty możliwy do wykonania przy jego dochodach. Klient odzyskał kontrolę nad budżetem i życiem.',
        client: 'Pan Marian, 68 lat, Warszawa'
    },
    {
        id: 3,
        debtAmount: '67 tys.',
        remissionPercentage: 100,
        remissionAmount: '67 000 zł',
        repaymentPlan: 'brak planu spłaty',
        description: 'Zadłużenie narastało latami, kiedy klientka leczyła się psychiatrycznie. Wpadła w spiralę chwilówek. Udało się zebrać dokumentację potwierdzającą jej stan. Sąd ogłosił upadłość i umorzył całość długu.',
        client: 'Pani Ewa, 52 lata, Gdańsk'
    },
    {
        id: 4,
        debtAmount: '290 tys.',
        remissionPercentage: 90,
        remissionAmount: '261 200 zł',
        repaymentPlan: '800 zł / 36 m-cy',
        description: 'Klient po pandemii musiał zamknąć działalność gospodarczą. Został z niespłaconymi leasingami. Sąd zatwierdził plan spłaty dostosowany do nowych dochodów klienta. Udało się umorzyć ponad 260 tys. zł.',
        client: 'Pan Marcin, 39 lat, Kraków'
    },
    {
        id: 5,
        debtAmount: '158 tys.',
        remissionPercentage: 95,
        remissionAmount: '150 800 zł',
        repaymentPlan: '300 zł / 24 m-ce',
        description: 'Młody przedsiębiorca prowadził sklep internetowy, ale po wzroście kosztów musiał zamknąć firmę. Przez rok bezskutecznie próbował dogadać się z wierzycielami. Sąd przyznał symboliczną ratę i umorzył niemal całość zadłużenia.',
        client: 'Pan Adam, 29 lat, Poznań'
    },
    {
        id: 6,
        debtAmount: '460 tys.',
        remissionPercentage: 93,
        remissionAmount: '427 600 zł',
        repaymentPlan: '900 zł / 36 m-cy',
        description: 'Po upadku rodzinnej hurtowni klient pozostał z wysokimi kredytami. Współpraca z nami pozwoliła przejść przez procedurę bez utraty mieszkania i z mocnym oddechem finansowym.',
        client: 'Pan Jacek, 55 lat, Katowice'
    },
];

export default function CaseStudies({ content }: { content?: any }) {
    const caseStudiesData = content?.items && content.items.length > 0 ? content.items : defaultCaseStudies;
    const title = content?.title || "Wyróżnia nas wysoka skuteczność";
    const subtitle = content?.subtitle || "Zakończone sprawy";

    const [currentIndex, setCurrentIndex] = useState(0);
    const container = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const step = typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1;
    const numPages = Math.ceil(caseStudiesData.length / step);

    const handleNext = () => {
        const nextIndex = currentIndex + step;
        setCurrentIndex(nextIndex >= caseStudiesData.length ? 0 : nextIndex);
    };

    const handlePrev = () => {
        let prevIndex = currentIndex - step;
        if (prevIndex < 0) {
            prevIndex = (numPages - 1) * step;
            if (prevIndex >= caseStudiesData.length) {
                prevIndex = Math.max(0, caseStudiesData.length - step);
            }
        }
        setCurrentIndex(prevIndex);
    };

    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
    const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 75) handleNext();
        if (touchStartX.current - touchEndX.current < -75) handlePrev();
    };

    useEffect(() => {
        const timer = setInterval(() => { handleNext(); }, 7000);
        return () => clearInterval(timer);
    }, [currentIndex, caseStudiesData.length]);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: { trigger: container.current, start: "top 80%", toggleActions: "play none none none" }
        });
        tl.from(".animate-casestudy-header", { opacity: 0, y: 40, duration: 0.6, stagger: 0.2 })
            .from(".animate-slider-body", { opacity: 0, y: 50, duration: 0.8, ease: 'power3.out' }, "-=0.4");
    }, { scope: container });

    return (
        <section ref={container} className="bg-slate-50 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="animate-casestudy-header flex items-center justify-center gap-2 text-sm font-semibold text-green-700">
                        <CheckBadgeIcon className="h-6 w-6"/>
                        <span>{subtitle}</span>
                    </div>
                    <h2 className="animate-casestudy-header mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h2>
                </div>

                <div className="animate-slider-body">
                    <div
                        className="overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{
                                transform: `translateX(-${(currentIndex / step) * 100}%)`,
                            }}
                        >
                            {caseStudiesData.map((study: any) => (
                                <div key={study.id || study.client} className="w-full md:w-1/2 flex-shrink-0 px-4">
                                    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 flex flex-col justify-between h-full">
                                        <div>
                                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                                <UserCircleIcon className="h-8 w-8 text-green-700 flex-shrink-0" />
                                                <span className="font-semibold text-gray-800 text-lg">{study.client}</span>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                                                <div className="flex-shrink-0">
                                                    <DonutChart percentage={Number(study.remissionPercentage) || 0} />
                                                </div>
                                                <div className="space-y-2 text-center sm:text-left">
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Wysokość zadłużenia</span>
                                                        <span className="text-xl font-bold text-gray-900">{study.debtAmount}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Kwota umorzona</span>
                                                        <span className="text-xl font-bold text-green-700">{study.remissionAmount}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Plan spłaty</span>
                                                        <span className="text-sm font-medium text-gray-700">{study.repaymentPlan}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                                                {study.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={handlePrev}
                            aria-label="Poprzednia sprawa"
                            className="p-2.5 rounded-full bg-white shadow hover:bg-gray-50 border border-gray-200 transition"
                        >
                            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        <button
                            onClick={handleNext}
                            aria-label="Następna sprawa"
                            className="p-2.5 rounded-full bg-white shadow hover:bg-gray-50 border border-gray-200 transition"
                        >
                            <ArrowRightIcon className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
