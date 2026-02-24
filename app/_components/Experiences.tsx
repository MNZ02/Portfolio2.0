'use client';
import parse from 'html-react-parser';
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

    const regularExperiences = MY_EXPERIENCE.filter(
        (item) => !item.title.toLowerCase().includes('intern'),
    );
    const internshipExperiences = MY_EXPERIENCE.filter((item) =>
        item.title.toLowerCase().includes('intern'),
    );

    return (
        <section className="section-divider py-20 md:py-32" id="my-experience">
            <div className="container" ref={containerRef}>
                <SectionTitle
                    title="My Experience"
                    eyebrow="Professional Timeline"
                />

                {MY_EXPERIENCE.length > 0 ? (
                    <div className="flex flex-col gap-8 md:gap-12">
                        {/* Regular Experiences */}
                        <div className="grid gap-4 md:gap-6">
                            {regularExperiences.map((item) => (
                                <article
                                    key={`${item.company}-${item.title}`}
                                    className="experience-item surface-card p-6 md:p-8 transition-colors hover:border-primary/30"
                                >
                                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                        <div>
                                            <p className="eyebrow">{item.company}</p>
                                            <h3 className="mt-2 font-anton text-2xl leading-[1.1] md:text-3xl lg:text-4xl">
                                                {item.title}
                                            </h3>
                                            <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                                                {item.duration}
                                            </p>
                                        </div>
                                    </div>

                                    {item.description && (
                                        <div className="markdown-text mt-6 max-w-[840px] text-base leading-relaxed text-muted-foreground md:text-md">
                                            {parse(item.description)}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>

                        {/* Internship Grid */}
                        {internshipExperiences.length > 0 && (
                            <div className="grid gap-4 md:gap-5 md:grid-cols-2">
                                {internshipExperiences.map((item) => (
                                    <article
                                        key={`${item.company}-${item.title}`}
                                        className="experience-item surface-card flex flex-col p-5 md:p-6 transition-colors hover:border-primary/30"
                                    >
                                        <div className="flex flex-col">
                                            <p className="eyebrow">{item.company}</p>
                                            <h3 className="mt-1 font-anton text-2xl leading-tight md:text-3xl">
                                                {item.title}
                                            </h3>
                                            <p className="mt-3 text-xs font-medium uppercase tracking-widest text-primary/80">
                                                {item.duration}
                                            </p>
                                        </div>

                                        {item.description && (
                                            <div className="markdown-text mt-4 text-sm leading-relaxed text-muted-foreground">
                                                {parse(item.description)}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}
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
