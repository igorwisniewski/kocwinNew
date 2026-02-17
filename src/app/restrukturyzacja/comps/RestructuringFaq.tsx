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
        q: 'Czy restrukturyzacja oznacza, że moja firma jest bankrutem?',
        a: 'Nie. Restrukturyzacja to narzędzie naprawcze, które ma właśnie zapobiec upadłości. To świadoma, odpowiedzialna decyzja o uporządkowaniu zobowiązań i skutecznej ochronie biznesu. [cite: 224, 225]'
    },
    {
        q: 'Czy stracę kontrolę nad swoją firmą?',
        a: 'Nie. W postępowaniu o zatwierdzenie układu nadal zarządzasz swoją firmą. Nadzorca układu czuwa jedynie nad prawidłowością procedury, ale to Ty decydujesz o kierunkach rozwoju działalności. [cite: 226, 227, 228]'
    },
    {
        q: 'Czy mogę dalej wystawiać faktury i prowadzić sprzedaż?',
        a: 'Tak. Firma działa normalnie — możesz zawierać nowe umowy, realizować bieżące zlecenia i generować przychody bez przeszkód. [cite: 229, 230, 231]'
    },
    {
        q: 'Czy muszę iść do sądu?',
        a: 'Nie. W tym trybie nie ma klasycznej rozprawy sądowej. Cały proces przebiega w uproszczonej formule, a rola sądu ogranicza się do końcowego zatwierdzenia wypracowanego układu. [cite: 232, 234]'
    },
    {
        q: 'Czy restrukturyzacja zatrzymuje komornika?',
        a: 'Tak. Od momentu dokonania obwieszczenia w Krajowym Rejestrze Zadłużonych zyskujesz pełną ochronę przed egzekucją komorniczą w zakresie objętym układem. [cite: 235, 236]'
    },
    {
        q: 'Ile trwa postępowanie o zatwierdzenie układu?',
        a: 'To jedna z najszybszych form restrukturyzacji. Cała procedura zbierania głosów może zamknąć się w kilku miesiącach, zależnie od liczby wierzycieli i skali zadłużenia. [cite: 237, 238, 239]'
    },
    {
        q: 'Czy mogę skorzystać z restrukturyzacji, jeśli mam zaległości w ZUS i US?',
        a: 'Tak. Zobowiązania publicznoprawne również mogą zostać objęte układem, co pozwala na rozłożenie zaległych składek i podatków na dogodne raty. [cite: 240, 241]'
    },
    {
        q: 'Czy restrukturyzacja wpływa na zdolność kredytową?',
        a: 'Może mieć wpływ krótkoterminowy w trakcie trwania procesu, ale jej ostatecznym celem jest stabilizacja firmy i odzyskanie pełnej wiarygodności finansowej w dłuższej perspektywie. [cite: 242, 243]'
    },
    {
        q: 'Czy mogę otrzymać nowe finansowanie w trakcie restrukturyzacji?',
        a: 'W określonych przypadkach tak — szczególnie jeśli nowe finansowanie wspiera wykonanie układu, poprawę płynności i pomaga w powrocie do pełnej rentowności. [cite: 244, 245]'
    },
    {
        q: 'Czy każdy przedsiębiorca może skorzystać z PZU?',
        a: 'Z postępowania mogą skorzystać przedsiębiorcy niewypłacalni lub zagrożeni niewypłacalnością, pod warunkiem że istnieją realne szanse na porozumienie z wierzycielami. [cite: 247, 248]'
    },
    {
        q: 'Ile trwa ochrona w postępowaniu o zatwierdzenie układu?',
        a: 'Ochrona przed egzekucją trwa ustawowo 4 miesiące od dnia obwieszczenia. W praktyce jednak, wliczając czas oczekiwania na prawomocne zatwierdzenie, realna ochrona może trwać od 8 do nawet 12 miesięcy. [cite: 249, 250, 251]'
    },
    {
        q: 'Czy w trakcie restrukturyzacji muszę spłacać raty?',
        a: 'W okresie ochronnym nie spłacasz zobowiązań objętych układem na dotychczasowych zasadach. Pozwala to firmie „odetchnąć” finansowo nawet przez rok, przekierowując środki na bieżącą działalność. [cite: 253, 254, 255]'
    }
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
                <h2 className="faq-title text-3xl font-bold text-center tracking-tight text-gray-900">Mity i Fakty o Restrukturyzacji</h2>
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