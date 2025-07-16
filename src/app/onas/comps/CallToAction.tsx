"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction() {
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

    return (
        <section ref={container} className="bg-primary/10">
            <div className="container mx-auto px-4 py-16 text-center sm:py-20 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Gotowy na nowy, spokojny rozdział?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-gray-100">
                    Zrób pierwszy krok – umów się na bezpłatną konsultację i dowiedz się, jak możemy Ci pomóc wyjść z długów spokojnie i bez stresu.
                </p>
                <div className="mt-8">
                    <Link
                        href="/kontakt"
                        className="inline-block rounded-md bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark transition-colors"
                    >
                        Umów bezpłatną konsultację
                    </Link>
                </div>
            </div>
        </section>
    );
}