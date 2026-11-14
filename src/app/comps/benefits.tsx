"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DynamicIcon } from '@/lib/icons';

gsap.registerPlugin(ScrollTrigger);

const defaultBenefits = [
    {
        id: '1',
        name: 'Poczucie Spokoju i Bezpieczeństwa',
        description: 'Wytłumaczymy Ci cały proces w prosty sposób. Zadbamy o to, by wszystkie dokumenty i informacje były przygotowane prawidłowo i na czas. Ty skupiasz się na sobie — my na formalnościach.',
        icon: 'ShieldCheckIcon',
    },
    {
        id: '2',
        name: 'Indywidualna Strategia Oddłużeniowa',
        description: 'Każda sprawa jest inna. Analizujemy Twoją sytuację i dobieramy najlepsze możliwe rozwiązania w ramach przepisów prawa upadłościowego.',
        icon: 'DocumentTextIcon',
    },
    {
        id: '3',
        name: 'Szansa na Prawdziwy Nowy Start',
        description: 'Naszym celem jest skuteczne ogłoszenie upadłości i możliwie najkorzystniejszy plan spłaty — albo całkowite umorzenie długów. Dajemy Ci realną szansę, by zacząć życie bez finansowego ciężaru.',
        icon: 'SparklesIcon',
    },
];

export default function HomepageBenefits({ content }: { content?: any }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".animate-benefits-content", {
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.2,
        });
    }, { scope: container });

    const title = content?.title || "Co zyskujesz dzięki współpracy?";
    const subtitle = content?.subtitle || "Nasze wsparcie to coś więcej niż tylko pomoc prawna. To kompleksowa usługa, która przywraca kontrolę nad finansami i życiem.";
    const items = content?.items && content.items.length > 0 ? content.items : defaultBenefits;

    return (
        <section ref={container} className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="animate-benefits-content text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h2>
                    <p className="animate-benefits-content mt-4 text-lg text-gray-600">
                        {subtitle}
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none md:grid-cols-2 lg:grid-cols-3">
                        {items.map((benefit: any) => (
                            <div key={benefit.id || benefit.name} className="animate-benefits-content flex flex-col">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-700 self-start text-white">
                                    <DynamicIcon name={benefit.icon} className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                                    {benefit.name}
                                </h3>
                                <p className="mt-2 flex-auto text-base leading-7 text-gray-600">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
