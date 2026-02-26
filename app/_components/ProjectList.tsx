'use client';
import SectionTitle from '@/components/SectionTitle';
import { PROJECTS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useRef } from 'react';
import ProjectCard from './ProjectCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedProjects = PROJECTS.filter(
        (project) =>
            !['psigenei', 'emiko-app-uiux', 'portfolio-website'].includes(
                project.slug,
            ),
    );

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            gsap.from('.project-row', {
                y: 32,
                duration: 0.65,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 82%',
                },
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="section-divider py-20 md:py-32" id="selected-projects">
            <div className="container">
                <SectionTitle
                    title="Selected Projects"
                    eyebrow="Recent Case Studies"
                    classNames={{ title: 'text-2xl tracking-[0.12em] md:text-3xl' }}
                />

                <div className="relative mt-8 overflow-hidden rounded-[32px] border border-border/60 bg-[linear-gradient(160deg,hsl(var(--surface-1)/0.72),hsl(var(--surface-2)/0.58))] p-5 backdrop-blur-md md:p-7 lg:p-8">
                    <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

                    <p className="relative max-w-[760px] text-sm leading-7 text-muted-foreground md:text-base">
                        A curated mix of UI/UX design and engineering projects,
                        crafted for visual quality, clear usability, and
                        production-level reliability.
                    </p>

                    <div
                        className="relative mt-7 grid gap-5 lg:grid-cols-12"
                        ref={containerRef}
                    >
                        {selectedProjects.map((project, index) => (
                            <ProjectCard
                                index={index}
                                project={project}
                                featured={
                                    index % 3 === 0 &&
                                    project.thumbnail.trim().length > 0
                                }
                                key={project.slug}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;
