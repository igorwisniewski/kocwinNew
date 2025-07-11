"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function ContactHeader() {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from('.animate-contact-header', {
            duration: 1,
            opacity: 0,
            y: 40,
            ease: 'power3.out',
            stagger: 0.2,
        });
    }, { scope: container });

    return (
        <section ref={container} className="bg-white py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="animate-contact-header text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Skontaktuj się z nami
                </h1>
                <p className="animate-contact-header mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-600">
                    Masz pytania lub chcesz umówić się na bezpłatną i poufną konsultację? Wypełnij formularz lub skorzystaj z danych kontaktowych poniżej. Jesteśmy tu, aby Ci pomóc.
                </p>
            </div>
        </section>
    );
}