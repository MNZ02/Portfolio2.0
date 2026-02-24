'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import Button from '@/components/Button';
import { GENERAL_INFO, HERO_TERMINAL_PANELS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';
import HeroTerminalPanels from './HeroTerminalPanels';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const METRICS = [
    {
        stat: 'Gov Programs',
        text: 'Delivered Public Registration, Job Mela, and Skill Courses service flows',
    },
    {
        stat: 'Identity & Access',
        text: 'Shipped RBAC + JWT controls with SSO-ready integration patterns',
    },
    {
        stat: 'Fintech + EdTech',
        text: 'Built reliable backend-first systems for Mobipay and Psigenei',
    },
];

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            gsap.from('.hero-intro', {
                y: 30,
                autoAlpha: 0,
                duration: 0.65,
                stagger: 0.09,
                ease: 'power2.out',
            });

            gsap.from('.hero-terminal-item', {
                y: 22,
                autoAlpha: 0,
                duration: 0.55,
                stagger: 0.1,
                delay: 0.2,
                ease: 'power2.out',
            });

            gsap.to('.hero-float', {
                y: -52,
                autoAlpha: 0.25,
                stagger: 0.05,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.8,
                },
            });
        },
        { scope: containerRef },
    );

    return (
        <section
            className="relative overflow-hidden pb-10 pt-14 sm:pt-16 md:pb-14 md:pt-20"
            id="banner"
        >
            <ArrowAnimation />

            <div className="container" ref={containerRef}>
                <div className="grid min-h-[calc(100svh-104px)] items-center gap-7 sm:min-h-[calc(100svh-90px)] sm:gap-8 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-7 xl:col-span-8">
                        <p className="hero-intro hero-float eyebrow mb-5 inline-flex rounded-full border border-border/70 bg-background-light/70 px-4 py-2 text-[10px] sm:text-[11px]">
                            {GENERAL_INFO.availability}
                        </p>

                        <h1 className="hero-intro hero-float font-anton text-[clamp(2.35rem,11vw,5.75rem)] leading-[0.92]">
                            FULL-STACK
                            <br />
                            <span className="text-primary">
                                PRODUCT ENGINEER
                            </span>
                        </h1>

                        <p className="hero-intro hero-float mt-5 max-w-[720px] text-[13px] leading-relaxed text-muted-foreground sm:mt-6 sm:text-base md:text-lg md:leading-relaxed">
                            I&apos;m Abdul Minhaz, a full-stack product engineer
                            focused on secure backend systems and measurable
                            product delivery. Across government, fintech, and
                            EdTech platforms, I ship Next.js + Node.js stacks
                            with strong RBAC/JWT foundations, SSO readiness,
                            and maintainable architecture.
                        </p>

                        <div className="hero-intro hero-float mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                            <Button
                                as="link"
                                href={GENERAL_INFO.upworkProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="primary"
                                className="w-full justify-center sm:w-auto"
                            >
                                {GENERAL_INFO.ctaLabel || 'Start a Project'}
                            </Button>

                            <Button
                                as="link"
                                href="/#selected-projects"
                                variant="link"
                                className="w-full justify-center text-muted-foreground sm:w-auto"
                            >
                                Explore Case Studies
                            </Button>
                        </div>

                        <div className="hero-intro hero-float mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {METRICS.map((metric) => (
                                <div className="kpi-card" key={metric.text}>
                                    <p className="font-anton text-xl leading-none text-primary sm:text-2xl md:text-3xl">
                                        {metric.stat}
                                    </p>
                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                        {metric.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hero-intro hero-float lg:col-span-5 xl:col-span-4 lg:pl-2">
                        <p className="eyebrow mb-3">Live Resume Signals</p>
                        <HeroTerminalPanels panels={HERO_TERMINAL_PANELS} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
