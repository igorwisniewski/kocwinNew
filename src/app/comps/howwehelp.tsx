"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowWeHelp({ content }: { content?: any }) {
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });

        tl.from(".animate-title", {
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: 'power2.out'
        });

        tl.from(".animate-text", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out'
        }, "-=0.4");

    }, { scope: container });

    const title = content?.title || "Jak Pomagamy?";
    const description = content?.description || "Oddłużenie to proces – ale nie musisz go przechodzić sam. Prowadzimy Cię krok po kroku, od pierwszej rozmowy aż po ogłoszenie upadłości. Jesteśmy z Tobą na każdym etapie – jasno, empatycznie, profesjonalnie.";

    return (
        <section ref={container} className="bg-green-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="animate-title text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h2>
                    <p className="animate-text mt-6 text-lg leading-8 text-gray-600 whitespace-pre-line">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}
