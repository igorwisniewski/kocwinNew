"use client";
import React, { useRef } from 'react';
import { EnvelopeIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactFormSection({ details, form }: { details?: any; form?: any }) {
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

    const phone = details?.phone || "+48 576 970 911";
    const email = details?.email || "kontakt@twojeoddluzanie.pl";
    const hours = details?.hours || "Poniedziałek - Piątek: 8:00 - 18:00";
    const detailsTitle = details?.title || "Dane Kontaktowe";
    const detailsDesc = details?.description || "Czekamy na Twój telefon lub e-mail. Oferujemy również konsultacje online oraz w naszym biurze.";

    const formTitle = form?.title || "Napisz do nas";
    const submitEndpoint = form?.submitEndpoint || "https://formspree.io/f/xjkovnlg";
    const buttonText = form?.buttonText || "Wyślij wiadomość";

    return (
        <section ref={container} className="relative bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-slate-50 grid grid-cols-1 lg:grid-cols-2">
                    {/* --- Contact Details --- */}
                    <div className="relative px-6 py-10 sm:px-10 lg:py-16">
                        <div className="mx-auto max-w-xl">
                            <h2 className="animate-contact-details text-3xl font-bold text-gray-900">{detailsTitle}</h2>
                            <p className="animate-contact-details mt-2 text-lg text-gray-600">
                                {detailsDesc}
                            </p>
                            <ul className="animate-contact-details mt-8 space-y-6 text-base text-gray-600">
                                <li className="flex gap-x-3 items-center">
                                    <PhoneIcon className="h-6 w-6 flex-none text-green-700" aria-hidden="true" />
                                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-gray-900 font-medium">
                                        {phone}
                                    </a>
                                </li>
                                <li className="flex gap-x-3 items-center">
                                    <EnvelopeIcon className="h-6 w-6 flex-none text-green-700" aria-hidden="true" />
                                    <a href={`mailto:${email}`} className="hover:text-gray-900 font-medium">
                                        {email}
                                    </a>
                                </li>
                                {hours && (
                                    <li className="flex gap-x-3 items-center">
                                        <ClockIcon className="h-6 w-6 flex-none text-green-700" aria-hidden="true" />
                                        <span>{hours}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* --- Contact Form --- */}
                    <form action={submitEndpoint} method="POST" className="animate-form px-6 py-10 sm:px-10 lg:py-16">
                        <div className="mx-auto max-w-xl">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">{formTitle}</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
                                        Imię i nazwisko
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            autoComplete="name"
                                            required
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                                        Adres e-mail
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold leading-6 text-gray-900">
                                        Numer telefonu
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            autoComplete="tel"
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                                        Wiadomość / Opis sytuacji
                                    </label>
                                    <div className="mt-2.5">
                                        <textarea
                                            name="message"
                                            id="message"
                                            rows={4}
                                            required
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="block w-full rounded-md bg-green-700 px-3.5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition"
                                >
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
