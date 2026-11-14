"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function AboutHero({ content }: { content?: any }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from('.animate-about-hero', {
            duration: 1,
            opacity: 0,
            y: 50,
            ease: 'power3.out',
            stagger: 0.2,
        });
    }, { scope: container });

    const title = content?.title || "Kim jesteśmy i jak pomagamy?";
    const description = content?.description || "Jesteśmy zespołem prawników i doradców, którzy pomagają osobom zadłużonym. Upadłość konsumencką traktujemy jako początek do odzyskania finansowej wolności. Naszą misją jest skuteczne oddłużanie z empatią i dyskrecją, by przywrócić naszym klientom poczucie bezpieczeństwa.";
    const bgImage = content?.backgroundImage || "/img/fallhero.jpg";

    return (
        <section
            ref={container}
            className="relative bg-slate-50 py-24 sm:py-32 bg-cover bg-center"
            style={{ backgroundImage: `url('${bgImage}')` }}
        >
            <div className="absolute inset-0 bg-white/85" />
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="animate-about-hero text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    {title}
                </h1>
                <p className="animate-about-hero mt-6 max-w-3xl mx-auto text-lg leading-8 text-gray-600 whitespace-pre-line">
                    {description}
                </p>
            </div>
        </section>
    );
}
