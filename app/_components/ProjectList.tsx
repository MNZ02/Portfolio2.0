'use client';
import SectionTitle from '@/components/SectionTitle';
import { PROJECTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import Project from './Project';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageContainer = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    useEffect(() => {
        const syncLayoutMode = () => {
            if (window.innerWidth >= 1280) {
                setSelectedProject(PROJECTS[0]?.slug ?? null);
                return;
            }

            setSelectedProject(null);
        };

        syncLayoutMode();

        window.addEventListener('resize', syncLayoutMode);

        return () => {
            window.removeEventListener('resize', syncLayoutMode);
        };
    }, []);

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            gsap.from('.project-row', {
                y: 30,
                autoAlpha: 0,
                duration: 0.62,
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

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !imageContainer.current || !selectedProject) {
            return;
        }

        if (window.innerWidth < 1280) {
            return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageContainer.current.getBoundingClientRect();
        const y = e.clientY - containerRect.top - imageRect.height / 2;

        gsap.to(imageContainer.current, {
            y,
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = () => {
        if (!imageContainer.current) return;

        gsap.to(imageContainer.current, {
            opacity: 0,
            duration: 0.25,
            ease: 'power2.out',
        });
    };

    const handleMouseEnter = (slug: string) => {
        if (window.innerWidth < 1280) {
            setSelectedProject(null);
            return;
        }

        setSelectedProject(slug);
    };

    return (
        <section className="section-divider py-16 md:py-28" id="selected-projects">
            <div className="container">
                <SectionTitle
                    title="Selected Projects"
                    eyebrow="Resume-Driven Case Studies"
                />

                <p className="max-w-[740px] text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg md:leading-relaxed">
                    Projects focused on secure architecture, government service
                    delivery, and backend reliability, including Psigenei and
                    Mobipay impact work.
                </p>

                <div
                    className="relative mt-8 md:mt-10"
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {selectedProject && (
                        <div
                            className="pointer-events-none absolute right-0 top-0 z-[2] hidden w-[280px] overflow-hidden rounded-2xl border border-border/70 bg-background-light/70 opacity-0 xl:block"
                            ref={imageContainer}
                        >
                            {PROJECTS.map((project) => (
                                <Image
                                    src={project.thumbnail}
                                    alt={`${project.title} thumbnail`}
                                    width="400"
                                    height="520"
                                    className={cn(
                                        'absolute inset-0 aspect-[4/5] h-full w-full object-cover transition-opacity duration-300',
                                        {
                                            'opacity-0':
                                                project.slug !== selectedProject,
                                        },
                                    )}
                                    key={project.slug}
                                />
                            ))}

                            <div className="relative aspect-[4/5]"></div>
                        </div>
                    )}

                    <div className="grid gap-4 pr-0 xl:pr-[320px]">
                        {PROJECTS.map((project, index) => (
                            <Project
                                index={index}
                                project={project}
                                selectedProject={selectedProject}
                                onMouseEnter={handleMouseEnter}
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
