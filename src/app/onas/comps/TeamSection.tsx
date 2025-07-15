"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const people = [
    {
        name: 'Natalia Kujawa',
        role: 'CEO',
        imageUrl: '/img/av1.jpeg', // Pamiętaj o dodaniu zdjęć
    },
    {
        name: 'Andrzej Kopeć',
        role: 'Radca prawny',
        imageUrl: '/img/av2.jpeg',
    },
];

export default function TeamSection() {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".animate-team-member", {
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
            y: 50,
            opacity: 0,
            stagger: 0.3,
            duration: 0.8,
            ease: 'power3.out'
        });
    }, { scope: container });

    return (
        <section ref={container} className="bg-slate-50 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Poznaj nasz zespół</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Za sukcesem naszych klientów stoją doświadczeni specjaliści.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:gap-16">
                    {people.map((person) => (
                        <div key={person.name} className="animate-team-member text-center">
                            <Image
                                className="mx-auto h-48 w-48 rounded-full object-cover shadow-lg"
                                src={person.imageUrl}
                                alt={`Zdjęcie ${person.name}`}
                                width={192}
                                height={192}
                            />
                            <h3 className="mt-6 text-xl font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                            <p className="text-base leading-6 text-primary">{person.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}