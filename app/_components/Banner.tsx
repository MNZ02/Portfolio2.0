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
    { value: '3+', label: 'Years of experience' },
    { value: '7+', label: 'Projects shipped' },
    { value: '10K+', label: 'Hours of delivery' },
];

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            gsap.from('.hero-intro', {
                y: 32,
                autoAlpha: 0,
                duration: 0.7,
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
                y: -56,
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
            className="relative overflow-hidden pb-12 pt-16 md:pb-14 md:pt-20"
            id="banner"
        >
            <ArrowAnimation />

            <div className="container" ref={containerRef}>
                <div className="grid min-h-[calc(100svh-92px)] items-center gap-8 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-7 xl:col-span-8">
                        <p className="hero-intro hero-float eyebrow mb-6 inline-flex rounded-full border border-border/70 bg-background-light/70 px-4 py-2 text-[11px]">
                            {GENERAL_INFO.availability}
                        </p>

                        <h1 className="hero-intro hero-float font-anton text-6xl leading-[0.94] sm:text-7xl md:text-[88px]">
                            FULL-STACK
                            <br />
                            <span className="text-primary">SYSTEM BUILDER</span>
                        </h1>

                        <p className="hero-intro hero-float mt-7 max-w-[680px] text-base text-muted-foreground md:text-lg md:leading-relaxed">
                            Hi, I&apos;m Abdul Minhaz. I build complex backend-first
                            products with clear architecture, resilient data models,
                            and AI-assisted workflows that hold up in production.
                        </p>

                        <div className="hero-intro hero-float mt-10 flex flex-wrap items-center gap-4">
                            <Button
                                as="link"
                                href={GENERAL_INFO.upworkProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="primary"
                            >
                                {GENERAL_INFO.ctaLabel || 'Start a Project'}
                            </Button>

                            <Button
                                as="link"
                                href="/#selected-projects"
                                variant="link"
                                className="text-muted-foreground"
                            >
                                Explore Case Studies
                            </Button>
                        </div>

                        <div className="hero-intro hero-float mt-7 grid gap-3 sm:grid-cols-3">
                            {METRICS.map((metric) => (
                                <div className="kpi-card" key={metric.label}>
                                    <p className="font-anton text-4xl leading-none text-primary">
                                        {metric.value}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {metric.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hero-intro hero-float lg:col-span-5 xl:col-span-4 lg:pl-2">
                        <p className="eyebrow mb-3">Live Delivery Signals</p>
                        <HeroTerminalPanels panels={HERO_TERMINAL_PANELS} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
