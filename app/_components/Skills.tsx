'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_STACK } from '@/lib/data';
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
                y: 32,
                autoAlpha: 0,
                duration: 0.65,
                stagger: 0.12,
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
        <section className="section-divider py-20 md:py-32" id="my-stack">
            <div className="container" ref={containerRef}>
                <SectionTitle title="My Stack" eyebrow="Tools and Platforms" />

                <div className="grid gap-5">
                    {Object.entries(MY_STACK).map(([category, values]) => (
                        <article
                            className="stack-card surface-card grid gap-6 p-6 md:grid-cols-12 md:gap-8 md:p-8"
                            key={category}
                        >
                            <div className="md:col-span-4">
                                <p className="font-sora text-3xl uppercase leading-none text-foreground md:text-4xl">
                                    {category}
                                </p>
                            </div>

                            <div className="md:col-span-8">
                                <div className="grid gap-3 sm:grid-cols-2">
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
                                            <span className="text-sm capitalize text-foreground/90 md:text-base">
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
