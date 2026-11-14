"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const defaultBenefits = [
    {
        title: 'Natychmiastowe wstrzymanie egzekucji',
        description: 'Komornicy muszą zawiesić, a następnie umorzyć prowadzone przeciwko Tobie postępowania egzekucyjne.'
    },
    {
        title: 'Koniec z telefonami windykacji',
        description: 'Wierzyciele nie mogą nękać Cię telefonami, pismami czy wizytami domowymi. Wszystkie sprawy przejmuje syndyk.'
    },
    {
        title: 'Zatrzymanie narastania odsetek',
        description: 'Z dniem ogłoszenia upadłości długi przestają rosnąć. Nie są naliczane żadne karne opłaty ani odsetki.'
    },
    {
        title: 'Szansa na 100% umorzenie długów',
        description: 'Jeśli Twoja sytuacja materialna i zdrowotna na to wskazuje, sąd może umorzyć Twoje długi w całości bez planu spłaty.'
    }
];

export default function BenefitsSection({ content }: { content?: any }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".animate-benefit-card", {
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out"
        });
    }, { scope: container });

    const title = content?.title || "Korzyści z ogłoszenia upadłości";
    const subtitle = content?.subtitle || "Zobacz, co zyskujesz, podejmując decyzję o rozpoczęciu procedury";
    const items = content?.items && content.items.length > 0 ? content.items : defaultBenefits;

    return (
        <section ref={container} className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {items.map((benefit: any, idx: number) => (
                        <div
                            key={benefit.id || idx}
                            className="animate-benefit-card p-8 rounded-2xl bg-green-50/50 border border-green-100 flex gap-4"
                        >
                            <CheckCircleIcon className="h-7 w-7 text-green-700 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
