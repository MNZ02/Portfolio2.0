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
    { stat: '2+', text: 'Years of experience' },
    { stat: '7+', text: 'Projects shipped' },
    { stat: '10K+', text: 'Engineering hours' },
];

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            const introTl = gsap.timeline({
                defaults: { ease: 'power3.out', duration: 0.8 },
            });

            introTl.from('.hero-intro', {
                y: 32,
                autoAlpha: 0,
                stagger: 0.08,
            });

            introTl.from(
                '.hero-terminal-item',
                {
                    y: 24,
                    autoAlpha: 0,
                    stagger: 0.1,
                    duration: 0.6,
                },
                '-=0.5',
            );

            // Floating effect on scroll - Simplified to avoid visibility conflicts
            gsap.to('.hero-float', {
                y: -64,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true,
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
                        <div className="hero-float">
                            <p className="hero-intro eyebrow mb-6 inline-flex rounded-full border border-border/70 bg-background-light/70 px-4 py-2 text-[11px]">
                                {GENERAL_INFO.availability}
                            </p>

                            <h1 className="hero-intro font-sora font-semibold text-6xl leading-[0.94] sm:text-7xl md:text-[88px]">
                                FULL-STACK
                                <br />
                                <span className="text-primary">
                                    SYSTEM BUILDER
                                </span>
                            </h1>

                            <p className="hero-intro mt-7 max-w-[680px] text-base text-muted-foreground md:text-lg md:leading-relaxed">
                                Hi, I&apos;m Abdul Minhaz. I build complex
                                backend-first products with clear architecture,
                                resilient data models, and AI-assisted workflows
                                that hold up in production.
                            </p>

                            <div className="hero-intro mt-10 flex flex-wrap items-center gap-4">
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

                            <div className="hero-intro mt-7 grid gap-3 sm:grid-cols-3">
                                {METRICS.map((metric) => (
                                    <div className="kpi-card" key={metric.text}>
                                        <p className="font-sora text-4xl leading-none text-primary">
                                            {metric.stat}
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {metric.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 lg:pl-2 xl:col-span-4">
                        <div className="hero-float">
                            <p className="hero-intro eyebrow mb-3">
                                Live Delivery Signals
                            </p>
                            <HeroTerminalPanels panels={HERO_TERMINAL_PANELS} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
