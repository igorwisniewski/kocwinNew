'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function NavDefault() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] bg-white/90 backdrop-blur-md shadow-lg rounded-full px-6 py-4 z-50">
                <div className="flex justify-between items-center text-gray-900" >
                    <h1 className="text-xl font-bold  whitespace-nowrap">
                        {/* Logo, które zamyka menu mobilne po kliknięciu */}
                        <Link href="/" onClick={() => setIsOpen(false)}>
                            Twoje Oddłużanie
                        </Link>
                    </h1>

                    {/* Menu na desktop */}
                    <ul className="hidden md:flex flex-1 justify-center space-x-8 text-sm font-medium">
                        <li><Link href="/onas" className="transition hover:text-primary">O nas</Link></li>
                        <li><Link href="/postepowanie-upadlosciowe" className="transition hover:text-primary">Postępowanie Upadłościowe</Link></li>
                        <li><Link href="/kontakt" className="transition hover:text-primary">Kontakt</Link></li>
                    </ul>

                    {/* Przycisk CTA na desktop */}
                    <Link
                        href="/kontakt"
                        className="hidden md:inline-block bg-primary text-white text-sm font-bold px-5 py-2 rounded-full shadow hover:bg-primary-dark transition"
                    >
                        Bezpłatna Konsultacja
                    </Link>

                    {/* Przycisk menu mobilnego (Hamburger) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden ml-4 focus:outline-none"
                        aria-label="Toggle menu"
                        aria-expanded={isOpen} // Lepsza dostępność
                        aria-controls="mobile-menu" // Lepsza dostępność
                    >
                        {isOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
                    </button>
                </div>
            </nav>

            {/* Wysuwane menu mobilne */}
            <div
                id="mobile-menu" // Lepsza dostępność
                className={`
          fixed top-[88px] left-1/2 -translate-x-1/2 w-[90%]
          bg-white/95 backdrop-blur-md rounded-xl shadow-lg z-40
          origin-top transition-transform duration-300 ease-in-out
          ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}
        `}
            >
                {/* Zamknięcie menu jeśli isOpen jest false, aby uniknąć focusowania na linkach */}
                {isOpen && (
                    <ul className="flex flex-col items-center space-y-4 p-6 text-base font-medium text-gray-950">
                        <li><Link href="/onas" onClick={() => setIsOpen(false)} className="hover:text-primary">O nas</Link></li>
                        <li><Link href="/postepowanie-upadlosciowe" onClick={() => setIsOpen(false)} className="hover:text-primary">Postępowanie Upadłościowe</Link></li>
                        <li><Link href="/kontakt" onClick={() => setIsOpen(false)} className="hover:text-primary">Kontakt</Link></li>
                    </ul>
                )}
            </div>
        </>
    );
}