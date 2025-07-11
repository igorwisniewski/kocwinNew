"use client";

import React, { useState, useRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

// Importy dla animacji GSAP
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
    { q: 'Czy stracę cały swój majątek?', a: 'Nie. Ustawa chroni część majątku niezbędną do codziennego życia. Syndyk nie może zająć przedmiotów osobistych, narzędzi pracy czy części wynagrodzenia.' },
    { q: 'Czy już nigdy nie dostanę kredytu?', a: 'Historia upadłości jest widoczna w BIK, co może utrudnić uzyskanie kredytu w pierwszych latach. Jednak po "wyczyszczeniu" historii, Twoja zdolność kredytowa się odbudowuje.' },
    { q: 'Czy moja rodzina odpowie za moje długi?', a: 'Nie. Upadłość konsumencka dotyczy wyłącznie osoby, która ją ogłasza. Twoja rodzina nie ponosi odpowiedzialności za Twoje zobowiązania.' },
];

// --- Komponent pojedynczego pytania z animacją rozwijania ---
const FaqItem = ({ q, a }: { q: string, a: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="py-6 border-b border-primary/50">
            <dt>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-start justify-between text-left text-gray-700 hover:text-gray-900"
                    aria-expanded={isOpen}
                >
                    <span className="text-base font-semibold text-gray-900">{q}</span>
                    <span className="ml-6 flex h-7 items-center">
                        {/* Dodajemy animację obrotu ikony */}
                        <PlusIcon className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
                    </span>
                </button>
            </dt>

            {/* Nowa, animowana sekcja odpowiedzi.
              Używamy techniki z grid-rows do płynnej animacji wysokości.
            */}
            <dd className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'
            }`}>
                <div className="pr-12 text-base text-gray-600">
                    <p>{a}</p>
                </div>
            </dd>
        </div>
    );
};


// --- Główny komponent sekcji FAQ z animacją pojawiania się ---
export default function FaqAccordion() {
    const container = useRef(null);

    // Animacja pojawiania się sekcji i pytań przy scrollowaniu
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        tl.from('.faq-title', { opacity: 0, y: 30, duration: 0.6 })
            .from('.faq-item', { opacity: 0, y: 20, stagger: 0.15, duration: 0.5 }, '-=0.3');

    }, { scope: container });

    return (
        <section ref={container} className="bg-green-50 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h2 className="faq-title text-3xl font-bold text-center tracking-tight text-gray-900">Mity i Fakty o Upadłości</h2>
                <dl className="mt-10">
                    {faqs.map((faq, index) => (
                        // Dodajemy klasę do animacji stagger
                        <div key={index} className="faq-item">
                            <FaqItem q={faq.q} a={faq.a} />
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}