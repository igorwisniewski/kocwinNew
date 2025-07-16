"use client";
import React, { useRef } from 'react';
import Link from 'next/link'; // Import komponentu Link
import {  EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactFormSection() {
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        tl.from('.animate-contact-details', { opacity: 0, x: -40, stagger: 0.15, duration: 0.7 })
            .from('.animate-form', { opacity: 0, y: 50, duration: 1 }, '-=0.5');
    }, { scope: container });

    return (
        <section ref={container} className="relative bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-slate-50 grid grid-cols-1 lg:grid-cols-2">
                    {/* --- Contact Details --- */}
                    <div className="relative px-6 py-10 sm:px-10 lg:py-16">
                        <div className="mx-auto max-w-xl">
                            <h2 className="animate-contact-details text-3xl font-bold text-gray-900">Dane Kontaktowe</h2>
                            <p className="animate-contact-details mt-2 text-lg text-gray-600">
                                Czekamy na Twój telefon lub e-mail. Możesz również odwiedzić nas w naszym biurze.
                            </p>
                            <ul className="animate-contact-details mt-8 space-y-6 text-base text-gray-600">

                                <li className="flex gap-x-3">
                                    <PhoneIcon className="h-6 w-6 flex-none text-primary" aria-hidden="true" />
                                    <a href="tel:+48123456789" className="hover:text-gray-900">+48 123 456 789</a>
                                </li>
                                <li className="flex gap-x-3">
                                    <EnvelopeIcon className="h-6 w-6 flex-none text-primary" aria-hidden="true" />
                                    <a href="mailto:kontakt@oddluzeniepro.pl" className="hover:text-gray-900">kontakt@oddluzeniepro.pl</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* --- Contact Form --- */}
                    <form action="#" method="POST" className="animate-form px-6 py-10 sm:px-10 lg:py-16">
                        <div className="mx-auto max-w-xl">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">Imię i nazwisko</label>
                                    <div className="mt-2.5">
                                        <input type="text" name="name" id="name" autoComplete="name" className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Adres email</label>
                                    <div className="mt-2.5">
                                        <input type="email" name="email" id="email" autoComplete="email" className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Wiadomość</label>
                                    <div className="mt-2.5">
                                        <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm" defaultValue={''} />
                                    </div>
                                </div>

                                {/* --- NOWA SEKCJA Z CHECKBOXEM --- */}
                                <div className="sm:col-span-2">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <input
                                                id="privacy-policy"
                                                name="privacy-policy"
                                                type="checkbox"
                                                required
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm leading-6">
                                            <label htmlFor="privacy-policy" className="text-gray-600">
                                                Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
                                                <Link href="/polityka-prywatnosci" className="font-semibold text-primary hover:underline">
                                                    polityką prywatności
                                                </Link>
                                                .
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="mt-8 flex justify-end">
                                <button type="submit" className="rounded-md bg-primary px-5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark transition-colors">
                                    Wyślij wiadomość
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}