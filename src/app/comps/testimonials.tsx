"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const defaultTestimonials = [
    { id: '1', quote: 'Byłam przekonana, że nie ma już wyjścia. Dzięki tej kancelarii odzyskałam spokój, godność i nadzieję. Polecam każdemu, kto czuje się przytłoczony długami.', author: 'Katarzyna' },
    { id: '2', quote: 'Profesjonalna, szybka pomoc i zero oceniania. Wszystko zostało mi jasno wyjaśnione. Już po pierwszej rozmowie wiedziałem, że trafiłem w dobre ręce.', author: 'Michał' },
    { id: '3', quote: 'Wcześniej nie spałam po nocach. Dziś jestem po ogłoszeniu upadłości i naprawdę mogę zacząć nowe życie. Jestem ogromnie wdzięczna!', author: 'Paulina' },
    { id: '4', quote: 'Zadzwoniłem z ciekawości, zostałem z poczuciem ulgi. Krok po kroku przeprowadzili mnie przez całą procedurę. Warto było zaufać.', author: 'Tomasz' },
    { id: '5', quote: 'Bałem się tego procesu, ale z ich pomocą to naprawdę było do przejścia. Wszystko zrobione rzetelnie, uczciwie i z klasą.', author: 'Adam' },
    { id: '6', quote: 'Najtrudniejsze było poprosić o pomoc. Ale nikt mnie nie ocenił. Wręcz przeciwnie – zostałam potraktowana z pełnym szacunkiem i zrozumieniem.', author: 'Elżbieta' },
];

export default function Testimonials({ content }: { content?: any }) {
    const testimonials = content?.items && content.items.length > 0 ? content.items : defaultTestimonials;
    const title = content?.title || "Opinie Naszych Klientów";
    const subtitle = content?.subtitle || "Zaufali nam w najtrudniejszych momentach";

    const [currentIndex, setCurrentIndex] = useState(0);
    const container = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

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
    }, [currentIndex, testimonials.length]);

    useGSAP(() => {
        gsap.from(".animate-testimonials", {
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out"
        });
    }, { scope: container });

    return (
        <section ref={container} className="bg-white py-24 sm:py-32 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-testimonials">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        {subtitle}
                    </p>
                </div>

                <div
                    className="overflow-hidden animate-testimonials"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{
                            transform: `translateX(-${(currentIndex / step) * 100}%)`,
                        }}
                    >
                        {testimonials.map((t: any, idx: number) => (
                            <div key={t.id || idx} className="w-full lg:w-1/2 flex-shrink-0 px-4">
                                <div className="bg-green-50/60 rounded-2xl p-8 border border-green-100 flex flex-col justify-between h-full">
                                    <p className="text-gray-700 italic text-base leading-relaxed mb-6">
                                        &bdquo;{t.quote}&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-700 text-white font-bold flex items-center justify-center text-sm">
                                            {t.author?.charAt(0) || 'K'}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm">{t.author}</div>
                                            <div className="text-xs text-green-700 font-medium">Zweryfikowana opinia</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={handlePrev}
                        aria-label="Poprzednia opinia"
                        className="p-2.5 rounded-full bg-white shadow hover:bg-gray-50 border border-gray-200 transition"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                        onClick={handleNext}
                        aria-label="Następna opinia"
                        className="p-2.5 rounded-full bg-white shadow hover:bg-gray-50 border border-gray-200 transition"
                    >
                        <ArrowRightIcon className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </section>
    );
}
