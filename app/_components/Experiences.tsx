'use client';
import parse from 'html-react-parser';
import SectionTitle from '@/components/SectionTitle';
import { GENERAL_INFO, MY_EXPERIENCE } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { MoveUpRight } from 'lucide-react';
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

    const regularExperiences = MY_EXPERIENCE.filter((item) => !item.isInternship);
    const internshipExperiences = MY_EXPERIENCE.filter(
        (item) => item.isInternship,
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
                                    key={`${item.company}-${item.title}-${item.duration}`}
                                    className="experience-item surface-card p-6 md:p-8 transition-colors hover:border-primary/30"
                                >
                                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <p className="eyebrow">{item.company}</p>
                                                {item.isFreelance && (
                                                    <span className="inline-flex items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-300 shadow-[0_1px_6px_rgba(99,102,241,0.15)]">
                                                        Freelance
                                                    </span>
                                                )}
                                                {item.isInternship && (
                                                    <span className="inline-flex items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-teal-300 shadow-[0_1px_6px_rgba(20,184,166,0.15)]">
                                                        Internship
                                                    </span>
                                                )}
                                                {item.isTrainee && (
                                                    <span className="inline-flex items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300 shadow-[0_1px_6px_rgba(245,158,11,0.15)]">
                                                        Trainee
                                                    </span>
                                                )}
                                                {item.liveUrl && (
                                                    <a
                                                        href={item.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group/link relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary transition-all duration-300 hover:scale-105 hover:bg-primary/20 hover:shadow-[0_0_12px_hsl(var(--primary)/0.25)]"
                                                        aria-label={`Visit ${item.company}`}
                                                    >
                                                        <span className="relative z-10">Live Site</span>
                                                        <MoveUpRight
                                                            size={12}
                                                            className="relative z-10 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                                        />
                                                    </a>
                                                )}
                                            </div>
                                            <h3 className="mt-2 font-sora text-2xl leading-[1.1] md:text-3xl lg:text-4xl">
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
                                        key={`${item.company}-${item.title}-${item.duration}`}
                                        className="experience-item surface-card flex flex-col p-5 md:p-6 transition-colors hover:border-primary/30"
                                    >
                                        <div className="flex flex-col">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <p className="eyebrow">{item.company}</p>
                                                {item.isFreelance && (
                                                    <span className="inline-flex items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-300 shadow-[0_1px_6px_rgba(99,102,241,0.15)]">
                                                        Freelance
                                                    </span>
                                                )}
                                                {item.isInternship && (
                                                    <span className="inline-flex items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-teal-300 shadow-[0_1px_6px_rgba(20,184,166,0.15)]">
                                                        Internship
                                                    </span>
                                                )}
                                                {item.isTrainee && (
                                                    <span className="inline-flex items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300 shadow-[0_1px_6px_rgba(245,158,11,0.15)]">
                                                        Trainee
                                                    </span>
                                                )}
                                                {item.liveUrl && (
                                                    <a
                                                        href={item.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group/link relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary transition-all duration-300 hover:scale-105 hover:bg-primary/20 hover:shadow-[0_0_12px_hsl(var(--primary)/0.25)]"
                                                        aria-label={`Visit ${item.company}`}
                                                    >
                                                        <span className="relative z-10">Live Site</span>
                                                        <MoveUpRight
                                                            size={12}
                                                            className="relative z-10 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                                        />
                                                    </a>
                                                )}
                                            </div>
                                            <h3 className="mt-1 font-sora text-2xl leading-tight md:text-3xl">
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
                        <h3 className="mt-3 font-sora text-3xl md:text-4xl">
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
