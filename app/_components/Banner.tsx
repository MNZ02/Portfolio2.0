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
      className="relative overflow-hidden pb-12 pt-20 sm:pb-16 sm:pt-24 md:pb-16 md:pt-28 lg:pt-20"
      id="banner"
    >
      <ArrowAnimation />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <div className="grid items-center gap-12 sm:min-h-[calc(100svh-120px)] sm:gap-16 lg:min-h-[calc(100svh-92px)] lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="hero-float">
              <p className="hero-intro eyebrow mb-5 inline-flex max-w-full rounded-full border border-border/70 bg-background-light/70 px-3 py-1.5 text-[10px] leading-5 whitespace-normal sm:mb-7 sm:px-4 sm:py-2 sm:text-[11px]">
                {GENERAL_INFO.availability}
              </p>

              <h1 className="hero-intro font-sora text-[2.25rem] font-semibold leading-[1.1] xs:text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[88px] lg:leading-[0.94]">
                FULL-STACK
                <br />
                <span className="text-primary">
                  SYSTEM BUILDER
                </span>
              </h1>

              <p className="hero-intro mt-5 max-w-[680px] text-sm leading-relaxed text-muted-foreground sm:mt-7 sm:text-base md:mt-8 md:text-lg md:leading-relaxed">
                Hi, I&apos;m Abdul Minhaz. I build complex
                backend-first products with clear architecture,
                resilient data models, and AI-assisted workflows
                that hold up in production.
              </p>

              <div className="hero-intro mt-8 flex flex-col items-stretch gap-3 sm:mt-11 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Button
                  as="link"
                  href={GENERAL_INFO.upworkProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  {GENERAL_INFO.ctaLabel || 'Start a Project'}
                </Button>

                <Button
                  as="link"
                  href="/#selected-projects"
                  variant="link"
                  className="w-full justify-center text-muted-foreground sm:w-auto sm:justify-start"
                >
                  Explore Case Studies
                </Button>
              </div>

              <div className="hero-intro mt-10 grid grid-cols-2 justify-items-start gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-8">
                {METRICS.map((metric) => (
                  <div className="kpi-card w-full" key={metric.text}>
                    <p className="font-sora text-2xl leading-none text-primary sm:text-4xl">
                      {metric.stat}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-tight text-muted-foreground sm:mt-2 sm:text-sm">
                      {metric.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 lg:mt-0 lg:col-span-5 lg:pl-6 xl:col-span-4">
            <div className="hero-float">
              <p className="hero-intro eyebrow mb-4 text-[10px] tracking-widest text-muted-foreground/80 sm:mb-5 sm:text-[11px]">
                LIVE DELIVERY SIGNALS
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
