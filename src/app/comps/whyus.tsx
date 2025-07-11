"use client"; // Komponent musi być po stronie klienta, aby używać hooków i animacji

import React, { useRef } from "react";
import { ShieldCheckIcon, UsersIcon, ChartBarIcon, BoltIcon } from "@heroicons/react/24/outline";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Rejestrujemy wtyczkę ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        name: "Doświadczenie",
        description: "Wieloletnie doświadczenie w sprawach upadłości konsumenckiej.",
        icon: ChartBarIcon,
    },
    {
        name: "Dyskrecja",
        description: "Pełna poufność i profesjonalne podejście do Twojej sprawy.",
        icon: ShieldCheckIcon,
    },
    {
        name: "Kompleksowe Wsparcie",
        description: "Prowadzimy przez cały proces od początku do końca.",
        icon: UsersIcon,
    },
    {
        name: "Skuteczność",
        description: "Wysokie wskaźniki powodzenia w sprawach upadłości.",
        icon: BoltIcon,
    },
];

export default function WhyUs() {
    const container = useRef(null);

    useGSAP(() => {
        // Animujemy cały kontener, gdy pojawi się w 80% na ekranie
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%", // Start animacji, gdy 80% elementu jest widoczne
                toggleActions: "play none none none", // Uruchom animację tylko raz
            },
        });

        // Animacja dla nagłówka
        tl.from(".animate-title", {
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: "power3.out",
        });

        // Animacja dla kafelków z opóźnieniem (stagger)
        tl.from(".animate-feature", {
            opacity: 0,
            y: 50,
            duration: 0.5,
            stagger: 0.2, // Każdy kolejny kafelek animuje się 0.2s później
            ease: "power3.out",
        }, "-=0.3"); // Rozpocznij tę animację 0.3s przed końcem poprzedniej

    }, { scope: container }); // Ograniczamy działanie GSAP do tego komponentu

    return (
        <div ref={container} className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="animate-title text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Dlaczego My?
                    </h2>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            // Dodajemy klasę 'animate-feature' do każdego kafelka
                            <div key={feature.name} className="relative pl-16 animate-feature">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}