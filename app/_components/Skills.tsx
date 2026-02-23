'use client';
import SectionTitle from '@/components/SectionTitle';
import { CORE_EXPERTISE, MY_STACK } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            gsap.from('.stack-card', {
                y: 30,
                autoAlpha: 0,
                duration: 0.62,
                stagger: 0.11,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 78%',
                },
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="section-divider py-16 md:py-28" id="my-stack">
            <div className="container" ref={containerRef}>
                <SectionTitle title="Skills" eyebrow="Core Expertise and Stack" />

                <div className="stack-card surface-card mb-5 p-5 sm:p-6 md:mb-6 md:p-8">
                    <p className="eyebrow mb-3">High-value capabilities</p>
                    <div className="grid gap-2 sm:grid-cols-2 md:gap-3">
                        {CORE_EXPERTISE.map((item) => (
                            <div
                                key={item}
                                className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2 text-xs text-foreground/90 sm:text-sm"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 md:gap-5">
                    {Object.entries(MY_STACK).map(([category, values]) => (
                        <article
                            className="stack-card surface-card grid gap-5 p-5 sm:p-6 md:grid-cols-12 md:gap-8 md:p-8"
                            key={category}
                        >
                            <div className="md:col-span-4">
                                <p className="font-anton text-2xl uppercase leading-none text-foreground sm:text-3xl md:text-4xl">
                                    {category}
                                </p>
                            </div>

                            <div className="md:col-span-8">
                                <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                                    {values.map((item) => (
                                        <div
                                            className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-2/60 px-3 py-2.5"
                                            key={item.name}
                                        >
                                            <Image
                                                src={item.icon}
                                                alt={item.name}
                                                width="34"
                                                height="34"
                                                className="h-8 w-8 object-contain"
                                            />
                                            <span className="text-xs capitalize text-foreground/90 sm:text-sm md:text-base">
                                                {item.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
