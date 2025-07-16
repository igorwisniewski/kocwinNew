"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import DonutChart from './DonutChart';

// Importy dla animacji GSAP
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


// --- NOWE, ZAKTUALIZOWANE DANE SPRAW ---
const caseStudiesData = [
    {
        id: 1,
        debtAmount: '96 tys.',
        remissionPercentage: 100,
        remissionAmount: '96 000 zł',
        repaymentPlan: 'brak planu spłaty',
        description: 'Po rozwodzie klientka została z długami zaciągniętymi wspólnie z byłym partnerem. Wychowując dwójkę dzieci bez stałej pracy, nie miała szans na regulowanie zobowiązań. Wniosek został pozytywnie rozpatrzony — sąd ogłosił upadłość i całkowicie umorzył jej długi.'
    },
    {
        id: 2,
        debtAmount: '142 tys.',
        remissionPercentage: 91,
        remissionAmount: '129 220 zł',
        repaymentPlan: '355 zł / 30 m-cy',
        description: 'Klient, emeryt z Warszawy, miał zajętą część świadczenia. Zadłużenie rosło latami. Po naszej analizie, sąd ogłosił upadłość i zatwierdził plan spłaty możliwy do wykonania przy jego dochodach. Klient odzyskał kontrolę nad budżetem i życiem.'
    },
    {
        id: 3,
        debtAmount: '67 tys.',
        remissionPercentage: 100,
        remissionAmount: '67 000 zł',
        repaymentPlan: 'brak planu spłaty',
        description: 'Zadłużenie narastało latami, kiedy klientka leczyła się psychiatrycznie. Wpadła w spiralę chwilówek. Udało się zebrać dokumentację potwierdzającą jej stan. Sąd ogłosił upadłość i umorzył całość długu.'
    },
    {
        id: 4,
        debtAmount: '290 tys.',
        remissionPercentage: 90,
        remissionAmount: '261 200 zł',
        repaymentPlan: '800 zł / 36 m-cy',
        description: 'Klient po pandemii musiał zamknąć działalność gospodarczą. Został z niespłaconymi leasingami. Sąd zatwierdził plan spłaty dostosowany do nowych dochodów klienta. Udało się umorzyć ponad 260 tys. zł.'
    },
    {
        id: 5,
        debtAmount: '158 tys.',
        remissionPercentage: 95,
        remissionAmount: '150 800 zł',
        repaymentPlan: '300 zł / 24 m-ce',
        description: 'Młody przedsiębiorca prowadził sklep internetowy, ale po wzroście kosztów musiał zamknąć firmę. Przez rok bezskutecznie próbował dogadać się z wierzycielami. Sąd przyznał symboliczną ratę i umorzył niemal całość zadłużenia.'
    },
    {
        id: 6,
        debtAmount: '460 tys.',
        remissionPercentage: 93,
        remissionAmount: '427 600 zł',
        repaymentPlan: '900 zł / 36 m-cy',
        description: 'Po upadku rodzinnej hurtowni klient pozostał z wysokimi kredytami. Współpraca z nami pozwoliła przejść przez procedurę bez utraty mieszkania i z mocnym oddechem finansowym.'
    },
];


export default function CaseStudies() {
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
            // Upewnij się, że indeks nie przekracza maksymalnej liczby elementów
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
    }, [currentIndex]);

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

                    <h2 className="animate-casestudy-header mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Wyróżnia nas wysoka skuteczność
                    </h2>
                </div>

                <div className="animate-slider-body">
                    <div
                        className="relative overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / step)}%)` }}
                        >
                            {caseStudiesData.map((caseData) => (
                                <div key={caseData.id} className="flex-shrink-0 w-full md:w-1/2 px-2 md:px-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-lg p-8 h-full">
                                        <div className="flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-gray-100 pb-6 lg:pb-0 lg:pr-8">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-500">ZADŁUŻENIE</p>
                                                <p className="text-4xl font-bold text-gray-900">{caseData.debtAmount} <span className="text-3xl">zł</span></p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-4">
                                                <DonutChart percentage={caseData.remissionPercentage} />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-500">UMORZENIE</p>
                                                    <p className="text-base text-gray-700">({caseData.remissionAmount})</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-500 mt-4">PLAN SPŁATY</p>
                                                <p className="text-lg font-semibold text-gray-900">{caseData.repaymentPlan}</p>
                                            </div>
                                        </div>
                                        <div className="pt-6 lg:pt-0 lg:pl-8">
                                            <p className="text-sm font-semibold text-gray-500">OPIS SPRAWY</p>
                                            <p className="mt-2 text-gray-600">{caseData.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <button onClick={handlePrev} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition" aria-label="Previous">
                            <ArrowLeftIcon className="h-6 w-6 text-gray-700"/>
                        </button>
                        <button onClick={handleNext} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition" aria-label="Next">
                            <ArrowRightIcon className="h-6 w-6 text-gray-700"/>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}