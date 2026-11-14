'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function NavDefault({ settings }: { settings?: any }) {
    const [isOpen, setIsOpen] = useState(false);

    const siteName = settings?.siteName || 'Twoje Oddłużanie';
    const ctaText = settings?.headerCtaText || 'Bezpłatna Konsultacja';
    const ctaLink = settings?.headerCtaLink || '/kontakt';
    const navLinks = settings?.navLinks || [
        { label: 'O nas', href: '/onas' },
        { label: 'Postępowanie Upadłościowe', href: '/postepowanie-upadlosciowe' },
        { label: 'Restrukturyzacja', href: '/restrukturyzacja' },
        { label: 'Kontakt', href: '/kontakt' },
    ];

    return (
        <>
            <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] bg-white/90 backdrop-blur-md shadow-lg rounded-full px-6 py-4 z-50">
                <div className="flex justify-between items-center text-gray-900">
                    <h1 className="text-xl font-bold whitespace-nowrap">
                        <Link href="/" onClick={() => setIsOpen(false)}>
                            {siteName}
                        </Link>
                    </h1>

                    {/* Menu na desktop */}
                    <ul className="hidden md:flex flex-1 justify-center space-x-8 text-sm font-medium">
                        {navLinks.map((item: any, i: number) => (
                            <li key={item.id || item.href || i}>
                                <Link href={item.href} className="transition hover:text-green-700">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Przycisk CTA na desktop */}
                    <Link
                        href={ctaLink}
                        className="hidden md:inline-block bg-green-700 text-white text-sm font-bold px-5 py-2 rounded-full shadow hover:bg-green-800 transition"
                    >
                        {ctaText}
                    </Link>

                    {/* Przycisk menu mobilnego (Hamburger) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden ml-4 focus:outline-none"
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        {isOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
                    </button>
                </div>
            </nav>

            {/* Wysuwane menu mobilne */}
            <div
                id="mobile-menu"
                className={`
          fixed top-[88px] left-1/2 -translate-x-1/2 w-[90%]
          bg-white/95 backdrop-blur-md rounded-xl shadow-lg z-40
          origin-top transition-transform duration-300 ease-in-out
          ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}
        `}
            >
                {isOpen && (
                    <ul className="flex flex-col items-center space-y-4 p-6 text-base font-medium text-gray-950">
                        {navLinks.map((item: any, i: number) => (
                            <li key={item.id || item.href || i}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-green-700"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link
                                href={ctaLink}
                                onClick={() => setIsOpen(false)}
                                className="inline-block bg-green-700 text-white text-sm font-bold px-5 py-2 rounded-full shadow hover:bg-green-800 transition"
                            >
                                {ctaText}
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </>
    );
}
