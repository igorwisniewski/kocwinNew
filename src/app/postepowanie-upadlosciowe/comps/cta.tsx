"use client";
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function BankruptcyCta() {
    return(
        <section className="bg-primary/10 py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">Gotowy, by pożegnać długi?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">Nie musisz przez to przechodzić sam.
                    Zacznij nowy etap życia bez presji, stresu i komorników – z naszym wsparciem.</p>
                <div className="mt-8">
                    <Link href="/kontakt" className="inline-block rounded-md bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors">
                        Umów Bezpłatną Konsultację
                    </Link>
                </div>
            </div>
        </section>
    );
}