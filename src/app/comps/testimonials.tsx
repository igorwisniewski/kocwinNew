"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        body: 'Dzięki profesjonalnemu wsparciu mogłem wreszcie zacząć nowe życie bez długów. Proces przebiegł sprawnie i bez stresu.',
        author: 'Marek',
    },
    {
        body: 'Empatyczne podejście i fachowa pomoc w najtrudniejszym okresie mojego życia. Polecam każdemu w podobnej sytuacji.',
        author: 'Anna',
    },
];

export default function Testimonials() {
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        tl.from('.testimonial-title', { opacity: 0, y: 40, duration: 0.6 })
            .from('.testimonial-card', {
                opacity: 0,
                y: 40,
                duration: 0.5,
                stagger: 0.2
            }, '-=0.3');

    }, { scope: container });

    return (
        <section ref={container} className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="testimonial-title text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Co Mówią Nasi Klienci
                    </h2>
                </div>
                <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {testimonials.map((testimonial) => (
                            <figure key={testimonial.author} className="testimonial-card rounded-2xl bg-primary/10 p-8 shadow-sm">
                                <blockquote className="text-gray-900">
                                    <p>{`„${testimonial.body}”`}</p>
                                </blockquote>
                                <figcaption className="mt-6 flex items-center gap-x-4">
                                    <div className="text-sm font-semibold leading-6 text-gray-900">
                                        - {testimonial.author}
                                    </div>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}