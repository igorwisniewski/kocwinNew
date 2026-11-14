"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import Link from "next/link";

export default function Hero({ content }: { content?: any }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            ".animate-hero",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2 }
        );
    }, { scope: container });

    const title = content?.title || "Wyobraź sobie poranek bez długów";
    const subtitle = content?.subtitle || "To nie musi być tylko wyobrażenie.";
    const description = content?.description || "Pomagamy osobom zadłużonym naprawdę zacząć od nowa – legalnie, skutecznie, bez wstydu.\nZrób pierwszy krok.";
    const buttonText = content?.buttonText || "Bezpłatna Konsultacja";
    const buttonLink = content?.buttonLink || "/kontakt";
    const bgImage = content?.backgroundImage || "/img/tlo.jpg";

    return (
        <section
            ref={container}
            className="relative flex flex-col justify-center items-center w-full min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url('${bgImage}')` }}
        >
            {/* Nakładka dla lepszego kontrastu i czytelności tekstu */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Kontener z tekstem, 'relative' aby był nad nakładką */}
            <div className="relative container mx-auto px-6 text-center">
                <h1 className="animate-hero text-4xl font-bold tracking-tight text-white sm:text-6xl">
                    {title}
                    {subtitle && (
                        <>
                            <br />
                            {subtitle}
                        </>
                    )}
                </h1>
                <p className="animate-hero mt-6 text-lg leading-8 text-gray-200 max-w-2xl mx-auto whitespace-pre-line">
                    {description}
                </p>
                <div className="animate-hero mt-10">
                    <Link
                        href={buttonLink}
                        className="rounded-md bg-green-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-300"
                    >
                        {buttonText}
                    </Link>
                </div>
            </div>
        </section>
    );
}
