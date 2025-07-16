"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";

export default function Hero() {
    const container = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            ".animate-hero",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2 }
        );
    }, { scope: container });

    return (
        <section
            ref={container}
            // Zmiana: Zamiast `bg-hero-pattern` używamy wartości arbitralnej
            // Reszta klas (flex, bg-cover, bg-center) pozostaje
            className="relative flex flex-col justify-center items-center w-full min-h-screen bg-[url('/img/tlo.jpg')] bg-cover bg-center"
        >
            {/* Nakładka dla lepszego kontrastu i czytelności tekstu */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Kontener z tekstem, 'relative' aby był nad nakładką */}
            <div className="relative container mx-auto px-6 text-center">
                <h1 className="animate-hero text-4xl font-bold tracking-tight text-white sm:text-6xl">

                    Wyobraź sobie poranek bez długów
                    <br />
                    To nie musi być tylko wyobrażenie.
                </h1>
                <p className="animate-hero mt-6 text-lg leading-8 text-gray-200 max-w-2xl mx-auto">
                    Pomagamy osobom zadłużonym naprawdę zacząć od nowa – legalnie, skutecznie, bez wstydu.

                    Zrób pierwszy krok.
                </p>
                <div className="animate-hero mt-10">
                    <a
                        href="#"
                        className="rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark transition-colors duration-300"
                    >
                        Bezpłatna Konsultacja
                    </a>
                </div>
            </div>
        </section>
    );
}