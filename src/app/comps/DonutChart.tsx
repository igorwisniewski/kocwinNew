"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DonutChartProps {
    percentage: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ percentage }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressCircleRef = useRef<SVGCircleElement>(null);
    const textRef = useRef<SVGTextElement>(null);

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    // Końcowa wartość przesunięcia dla paska postępu
    const finalOffset = circumference - (percentage / 100) * circumference;

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%", // Start animacji, gdy 85% elementu jest widoczne
                toggleActions: "play none none none",
            }
        });

        // 1. Animacja licznika numerycznego
        const counter = { value: 0 };
        tl.to(counter, {
            value: percentage,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
                if(textRef.current) {
                    // Aktualizujemy tekst w kółku w każdej klatce animacji
                    textRef.current.textContent = `${Math.round(counter.value)}%`;
                }
            }
        });

        // 2. Animacja wypełnienia zielonego paska (w tym samym czasie co licznik)
        tl.fromTo(progressCircleRef.current, {
            strokeDashoffset: circumference, // Zaczynamy od 0%
        }, {
            strokeDashoffset: finalOffset, // Kończymy na docelowej wartości
            duration: 1.5,
            ease: 'power2.out',
        }, "<"); // Znak "<" oznacza, że ta animacja startuje w tym samym momencie co poprzednia

        // 3. Animacja "pulsu" / powiększenia na koniec
        tl.to(containerRef.current, {
            scale: 1.1,
            duration: 0.3,
            yoyo: true, // Powrót do pierwotnego stanu
            repeat: 1, // Powtórz raz (tam i z powrotem)
            ease: 'power2.inOut',
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-primary/10"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    ref={progressCircleRef}
                    className="text-primary -rotate-90 origin-center"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference} // Start od 0% wypełnienia
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                {/* Zmieniamy span na <text> dla lepszej kontroli w SVG */}
                <text
                    ref={textRef}
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="text-2xl font-bold fill-current text-primary"
                >
                    0%
                </text>
            </svg>
        </div>
    );
};

export default DonutChart;