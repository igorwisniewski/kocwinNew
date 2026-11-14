"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DynamicIcon } from '@/lib/icons';

gsap.registerPlugin(ScrollTrigger);

const defaultValues = [
    {
        name: 'Empatia i Zrozumienie',
        description: 'Każda historia jest inna. Słuchamy z szacunkiem i bez uprzedzeń. Oddłużenie to nie tylko prawo — to ludzka sprawa.',
        icon: 'UserGroupIcon',
    },
    {
        name: 'Profesjonalizm i Etyka',
        description: 'Działamy zgodnie z przepisami, transparentnie i rzetelnie. Twoją sprawą zajmuje się zawodowy pełnomocnik — radca prawny lub doradca restrukturyzacyjny.',
        icon: 'ScaleIcon',
    },
    {
        name: 'Pełna Dyskrecja i Poufność',
        description: 'Twoje dane i sytuacja finansowa są u nas całkowicie bezpieczne. Zapewniamy wsparcie w zaufaniu i dyskrecji — to fundament każdej współpracy.',
        icon: 'ShieldCheckIcon',
    },
];

export default function OurValues({ content }: { content?: any }) {
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
            }
        });

        tl.from('.animate-values-title', { y: 40, opacity: 0, duration: 0.6 })
            .from('.animate-value-card', { y: 40, opacity: 0, stagger: 0.2, duration: 0.5 }, '-=0.3');

    }, { scope: container });

    const title = content?.title || "Nasze fundamentalne wartości";
    const values = content?.items && content.items.length > 0 ? content.items : defaultValues;

    return (
        <section ref={container} className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="animate-values-title text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h2>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {values.map((value: any) => (
                            <div key={value.id || value.name} className="animate-value-card flex flex-col items-center text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-700 text-white">
                                    <DynamicIcon name={value.icon} className="h-7 w-7 text-white" />
                                </div>
                                <dt className="mt-4 text-lg font-semibold leading-7 text-gray-900">{value.name}</dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">{value.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
