"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import DonutChart from './DonutChart';

// Importy dla animacji GSAP
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Rejestracja wtyczki
gsap.registerPlugin(ScrollTrigger);

const caseStudiesData = [
    { id: 1, debtAmount: '550 tys.', remissionPercentage: 94, remissionAmount: '517 000 zł', repaymentPlan: '600 zł / 18 m-cy', description: 'Klientka popadła w problemy finansowe z powodu skomplikowanej sytuacji osobistej i poręczeń. Postępowanie doprowadziło do ustalenia planu spłaty umożliwiającego utrzymanie rodziny.' },
    { id: 2, debtAmount: '350 tys.', remissionPercentage: 93.71, remissionAmount: '328 000 zł', repaymentPlan: '600 zł / 36 m-cy', description: 'Niewypłacalność klientki wynikła z problemów zdrowotnych i utraty pracy. Po latach zdecydowała się na upadłość, co pozwoliło na ustalenie planu spłaty i umorzenie reszty długu.' },
    { id: 3, debtAmount: '120 tys.', remissionPercentage: 91, remissionAmount: '109 200 zł', repaymentPlan: '300 zł / 24 m-cy', description: 'Problem powstał na skutek nieudanej działalności gospodarczej. Skuteczne przeprowadzenie postępowania pozwoliło na oddłużenie i powrót do stabilności finansowej.' },
    { id: 4, debtAmount: '85 tys.', remissionPercentage: 100, remissionAmount: '85 000 zł', repaymentPlan: 'Brak / Umorzenie całości', description: 'Trwała niezdolność do pracy uniemożliwiła jakąkolwiek spłatę. Sąd przychylił się do wniosku o umorzenie 100% zobowiązań bez ustalania planu spłaty.' },
    { id: 5, debtAmount: '210 tys.', remissionPercentage: 95, remissionAmount: '199 500 zł', repaymentPlan: '450 zł / 36 m-cy', description: 'Zadłużenie powstałe w wyniku pętli chwilówek. Pomogliśmy w skonsolidowaniu informacji o długach i przygotowaniu wniosku, co zakończyło się sukcesem.' },
    { id: 6, debtAmount: '400 tys.', remissionPercentage: 92, remissionAmount: '386 400 zł', repaymentPlan: '700 zł / 30 m-cy', description: 'Długi odziedziczone w spadku. Nasza kancelaria pomogła w przeprowadzeniu postępowania, które uchroniło klienta przed konsekwencjami zadłużenia, którego nie zaciągnął.' },
];

export default function CaseStudies() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Ref dla kontenera animacji GSAP
    const container = useRef(null);

    const step = typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1;
    const numPages = Math.ceil(caseStudiesData.length / step);

    const handleNext = () => {
        const nextIndex = (currentIndex + step);
        setCurrentIndex(nextIndex >= caseStudiesData.length ? 0 : nextIndex);
    };

    const handlePrev = () => {
        let prevIndex = currentIndex - step;
        if (prevIndex < 0) {
            prevIndex = (numPages - 1) * step;
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

    // Animacja GSAP dla pojawienia się sekcji
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
                toggleActions: "play none none none",
            }
        });

        tl.from(".animate-casestudy-header", {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.2,
        })
            .from(".animate-slider-body", {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out'
            }, "-=0.4");

    }, { scope: container });

    return (
        <section ref={container} className="bg-slate-50 py-24 sm:py-32 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">

                    <h2 className="animate-casestudy-header mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Wyróżnia nas wysoka skuteczność
                    </h2>
                </div>

                {/* Kontener dla slidera i nawigacji, który będzie animowany jako całość */}
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
                        <button onClick={handlePrev} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition">
                            <ArrowLeftIcon className="h-6 w-6 text-gray-700"/>
                        </button>
                        <button onClick={handleNext} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition">
                            <ArrowRightIcon className="h-6 w-6 text-gray-700"/>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}