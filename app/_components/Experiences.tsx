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
                y: 34,
                autoAlpha: 0,
                stagger: 0.12,
                duration: 0.65,
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
        <section className="section-divider py-20 md:py-32" id="my-experience">
            <div className="container" ref={containerRef}>
                <SectionTitle
                    title="My Experience"
                    eyebrow="Professional Timeline"
                />

                {MY_EXPERIENCE.length > 0 ? (
                    <div className="grid gap-4 md:gap-5">
                        {MY_EXPERIENCE.map((item) => (
                            <article
                                key={item.title}
                                className="experience-item surface-card p-6 md:p-7"
                            >
                                <p className="eyebrow">{item.company}</p>
                                <p className="mt-3 font-anton text-4xl leading-none md:text-5xl">
                                    {item.title}
                                </p>
                                <p className="mt-4 text-muted-foreground">
                                    {item.duration}
                                </p>
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
                            I am currently consolidating recent work into concise,
                            public case notes. Reach out if you want a direct
                            walkthrough of relevant projects.
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
