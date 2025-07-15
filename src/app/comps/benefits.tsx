"use client";

import React, { useRef } from 'react';
import { ShieldCheckIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
    {
        name: 'Spokój i Bezpieczeństwo',
        description: 'Bierzemy na siebie kontakt z wierzycielami i komornikami. Odzyskaj spokój, podczas gdy my zajmujemy się formalnościami.',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Indywidualny Plan Działania',
        description: 'Nie ma dwóch identycznych spraw. Analizujemy Twoją unikalną sytuację i tworzymy strategię oddłużania skrojoną na miarę.',
        icon: DocumentTextIcon,
    },
    {
        name: 'Skuteczne Oddłużenie',
        description: 'Naszym celem jest maksymalna redukcja lub całkowite umorzenie Twoich długów, dając Ci szansę na prawdziwy nowy start.',
        icon: SparklesIcon,
    },
];

export default function HomepageBenefits() {
    const container = useRef(null);

    useGSAP(() => {
        // Uproszczona animacja dla pojawiania się tekstu i listy
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

    return (
        <section ref={container} className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Usunęliśmy siatkę (grid) i centrujemy zawartość */}
                <div className="mx-auto max-w-4xl">
                    <div className="text-center">
                        <h2 className="animate-benefits-content text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Co zyskujesz dzięki współpracy?
                        </h2>
                        <p className="animate-benefits-content mt-4 text-lg text-gray-600">
                            Nasze wsparcie to coś więcej niż tylko pomoc prawna. To kompleksowa usługa, która przywraca kontrolę nad finansami i życiem.
                        </p>
                    </div>

                    {/* Lista korzyści pozostaje wyrównana do lewej dla lepszej czytelności */}
                    <dl className="animate-benefits-content mt-12 space-y-8">
                        {benefits.map((benefit) => (
                            <div key={benefit.name} className="relative pl-12">
                                <dt className="inline font-semibold text-gray-900">
                                    <benefit.icon className="absolute left-1 top-1 h-8 w-8 text-primary" aria-hidden="true" />
                                    <span>{benefit.name}</span>
                                </dt>
                                <dd className="inline ml-2 text-gray-600">{benefit.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}