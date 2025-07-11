"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

gsap.registerPlugin(ScrollTrigger);

export default function WhoIsItFor() {
    const container = useRef(null);
    useGSAP(() => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: container.current, start: 'top 80%' } });
        tl.from('.animate-who-img', { opacity: 0, scale: 0.9, duration: 0.8 })
            .from('.animate-who-text', { opacity: 0, x: 30, stagger: 0.2, duration: 0.6 }, '-=0.5');
    }, { scope: container });

    return(
        <section ref={container} className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="animate-who-img">
                        <Image src="/img/future.jpg" alt="Osoba patrząca w przyszłość" width={600} height={600} className="rounded-xl shadow-lg w-full h-auto" />
                    </div>
                    <div>
                        <h2 className="animate-who-text text-3xl font-bold tracking-tight text-gray-900">Dla kogo jest upadłość konsumencka?</h2>
                        <p className="animate-who-text mt-4 text-lg text-gray-600">To rozwiązanie przeznaczone jest dla osób fizycznych, które stały się niewypłacalne. Idealne, jeśli:</p>
                        <ul className="animate-who-text mt-6 space-y-4 text-gray-950">
                            <li className="flex items-start"><ShieldCheckIcon className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><span>Twoje zadłużenie przerosło Twoje możliwości spłaty.</span></li>
                            <li className="flex items-start"><ShieldCheckIcon className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><span>Straciłeś/aś płynność finansową z przyczyn losowych.</span></li>
                            <li className="flex items-start"><ShieldCheckIcon className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><span>Chcesz zatrzymać egzekucje komornicze i odzyskać spokój.</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}