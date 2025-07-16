"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Nowe, zaktualizowane opinie
const testimonials = [
    { quote: 'Byłam przekonana, że nie ma już wyjścia. Dzięki tej kancelarii odzyskałam spokój, godność i nadzieję. Polecam każdemu, kto czuje się przytłoczony długami.', author: 'Katarzyna' },
    { quote: 'Profesjonalna, szybka pomoc i zero oceniania. Wszystko zostało mi jasno wyjaśnione. Już po pierwszej rozmowie wiedziałem, że trafiłem w dobre ręce.', author: 'Michał' },
    { quote: 'Wcześniej nie spałam po nocach. Dziś jestem po ogłoszeniu upadłości i naprawdę mogę zacząć nowe życie. Jestem ogromnie wdzięczna!', author: 'Paulina' },
    { quote: 'Zadzwoniłem z ciekawości, zostałem z poczuciem ulgi. Krok po kroku przeprowadzili mnie przez całą procedurę. Warto było zaufać.', author: 'Tomasz' },
    { quote: 'Bałem się tego procesu, ale z ich pomocą to naprawdę było do przejścia. Wszystko zrobione rzetelnie, uczciwie i z klasą.', author: 'Adam' },
    { quote: 'Najtrudniejsze było poprosić o pomoc. Ale nikt mnie nie ocenił. Wręcz przeciwnie – zostałam potraktowana z pełnym szacunkiem i zrozumieniem.', author: 'Elżbieta' },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const container = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Logika slidera
    const step = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 2 : 1;
    const numPages = Math.ceil(testimonials.length / step);

    const handleNext = () => {
        const nextIndex = currentIndex + step;
        setCurrentIndex(nextIndex >= testimonials.length ? 0 : nextIndex);
    };

    const handlePrev = () => {
        let prevIndex = currentIndex - step;
        if (prevIndex < 0) {
            prevIndex = (numPages - 1) * step;
            if (prevIndex >= testimonials.length) {
                prevIndex = Math.max(0, testimonials.length - step);
            }
        }
        setCurrentIndex(prevIndex);
    };

    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
    const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 75) handleNext();
        if (touchStartX.current - touchEndX.current < -75) handlePrev();
    };

    useEffect(() => {
        const timer = setInterval(() => { handleNext(); }, 8000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    // Animacja GSAP pojawiania się sekcji
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: { trigger: container.current, start: 'top 80%', toggleActions: 'play none none none' }
        });
        tl.from('.animate-testimonial-header', { opacity: 0, y: 40, duration: 0.6 })
            .from('.animate-testimonial-slider', { opacity: 0, y: 50, duration: 0.8 }, '-=0.3');
    }, { scope: container });

    return (
        <section ref={container} className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="animate-testimonial-header mx-auto max-w-xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Co Mówią Nasi Klienci
                    </h2>
                </div>

                <div className="animate-testimonial-slider mt-16">
                    <div
                        className="relative overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / step)}%)` }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="flex-shrink-0 w-full lg:w-1/2 p-4">
                                    <figure className="rounded-2xl bg-primary/10 p-8 shadow-sm h-full flex flex-col">
                                        <blockquote className="text-gray-900 flex-grow">
                                            <p>{`„${testimonial.quote}”`}</p>
                                        </blockquote>
                                        <figcaption className="mt-6 text-right font-semibold text-gray-900">
                                            - {testimonial.author}
                                        </figcaption>
                                    </figure>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <button onClick={handlePrev} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition" aria-label="Previous">
                            <ArrowLeftIcon className="h-6 w-6 text-gray-700"/>
                        </button>
                        <button onClick={handleNext} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition" aria-label="Next">
                            <ArrowRightIcon className="h-6 w-6 text-gray-700"/>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}