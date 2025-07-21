"use client";

import React, { useRef } from 'react';
import { TrophyIcon, BoltIcon, DocumentMagnifyingGlassIcon, BriefcaseIcon, LockClosedIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ZAKTUALIZOWANA TREŚĆ Z POGRUBIENIAMI
const features = [
    {
        name: 'Doświadczenie i specjalizacja',
        description: <>Jesteśmy kancelarią prawną, która specjalizuje się wyłącznie w upadłości konsumenckiej. Mamy na koncie <strong>ponad 200 skutecznie przeprowadzonych postępowań</strong> i <strong>7 lat doświadczenia</strong>.</>,
        icon: TrophyIcon,
    },
    {
        name: 'Skuteczność i szybkość',
        description: <>Dzięki znajomości procedur i realiów sądowych, jesteśmy w stanie skutecznie przyspieszyć Twoją sprawę, ogłaszając <strong>upadłość nawet w kilka dni</strong>.</>,
        icon: BoltIcon,
    },
    {
        name: 'Kompleksowa obsługa prawna',
        description: <>Zapewniamy pełne wsparcie: od analizy dokumentów, przez przygotowanie wniosku, aż po <strong>reprezentację przed sądem i syndykiem</strong>.</>,
        icon: DocumentMagnifyingGlassIcon,
    },
    {
        name: 'Profesjonalny zespół prawny',
        description: <>Twoją sprawą zajmują się wyłącznie <strong>radcowie prawni i doradcy restrukturyzacyjni</strong>, a nie pośrednicy czy anonimowi konsultanci.</>,
        icon: BriefcaseIcon,
    },
    {
        name: 'Pełna dyskrecja i obsługa online',
        description: <>Gwarantujemy <strong>100% poufności</strong>. Oferujemy możliwość przeprowadzenia całego procesu zdalnie, bez względu na Twoje miejsce zamieszkania.</>,
        icon: LockClosedIcon,
    },
    {
        name: 'Elastyczne i jasne warunki',
        description: <>Zapewniamy przejrzyste zasady współpracy z <strong>możliwością płatności w ratach</strong>. Jesteśmy dostępni, aby odpowiedzieć na wszystkie Twoje pytania.</>,
        icon: ArrowsRightLeftIcon,
    },
];

export default function WhyUs() {
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });

        tl.from(".animate-title", {
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: "power3.out",
        });

        tl.from(".animate-feature", {
            opacity: 0,
            y: 50,
            duration: 0.5,
            stagger: 0.15,
            ease: "power3.out",
        }, "-=0.3");

    }, { scope: container });

    return (
        <div ref={container} className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="animate-title text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Dlaczego Warto Nam Zaufać?
                    </h2>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <div role="list" className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} role="listitem" className="animate-feature flex flex-col">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary self-start">
                                    <feature.icon className="h-7 w-7 text-white" aria-hidden="true" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                                    {feature.name}
                                </h3>
                                <p className="mt-2 flex-auto text-base leading-7 text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}