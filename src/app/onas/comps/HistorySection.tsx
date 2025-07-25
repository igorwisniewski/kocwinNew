"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HistorySection() {
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: { trigger: container.current, start: 'top 80%', toggleActions: 'play none none none' }
        });
        tl.from('.animate-history-text', { x: -40, opacity: 0, stagger: 0.2, duration: 0.7 })
            .from('.animate-history-image', { scale: 0.9, opacity: 0, duration: 0.8 }, '-=0.5');
    }, { scope: container });

    return (
        <section ref={container} className="bg-white py-24 sm:py-32 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 md:grid-cols-2">
                    <div>
                        <h2 className="animate-history-text text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nasza historia</h2>
                        <p className="animate-history-text mt-4 text-lg text-gray-600">
                            Twoje Oddłużanie powstało z potrzeby, którą sami dostrzegliśmy w codziennej pracy – potrzeby realnej, dostępnej i uczciwej pomocy dla osób zadłużonych.
                            Za naszą firmą stoją doświadczeni specjaliści, którzy na co dzień zajmują się obsługą firm oraz prowadzeniem złożonych procesów gospodarczych i sądowych.
                            Z czasem zobaczyliśmy, że wielu osobom prywatnym brakuje czegoś innego – wsparcia, które nie kosztuje fortuny, ale daje faktyczne rezultaty.

                        </p>
                        <p className="animate-history-text mt-4 text-lg text-gray-600">
                            Stworzyliśmy usługę dostępną, przystępną cenowo i prowadzoną w sposób jasny, etyczny i maksymalnie skuteczny.
                            Pomagamy nie tylko z dokumentami – dzielimy się wiedzą, spokojem i doświadczeniem, które potrafią zmienić życie.
                        </p>
                    </div>
                    <div className="animate-history-image">
                        <Image
                            src="/img/office.jpg" // Zdjęcie np. biura, symboliczne
                            alt="Symboliczny obraz historii firmy"
                            width={600}
                            height={400}
                            className="w-full h-auto rounded-xl shadow-xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}