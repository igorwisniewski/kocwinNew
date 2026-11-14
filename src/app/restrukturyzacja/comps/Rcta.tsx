"use client";
import React from 'react';
import Link from "next/link";

export default function RestructuringCta() {
    return(
        <section className="bg-primary/10 py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">Uratuj swoją firmę przed upadłością</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
                    Masz problemy z płynnością? Działaj, zanim będzie za późno. Zadzwoń: +48 576 970 911 lub napisz do nas.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/kontakt" className="inline-block rounded-md bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors">
                        Umów Bezpłatną Konsultację dla Firm
                    </Link>
                    <a href="mailto:biuro@tologiczne.pl" className="inline-block rounded-md bg-white/10 px-6 py-3 text-base font-semibold text-white border border-white/20 hover:bg-white/20 transition-colors">
                        Napisz: biuro@tologiczne.pl
                    </a>
                </div>
            </div>
        </section>
    );
}