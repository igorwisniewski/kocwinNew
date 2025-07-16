"use client";

import React, { useRef } from 'react';
import { TrophyIcon, BoltIcon, DocumentMagnifyingGlassIcon, BriefcaseIcon, LockClosedIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        name: 'Ponad 200 skutecznie ogłoszonych upadłości',
        description: 'Jako kancelaria oddłużeniowa specjalizujemy się w upadłości konsumenckiej. Mamy na koncie ponad 200 spraw i 7 lat doświadczenia.',
        icon: TrophyIcon,
    },
    {
        name: 'Szybka upadłość — nawet w 2 dni',
        description: 'Znamy procedury i realia polskich sądów. Wiemy, jak przyspieszyć Twoją sprawę i skutecznie ogłosić upadłość nawet w kilka dni.',
        icon: BoltIcon,
    },
    {
        name: 'Kompleksowa obsługa — więcej niż wniosek',
        description: 'Pomagamy w zebraniu dokumentów, analizujemy zadłużenie, przygotowujemy do kontaktów z sądem i syndykiem.',
        icon: DocumentMagnifyingGlassIcon,
    },
    {
        name: 'Profesjonalna kancelaria',
        description: 'Twoją sprawą zajmują się radcowie prawni i doradcy restrukturyzacyjni. Nie korzystamy z pośredników.',
        icon: BriefcaseIcon,
    },
    {
        name: 'Pełna dyskrecja i zdalna obsługa',
        description: 'Gwarantujemy pełną poufność. Możesz skorzystać z naszej pomocy z każdego miejsca w Polsce — 100% online.',
        icon: LockClosedIcon,
    },
    {
        name: 'Elastyczne warunki współpracy',
        description: 'Oferujemy możliwość płatności w ratach. Jesteśmy dostępni, otwarci i dopasowani do Twojej sytuacji.',
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
                    {/* --- POPRAWKA TUTAJ: Zmieniamy <dl> na <div> z rolą "list" dla dostępności --- */}
                    <div role="list" className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="animate-feature flex flex-col">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary self-start">
                                    <feature.icon className="h-7 w-7 text-white" aria-hidden="true" />
                                </div>
                                {/* --- POPRAWKA TUTAJ: Zmieniamy <dt> na <h3> --- */}
                                <h3 className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                                    {feature.name}
                                </h3>
                                {/* --- POPRAWKA TUTAJ: Zmieniamy <dd> na <p> --- */}
                                <p className="mt-2 flex-auto text-base leading-7 text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}