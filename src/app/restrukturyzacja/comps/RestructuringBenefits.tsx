"use client";
import React from 'react';
import {
    ShieldExclamationIcon,
    LockClosedIcon,
    CircleStackIcon,
    ChartBarIcon,
    BanknotesIcon,
    HomeModernIcon
} from '@heroicons/react/24/outline';

const benefits = [
    {
        name: 'Ochrona przed egzekucją komorniczą',
        description: 'Od dnia obwieszczenia zyskujesz czasową ochronę przed egzekucją. Komornik nie może prowadzić nowych postępowań, a trwające ulegają zawieszeniu.',
        icon: ShieldExclamationIcon
    },
    {
        name: 'Wstrzymanie wypowiadania kluczowych umów',
        description: 'Wierzyciele nie mogą wypowiedzieć najważniejszych umów, takich jak leasing, najem czy umowy kredytowe – co pozwala firmie dalej funkcjonować.',
    icon: LockClosedIcon
},
{
    name: 'Zatrzymanie spirali zadłużenia',
        description: 'Zyskujesz realny plan spłaty zobowiązań, dostosowany do możliwości finansowych Twojej firmy.',
    icon: CircleStackIcon
},
{
    name: 'Czas na uporządkowanie finansów',
        description: 'Postępowanie daje przestrzeń na stabilizację działalności, poprawę płynności i odbudowę rentowności.',
    icon: ChartBarIcon
},
{
    name: 'Jasne zasady spłaty zobowiązań',
        description: 'Po zatwierdzeniu układu spłacasz długi na nowych, ustalonych warunkach – bez presji natychmiastowej windykacji.',
    icon: BanknotesIcon
},
{
    name: 'Możliwość dalszego prowadzenia firmy',
        description: 'Najważniejsze: Twoja firma nadal działa. Zachowujesz kontrolę nad biznesem i możesz dalej budować jego przyszłość. ',
    icon: HomeModernIcon
},
];

export default function RestructuringBenefits() {
    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Co zyskujesz dzięki postępowaniu o zatwierdzenie układu?</h2>
                    <p className="mt-4 text-lg text-gray-600">Restrukturyzacja to nie upadłość – to szansa na &#34;drugie życie&#34; dla Twojej firmy na jasnych zasadach.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit) => (
                        <div key={benefit.name} className="flex flex-col items-start bg-slate-50 p-8 rounded-2xl hover:bg-slate-100 transition-colors">
                            <div className="rounded-lg bg-primary/10 p-3 mb-4">
                                <benefit.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.name}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}