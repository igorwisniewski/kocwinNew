"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function AboutHero() {
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

    return (
        <section ref={container} className="relative bg-slate-50 py-24 sm:py-32 " style={{backgroundImage: "url(/img/abouthero.jpg)",opacity:20}}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="animate-about-hero text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Kim jesteśmy i jak pomagamy?
                </h1>
                <p className="animate-about-hero mt-6 max-w-3xl mx-auto text-lg leading-8 text-gray-600">
                    Jesteśmy zespołem prawników i doradców, którzy pomagają osobom zadłużonym. Upadłość konsumencką traktujemy jako początek do odzyskania finansowej wolności. Naszą misją jest skuteczne oddłużanie z empatią i dyskrecją, by przywrócić naszym klientom poczucie bezpieczeństwa..
                </p>
            </div>
        </section>
    );
}