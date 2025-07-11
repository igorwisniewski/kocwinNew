"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    { no: '1', name: 'Złożenie wniosku', description: 'Pomagamy przygotować i złożyć kompletny wniosek o ogłoszenie upadłości do właściwego sądu.' },
    { no: '2', name: 'Postanowienie sądu', description: 'Sąd analizuje wniosek i wydaje postanowienie o ogłoszeniu upadłości, wyznaczając syndyka.' },
    { no: '3', name: 'Działania syndyka', description: 'Syndyk ustala masę upadłościową i przygotowuje listę wierzycieli.' },
    { no: '4', name: 'Plan spłaty', description: 'Sąd ustala plan spłaty wierzycieli, dostosowany do Twoich możliwości zarobkowych.' },
    { no: '5', name: 'Umorzenie zobowiązań', description: 'Po wykonaniu planu spłaty, pozostałe długi zostają prawomocnie umorzone.' },
];

export default function ProcessTimeline() {
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
        items.forEach((item: any) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                ease: 'power2.out',
            });
        });
    }, { scope: container });

    return(
        <section ref={container} className="bg-slate-50 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Etapy Postępowania Upadłościowego</h2>
                    <p className="mt-4 text-lg text-gray-600">Przeprowadzimy Cię bezpiecznie przez każdy z poniższych kroków.</p>
                </div>

                <div className="relative mt-20 flow-root">
                    {/* Linia osi czasu - teraz widoczna na wszystkich ekranach, zmienia pozycję na desktopie */}
                    <div className="timeline-line absolute left-6 top-2 h-full w-0.5 bg-primary/20 lg:left-1/2 lg:-translate-x-1/2" aria-hidden="true"></div>

                    <div className="relative flex flex-col gap-12">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <div key={step.no} className="timeline-item">
                                    {/* --- UKŁAD MOBILNY (JEDNOSTRONNY) --- */}
                                    <div className="lg:hidden relative flex items-start">
                                        {/* Kółko z numerem jest pozycjonowane absolutnie względem linii */}
                                        <div className="absolute left-6 top-1 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                                            {step.no}
                                        </div>
                                        {/* Karta z treścią ma lewy margines, aby zrobić miejsce na linię i kółko */}
                                        <div className="ml-16 w-full flex-grow p-5 bg-white rounded-xl shadow-md">
                                            <h3 className="font-semibold text-gray-900">{step.name}</h3>
                                            <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                                        </div>
                                    </div>

                                    {/* --- UKŁAD DESKTOPOWY (NAPRZEMIENNY) --- */}
                                    <div className={`hidden lg:grid grid-cols-2 gap-x-8 relative`}>
                                        {isEven ? (
                                            <div></div>
                                        ) : (
                                            <div className="p-6 bg-white rounded-xl shadow-lg text-right">
                                                <h3 className="font-semibold text-gray-900">{step.name}</h3>
                                                <p className="mt-1 text-gray-600">{step.description}</p>
                                            </div>
                                        )}
                                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-xl shadow-md">{step.no}</div>
                                        </div>
                                        {isEven ? (
                                            <div className="p-6 bg-white rounded-xl shadow-lg text-left">
                                                <h3 className="font-semibold text-gray-900">{step.name}</h3>
                                                <p className="mt-1 text-gray-600">{step.description}</p>
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}
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