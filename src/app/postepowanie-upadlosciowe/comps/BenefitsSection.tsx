"use client";
import React, { useRef } from 'react';
// Dobieramy nowe ikony pasujące do treści
import { CircleStackIcon, ShieldExclamationIcon, PhoneXMarkIcon, BanknotesIcon, ChartBarIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// NOWA, ZAKTUALIZOWANA TREŚĆ KORZYŚCI
const benefits = [
    {
        name: 'Koniec z narastającymi odsetkami',
        description: 'Z chwilą ogłoszenia upadłości dalsze naliczanie odsetek od Twoich zobowiązań zostaje wstrzymane.',
        icon: CircleStackIcon
    },
    {
        name: 'Zatrzymanie działań komorniczych',
        description: 'Wszystkie egzekucje i zajęcia komornicze zostają zawieszone. Odzyskujesz kontrolę nad swoim majątkiem.',
        icon: ShieldExclamationIcon
    },
    {
        name: 'Spokój bez nękających telefonów',
        description: 'Koniec z windykacją i nieustannym stresem. Wreszcie możesz spać spokojnie, bez obaw o kolejne wezwania.',
        icon: PhoneXMarkIcon
    },
    {
        name: 'Odblokowanie kont i dostęp do pieniędzy',
        description: 'Przestajesz być „zamrożony” finansowo – możesz znowu w pełni korzystać ze swojego konta i kart płatniczych.',
        icon: BanknotesIcon
    },
    {
        name: 'Odbudowa zdolności finansowej',
        description: 'Zaczynasz proces odbudowy swojej wiarygodności finansowej oraz uzyskanie czystego BIKu. Krok po kroku wracasz do normalności.',
        icon: ChartBarIcon
    },
    {
        name: 'Możliwość budowania przyszłości',
        description: 'Po umorzeniu długów możesz legalnie nabywać majątek, oszczędzać, a nawet prowadzić działalność gospodarczą.',
        icon: HomeModernIcon
    },
];

export default function BenefitsSection() {
    const container = useRef(null);
    useGSAP(() => {
        // Animacja pozostaje taka sama, jest uniwersalna
        gsap.from(".benefit-card", {
            scrollTrigger: { trigger: container.current, start: "top 80%" },
            opacity: 0, y: 50, stagger: 0.15, duration: 0.6,
        });
    }, { scope: container });

    return(
        <section ref={container} className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Co zyskujesz dzięki upadłości konsumenckiej?</h2>

                {/* ZMIENIONY UKŁAD SIATKI NA BARDZIEJ ELASTYCZNY */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map(b => (
                        <div key={b.name} className="benefit-card p-8 bg-slate-50 rounded-xl shadow-sm text-left">
                            <b.icon className="h-10 w-10 text-primary" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">{b.name}</h3>
                            <p className="mt-2 text-gray-600">{b.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}