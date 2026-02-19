'use client';
import SectionTitle from '@/components/SectionTitle';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            gsap.from('.about-reveal', {
                y: 42,
                autoAlpha: 0,
                stagger: 0.12,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: container.current,
                    start: 'top 78%',
                },
            });
        },
        { scope: container },
    );

    return (
        <section className="section-divider py-20 md:py-32" id="about-me">
            <div className="container" ref={container}>
                <SectionTitle title="About Me" eyebrow="What I Focus On" />

                <div className="grid gap-10 md:grid-cols-12 md:gap-12">
                    <div className="about-reveal md:col-span-5">
                        <h2 className="text-4xl leading-tight md:text-5xl md:leading-[1.08]">
                            I design systems that handle complexity, constraints,
                            and edge cases without slowing teams down.
                        </h2>
                    </div>

                    <div className="about-reveal md:col-span-7">
                        <div className="surface-card p-6 md:p-8">
                            <p className="text-base text-muted-foreground md:text-lg md:leading-relaxed">
                                I&apos;m a full-stack developer and system architect
                                focused on backend logic, data modeling, and
                                scalable product foundations.
                            </p>

                            <p className="mt-4 text-base text-muted-foreground md:text-lg md:leading-relaxed">
                                I work across the stack, but my strongest value is
                                turning ambiguous product requirements into clear,
                                rule-driven systems that teams can trust.
                            </p>

                            <ul className="mt-6 grid gap-2 text-sm text-foreground/90 md:grid-cols-2">
                                <li className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2">
                                    Rule-driven architecture
                                </li>
                                <li className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2">
                                    Scalable data modeling
                                </li>
                                <li className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2">
                                    Constraint validation
                                </li>
                                <li className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2">
                                    AI-assisted workflows
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
