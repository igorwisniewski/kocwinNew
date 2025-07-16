"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DiscretionSection() {
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        tl.from('.animate-image-discretion', { scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.out' })
            .from('.animate-text-discretion', { x: 30, opacity: 0, stagger: 0.2, duration: 0.7, ease: 'power2.out' }, '-=0.5');

    }, { scope: container });

    return (
        // Używamy białego tła dla oddzielenia od innych sekcji
        <section ref={container} className="bg-white py-24 sm:py-32 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">

                    {/* Kolumna z obrazkiem - znowu po lewej */}
                    <div className="animate-image-discretion">
                        <Image
                            src="/img/discretion.jpg" // Ścieżka do nowego obrazka w /public/images
                            alt="Dyskretne spotkanie w biurze"
                            width={500}
                            height={500}
                            className="w-full h-auto rounded-xl shadow-xl"
                        />
                    </div>

                    {/* Kolumna z tekstem */}
                    <div>
                        <div className="animate-text-discretion">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                U nas jesteś osobą, nie kolejną sprawą
                            </h2>
                        </div>

                        <div className="mt-6 space-y-6 text-lg text-gray-600 animate-text-discretion">
                            <p>
                                Zadłużenie to nie powód do wstydu. To sytuacja, z której można wyjść — a my pomagamy to zrobić z szacunkiem, empatią i pełnym profesjonalizmem.
                            </p>
                            <p>
                                Pracujemy zgodnie z najwyższymi standardami etyki zawodowej.
                                Twój komfort, zaufanie i poczucie bezpieczeństwa są dla nas równie ważne, jak skuteczność w prowadzeniu sprawy.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}