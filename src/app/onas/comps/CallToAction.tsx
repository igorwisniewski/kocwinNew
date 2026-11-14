"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction({ content }: { content?: any }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(container.current, {
            scrollTrigger: { trigger: container.current, start: 'top 85%', toggleActions: 'play none none none' },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    }, { scope: container });

    const title = content?.title || "Gotowy na nowy, spokojny rozdział?";
    const description = content?.description || "Zrób pierwszy krok – umów się na bezpłatną konsultację i dowiedz się, jak możemy Ci pomóc wyjść z długów spokojnie i bez stresu.";
    const buttonText = content?.buttonText || "Umów bezpłatną konsultację";
    const buttonLink = content?.buttonLink || "/kontakt";

    return (
        <section ref={container} className="bg-green-800 text-white">
            <div className="container mx-auto px-4 py-16 text-center sm:py-20 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {title}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-green-100 whitespace-pre-line">
                    {description}
                </p>
                <div className="mt-8">
                    <Link
                        href={buttonLink}
                        className="inline-block rounded-md bg-white px-6 py-3 text-base font-semibold text-green-900 shadow-sm hover:bg-green-50 transition-colors"
                    >
                        {buttonText}
                    </Link>
                </div>
            </div>
        </section>
    );
}
