"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowWeHelp() {
    const container = useRef(null);

    useGSAP(() => {
        // Używamy osi czasu (timeline) do sekwencji animacji
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });

        // 1. Animacja dla samego tytułu
        tl.from(".animate-title", {
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: 'power2.out'
        });

        // 2. Animacja dla tekstu, startuje chwilę później
        tl.from(".animate-text", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out'
        }, "-=0.4"); // Znak "-=" powoduje, że animacja zaczyna się 0.4s przed końcem poprzedniej

    }, { scope: container });

    return (
        <section ref={container} className="bg-green-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    {/* Dodajemy klasy do animacji */}
                    <h2 className="animate-title text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Jak Pomagamy?
                    </h2>
                    <p className="animate-text mt-6 text-lg leading-8 text-gray-600">
                        Upadłość konsumencka to legalne rozwiązanie problemu zadłużenia.
                        Z empatią i profesjonalizmem prowadzimy Cię przez cały proces,
                        zapewniając spokój i wsparcie na każdym etapie.
                    </p>
                </div>
            </div>
        </section>
    );
}