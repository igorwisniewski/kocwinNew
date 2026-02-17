"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function RestruHero() {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from('.animate-b-hero', {
            duration: 1, opacity: 0, y: 40, ease: 'power3.out', stagger: 0.2,
        });
    }, { scope: container });

    return (
        <section ref={container} className="bg-slate-50 py-24 sm:py-32" style={{backgroundImage: "url(/img/fallhero.jpg)"}}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="animate-b-hero text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Czym jest postępowanie restrukturyzacyjne?

                </h1>
                <p className="animate-b-hero mt-6 max-w-3xl mx-auto text-lg leading-8 text-gray-600">
                    To formalna procedura prawna, która pozwala przedsiębiorcom na legalne uporządkowanie zobowiązań i ochronę firmy przed utratą płynności. Jej celem jest umożliwienie Ci dalszego działania i spłaty długów w realnych ratach — przy jednoczesnym zabezpieczeniu bieżącego funkcjonowania przedsiębiorstwa.
                </p>
            </div>
        </section>
    );
}