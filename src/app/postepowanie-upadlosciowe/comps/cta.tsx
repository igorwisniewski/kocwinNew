"use client";
import React from 'react';
import Link from 'next/link';

export default function BankruptcyCta({ content }: { content?: any }) {
    const title = content?.title || "Chcesz dowiedzieć się, czy kwalifikujesz się do upadłości?";
    const description = content?.description || "Przeanalizujemy Twoją sytuację bezpłatnie i bez żadnych zobowiązań. Skontaktuj się z naszym ekspertem.";
    const buttonText = content?.buttonText || "Zamów bezpłatną analizę";
    const buttonLink = content?.buttonLink || "/kontakt";

    return (
        <section className="bg-green-800 text-white py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {title}
                </h2>
                <p className="mt-4 text-lg text-green-100 whitespace-pre-line">
                    {description}
                </p>
                <div className="mt-8">
                    <Link
                        href={buttonLink}
                        className="inline-block rounded-md bg-white px-6 py-3 text-base font-semibold text-green-900 shadow hover:bg-green-50 transition"
                    >
                        {buttonText}
                    </Link>
                </div>
            </div>
        </section>
    );
}
