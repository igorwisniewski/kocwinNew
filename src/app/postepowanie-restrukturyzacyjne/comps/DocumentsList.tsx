"use client";
import React from 'react';

const docs = ['Dowód osobisty', 'Spis wierzycieli z kwotami zadłużenia', 'Lista składników majątku', 'Umowy kredytowe i pożyczkowe', 'Dokumenty potwierdzające dochody', 'Informacje o postępowaniach sądowych i komorniczych'];

export default function DocumentsList() {
    return(
        <section className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Jakie dokumenty będą potrzebne?</h2>
                    <p className="mt-4 text-lg text-gray-600">Pomożemy Ci w zebraniu i weryfikacji całej niezbędnej dokumentacji. Podstawowa lista obejmuje:</p>
                </div>
                <div className="mt-12">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                        {docs.map(doc => (
                            <li key={doc} className="border-l-4 border-primary pl-4 py-1">{doc}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}