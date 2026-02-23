'use client';
import SectionTitle from '@/components/SectionTitle';
import { GENERAL_INFO, MY_EXPERIENCE } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            gsap.from('.experience-item', {
                y: 30,
                autoAlpha: 0,
                stagger: 0.12,
                duration: 0.62,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                },
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="section-divider py-16 md:py-28" id="my-experience">
            <div className="container" ref={containerRef}>
                <SectionTitle
                    title="Experience"
                    eyebrow="Professional Timeline"
                />

                {MY_EXPERIENCE.length > 0 ? (
                    <div className="grid gap-4 md:gap-5">
                        {MY_EXPERIENCE.map((item) => (
                            <article
                                key={`${item.company}-${item.title}`}
                                className="experience-item surface-card p-5 sm:p-6 md:p-7"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="eyebrow">{item.company}</p>
                                        <p className="mt-2 font-anton text-2xl leading-none sm:text-3xl md:text-4xl">
                                            {item.title}
                                        </p>
                                    </div>
                                    <p className="rounded-full border border-border/70 bg-background-light/70 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                        {item.duration}
                                    </p>
                                </div>

                                <p className="mt-4 max-w-[860px] text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
                                    {item.summary}
                                </p>

                                <ul className="mt-4 grid gap-2 md:grid-cols-2 md:gap-3">
                                    {item.highlights.map((highlight) => (
                                        <li
                                            key={highlight}
                                            className="rounded-lg border border-border/60 bg-surface-2/65 px-3 py-2 text-xs leading-relaxed text-foreground/90 sm:text-sm"
                                        >
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                ) : (
                    <article className="experience-item surface-card p-7 md:p-9">
                        <p className="eyebrow">Experience updates</p>
                        <h3 className="mt-3 font-anton text-3xl md:text-4xl">
                            Detailed role history will be published here.
                        </h3>
                        <p className="mt-4 max-w-[640px] text-muted-foreground md:text-lg">
                            I am currently consolidating recent work into
                            concise, public case notes. Reach out if you want a
                            direct walkthrough of relevant projects.
                        </p>
                        <a
                            href={`mailto:${GENERAL_INFO.email}`}
                            className="mt-6 inline-flex rounded-full border border-border/80 px-5 py-2.5 text-sm uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                            Contact for full timeline
                        </a>
                    </article>
                )}
            </div>
        </section>
    );
};

export default Experiences;
