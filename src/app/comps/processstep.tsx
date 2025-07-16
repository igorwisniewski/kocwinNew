"use client";

import React, { useRef } from 'react';
import Image from 'next/image'; // Używamy zoptymalizowanego komponentu Next.js
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

// Importy dla GSAP
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Lista kroków w procesie
const processSteps = [
    {
        name: 'Kontakt z nami',
        description: 'Wypełniasz formularz lub dzwonisz. Umawiamy się na bezpłatną, niezobowiązującą konsultację.'
    },
    {
        name: 'Analiza sytuacji i plan działania',
        description: 'Poznajemy Twoją sytuację i proponujemy najlepsze możliwe rozwiązania. Zawsze zgodnie z prawem, zawsze po Twojej stronie.'
    },
    {
        name: 'Działamy w Twoim imieniu',
        description: 'Sporządzamy wniosek, przygotowujemy dokumenty i wspieramy Cię przez całą procedurę sądową.'
    },
    {
        name: 'Jesteśmy w kontakcie',
        description: 'Informujemy o postępach, dopasowujemy działania, odpowiadamy na pytania.'
    },
    {
        name: 'Jesteś oddłużony!',
        description: 'Twoje długi zostają zamknięte, a Ty możesz spokojnie zacząć nowy rozdział życia — bez lęku, bez wstydu, bez zobowiązań.'
    },
];

export default function ProcessSection() {
    const container = useRef(null);

    useGSAP(() => {
        // Sekwencyjna animacja dla elementów w sekcji
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        tl.from('.animate-text-content', { x: -40, opacity: 0, stagger: 0.2, duration: 0.7, ease: 'power2.out' })
            .from('.animate-image-process', { scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');

    }, { scope: container });

    return (
        <section ref={container} className="bg-green-100 py-24 sm:py-32 overflow-hidden min-h-screen content-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">

                    {/* Kolumna z tekstem */}
                    <div>
                        <div className="animate-text-content">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Jak wygląda współpraca krok po kroku?
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Pomagamy Ci przejść przez proces oddłużenia w sposób prosty i zrozumiały.
                                Działamy w pięciu konkretnych krokach — bez chaosu, bez niepewności, z pełnym wsparciem.

                            </p>
                        </div>
                        <ul className="mt-8 space-y-6">
                            {processSteps.map((step) => (
                                <li key={step.name} className="animate-text-content flex">
                                    <CheckBadgeIcon className="h-8 w-8 text-primary flex-shrink-0 mr-4 mt-1" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{step.name}</h3>
                                        <p className="mt-1 text-gray-600">{step.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolumna z obrazkiem - tym razem po prawej stronie */}
                    <div className="animate-image-process md:order-first">
                        <Image
                            src="/img/proces.jpg" // Pamiętaj o dodaniu obrazka do folderu /public/images
                            alt="Osoba analizująca dokumenty"
                            width={500}
                            height={500}
                            className="w-full h-auto rounded-xl shadow-xl"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}