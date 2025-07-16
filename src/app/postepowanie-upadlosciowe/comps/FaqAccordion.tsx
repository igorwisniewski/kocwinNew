"use client";
import React, { useState, useRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- NOWA, ROZBUDOWANA LISTA PYTAŃ I ODPOWIEDZI ---
const faqs = [
    {
        q: 'Czy upadłość oznacza, że jestem niewiarygodny?',
        a: 'Absolutnie nie. To legalna forma wyjścia z długów – wybierają ją osoby, które chcą działać odpowiedzialnie i odbudować swoje życie.'
    },
    {
        q: 'Czy stracę pracę przez ogłoszenie upadłości?',
        a: 'Nie. Informacja o upadłości nie trafia do pracodawcy i nie wpływa na Twoje zatrudnienie. Możesz nadal pracować, rozwijać się i zarabiać.'
    },
    {
        q: 'Czy mogę prowadzić firmę po upadłości?',
        a: 'Tak. Jeśli sąd ustali plan spłaty, nie ma przeszkód, byś znów mógł legalnie prowadzić działalność gospodarczą.'
    },
    {
        q: 'Czy muszę spłacić wszystkie długi?',
        a: 'Nie. Po wykonaniu planu spłaty – lub jeśli sąd zadecyduje o jego pominięciu – pozostałe zobowiązania są prawnie umarzane.'
    },
    {
        q: 'Czy muszę iść do sądu?',
        a: 'Nie. Cała procedura może odbyć się bez Twojej obecności na sali sądowej - w wyjątkowych przypadkach sąd wzywa na dodatkowe wyjaśnienia.'
    },
    {
        q: 'Czy mogę ogłosić upadłość konsumencką mając komornika?',
        a: 'Tak. Upadłość konsumencka zatrzymuje postępowania egzekucyjne. Komornik nie może dalej prowadzić działań wobec Ciebie po ogłoszeniu upadłości.'
    },
    {
        q: 'Ile trwa proces upadłości konsumenckiej?',
        a: 'To zależy od sytuacji – od złożenia wniosku do ogłoszenia upadłości może minąć nawet tylko kilka dni. Cały proces, w zależności od złożości, trwa zwykle od kilku miesięcy do 2 lat.'
    },
    {
        q: 'Czy mogę ogłosić upadłość, jeśli mam pracę?',
        a: 'Tak. Dochody nie wykluczają możliwości ogłoszenia upadłości. Sąd analizuje Twoje wydatki, sytuację rodzinną i realne możliwości spłaty.'
    },
    {
        q: 'Czy w upadłości konsumenckiej spłacam wszystkie długi?',
        a: 'Nie. Sąd ustala plan spłaty dostosowany do Twoich możliwości. Pozostała część zobowiązań zostaje umorzona po jego wykonaniu.'
    },
    {
        q: 'Czy muszę informować rodzinę lub pracodawcę?',
        a: 'Nie. Postępowanie jest prywatne i nie wymaga informowania rodziny ani miejsca pracy.'
    },
    {
        q: 'Czy mogę ogłosić upadłość, jeśli prowadzę działalność gospodarczą?',
        a: 'Jeśli prowadzisz działalność, możesz ogłosić tzw. upadłość przedsiębiorcy. Po jej zamknięciu możliwe jest przejście w tryb upadłości konsumenckiej – to zależy od historii Twojej sprawy.'
    },
    {
        q: 'Czy upadłość wpływa na mój BIK i zdolność kredytową?',
        a: 'Tak, ale czasowo. Po zakończeniu postępowania możesz odbudować historię kredytową i z czasem uzyskać zdolność kredytową.'
    },
    {
        q: 'Czy można ogłosić upadłość mając tylko chwilówki?',
        a: 'Oczywiście. Wiele osób ogłasza upadłość z powodu spirali chwilówek i zobowiązań pozabankowych. To bardzo częsty powód.'
    },
];

const FaqItem = ({ q, a }: { q: string, a: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="py-6 border-b border-primary/30">
            <dt>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-start justify-between text-left text-gray-700 hover:text-gray-900"
                    aria-expanded={isOpen}
                >
                    <span className="text-base font-semibold text-gray-900">{q}</span>
                    <span className="ml-6 flex h-7 items-center">
                        <PlusIcon className={`h-6 w-6 text-primary transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
                    </span>
                </button>
            </dt>
            <dd className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'
            }`}>
                <div className="pr-12 text-base text-gray-600">
                    <p>{a}</p>
                </div>
            </dd>
        </div>
    );
};

export default function FaqAccordion() {
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: { trigger: container.current, start: 'top 80%', toggleActions: 'play none none none' }
        });
        tl.from('.faq-title', { opacity: 0, y: 30, duration: 0.6 })
            .from('.faq-item', { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, '-=0.3');
    }, { scope: container });

    return (
        <section ref={container} className="bg-green-50 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h2 className="faq-title text-3xl font-bold text-center tracking-tight text-gray-900">Mity i Fakty o Upadłości</h2>
                <dl className="mt-10">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <FaqItem q={faq.q} a={faq.a} />
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}