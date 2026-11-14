"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function BankruptcyHero({ content }: { content?: any }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from('.animate-b-hero', {
            duration: 1, opacity: 0, y: 40, ease: 'power3.out', stagger: 0.2,
        });
    }, { scope: container });

    const title = content?.title || "Czym jest upadłość konsumencka?";
    const description = content?.description || "To formalna procedura sądowa, która pozwala osobom fizycznym (czyli nieprowadzącym już działalności gospodarczej) na legalne i trwałe rozwiązanie problemu niewypłacalności. Jej celem jest umożliwienie Ci wyjścia z długów, których realnie nie jesteś w stanie spłacić — przy jednoczesnej ochronie podstawowych potrzeb życiowych.";
    const bgImage = content?.backgroundImage || "/img/fallhero.jpg";

    return (
        <section
            ref={container}
            className="bg-slate-50 py-24 sm:py-32 bg-cover bg-center"
            style={{ backgroundImage: `url('${bgImage}')` }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="animate-b-hero text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    {title}
                </h1>
                <p className="animate-b-hero mt-6 max-w-3xl mx-auto text-lg leading-8 text-gray-600 whitespace-pre-line">
                    {description}
                </p>
            </div>
        </section>
    );
}
