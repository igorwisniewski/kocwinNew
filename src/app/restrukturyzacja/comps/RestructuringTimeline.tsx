"use client";
import React from 'react';

const steps = [
    {
        no: '1',
        name: 'Analiza sytuacji i przygotowanie dokumentów – nawet w 24h',
        description: 'Dokładnie analizujemy Twoją sytuację finansową, strukturę zobowiązań oraz możliwości dalszego prowadzenia działalności. Na tej podstawie przygotowujemy propozycje układowe i niezbędną dokumentację do otwarcia postępowania.'
    },
    {
        no: '2',
        name: 'Obwieszczenie o ustaleniu dnia układowego – ochrona przed egzekucją',
        description: 'Dokonujemy obwieszczenia w Krajowym Rejestrze Zadłużonych. Od tego momentu zyskujesz ochronę przed egzekucją komorniczą, a wierzyciele nie mogą wypowiadać kluczowych umów (np. leasingu czy najmu).'
    },
    {
        no: '3',
        name: 'Głosowanie wierzycieli nad układem – bez sali sądowej',
        description: 'Zbieramy głosy wierzycieli nad zaproponowanym układem. Dbamy o prawidłowy przebieg całej procedury oraz aktywnie komunikujemy się z wierzycielami, zwiększając szanse na przyjęcie układu.'
    },
    {
        no: '4',
        name: 'Złożenie wniosku do sądu o zatwierdzenie układu',
        description: 'Po uzyskaniu wymaganej większości głosów składamy wniosek o zatwierdzenie układu. Sąd weryfikuje poprawność procedury i zgodność układu z przepisami.'
    },
    {
        no: '5',
        name: 'Zatwierdzenie układu – stabilizacja i dalsze prowadzenie firmy',
        description: 'Po zatwierdzeniu układu przez sąd rozpoczynasz realizację nowych, ustalonych warunków spłaty. Twoja firma działa dalej, a zobowiązania są regulowane zgodnie z przyjętym harmonogramem.'
    }
];

export default function RestructuringTimeline() {
    return (
        <section className="bg-gray-50 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Etapy Postępowania Restrukturyzacyjnego</h2>
                    <p className="mt-4 text-lg text-gray-600">Przeprowadzimy Cię bezpiecznie przez każdy z poniższych kroków. </p>
                </div>
                <div className="relative">
                    {/* Linia pionowa dla desktopu */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>

                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div key={step.no} className={`flex flex-col md:flex-row items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Połowa pusta */}
                                <div className="hidden md:block w-1/2"></div>

                                {/* Kółko z numerem */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-xl border-4 border-white shadow-lg z-10">
                                    {step.no}
                                </div>

                                {/* Treść */}
                                <div className="w-full md:w-1/2 px-4 md:px-12">
                                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                        <h3 className="text-xl font-bold text-gray-900">{step.name}</h3>
                                        <p className="mt-3 text-gray-600">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}