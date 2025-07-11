"use client";
import React, { useRef } from 'react';
import { HandRaisedIcon, SparklesIcon, StopCircleIcon } from '@heroicons/react/24/outline';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
    { name: 'Zatrzymanie egzekucji', description: 'Wszystkie działania komornicze zostają wstrzymane z dniem ogłoszenia upadłości.', icon: StopCircleIcon },
    { name: 'Odzyskanie spokoju', description: 'Koniec z nękającymi telefonami od windykatorów i stresem związanym z długami.', icon: HandRaisedIcon },
    { name: 'Nowy start finansowy', description: 'Po zakończeniu procesu możesz zacząć budować swoją przyszłość finansową od nowa.', icon: SparklesIcon },
];

export default function BenefitsSection() {
    const container = useRef(null);
    useGSAP(() => {
        gsap.from(".benefit-card", {
            scrollTrigger: { trigger: container.current, start: "top 80%" },
            opacity: 0, y: 50, stagger: 0.2, duration: 0.6,
        });
    }, { scope: container });

    return(
        <section ref={container} className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Kluczowe korzyści dla Ciebie</h2>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map(b => (
                        <div key={b.name} className="benefit-card p-8 bg-slate-50 rounded-xl shadow-sm">
                            <b.icon className="h-10 w-10 text-primary mx-auto" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">{b.name}</h3>
                            <p className="mt-2 text-gray-600">{b.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}