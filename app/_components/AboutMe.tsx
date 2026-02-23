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
                y: 38,
                autoAlpha: 0,
                stagger: 0.11,
                duration: 0.65,
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
        <section className="section-divider py-16 md:py-28" id="about-me">
            <div className="container" ref={container}>
                <SectionTitle title="About Me" eyebrow="How I Build" />

                <div className="grid gap-8 md:grid-cols-12 md:gap-10 lg:gap-12">
                    <div className="about-reveal md:col-span-5">
                        <h2 className="text-3xl leading-tight sm:text-4xl md:text-5xl md:leading-[1.05]">
                            I build secure, production-ready systems that stay
                            maintainable as products scale.
                        </h2>
                    </div>

                    <div className="about-reveal md:col-span-7">
                        <div className="surface-card p-5 sm:p-6 md:p-8">
                            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg md:leading-relaxed">
                                I work across Next.js, React, Node.js, and
                                MongoDB to deliver platforms where architecture,
                                security, and product outcomes are tightly
                                aligned.
                            </p>

                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg md:leading-relaxed">
                                Recent work includes government portals,
                                SSO-enabled service flows, RBAC/JWT security
                                design, and backend-heavy systems for Psigenei
                                and Mobipay.
                            </p>

                            <ul className="mt-5 grid gap-2 text-xs text-foreground/90 sm:grid-cols-2 sm:text-sm md:mt-6 md:gap-3">
                                <li className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2">
                                    Next.js and React product delivery
                                </li>
                                <li className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2">
                                    Node.js service architecture
                                </li>
                                <li className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2">
                                    MongoDB data modeling
                                </li>
                                <li className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2">
                                    Security, RBAC, and JWT controls
                                </li>
                                <li className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2">
                                    Government workflow platforms
                                </li>
                                <li className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2">
                                    SSO and multi-system integration
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
