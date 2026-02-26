'use client';
import parse from 'html-react-parser';
import TransitionLink from '@/components/TransitionLink';
import { IProject } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    project: IProject;
}

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ProjectDetails = ({ project }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            gsap.from('.detail-reveal', {
                y: 28,
                autoAlpha: 0,
                stagger: 0.08,
                duration: 0.55,
                ease: 'power2.out',
            });
        },
        { scope: containerRef },
    );

    const statusLabel =
        project.status === 'in-progress' ? 'In Progress' : 'Completed';

    return (
        <section className="pb-16 pt-8 md:pb-20">
            <div className="container" ref={containerRef}>
                <TransitionLink
                    back
                    href="/"
                    className="detail-reveal mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/70 hover:text-primary"
                >
                    <ArrowLeft size={14} />
                    Back
                </TransitionLink>

                <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                    <div className="detail-reveal lg:col-span-8">
                        <h1 className="font-sora text-5xl leading-[0.95] md:text-7xl">
                            {project.title}
                        </h1>

                        <p className="mt-5 max-w-[760px] text-muted-foreground md:text-lg md:leading-relaxed">
                            {project.description}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-border/70 bg-background-light/65 px-3 py-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                {project.year}
                            </span>
                            {project.status && (
                                <span
                                    className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em] ${
                                        project.status === 'in-progress'
                                            ? 'border-primary/45 bg-primary/12 text-primary'
                                            : 'border-border/70 bg-background-light/65 text-muted-foreground'
                                    }`}
                                >
                                    {statusLabel}
                                </span>
                            )}
                        </div>

                        {(project.sourceCode || project.liveUrl) && (
                            <div className="mt-6 flex gap-3">
                                {project.sourceCode && (
                                    <a
                                        href={project.sourceCode}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background-light/60 text-muted-foreground transition-colors hover:border-primary/65 hover:text-primary"
                                        aria-label="Source code"
                                    >
                                        <Github size={18} />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background-light/60 text-muted-foreground transition-colors hover:border-primary/65 hover:text-primary"
                                        aria-label="Live project"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                            </div>
                        )}

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            <article className="surface-card p-6">
                                <p className="eyebrow mb-3">Tech and techniques</p>
                                <div className="text-sm text-muted-foreground md:text-base">
                                    {project.techStack.join(', ')}
                                </div>
                            </article>

                            {project.role && (
                                <article className="surface-card p-6">
                                    <p className="eyebrow mb-3">My role</p>
                                    <div className="markdown-text text-sm text-muted-foreground md:text-base">
                                        {parse(project.role)}
                                    </div>
                                </article>
                            )}
                        </div>
                    </div>

                    <aside className="detail-reveal lg:col-span-4 lg:pt-2">
                        <div className="surface-card p-6 lg:sticky lg:top-24">
                            <p className="eyebrow mb-4">Project brief</p>
                            <div className="markdown-text text-sm text-muted-foreground md:text-base md:leading-relaxed">
                                {parse(project.description)}
                            </div>
                        </div>
                    </aside>
                </div>

                {project.images.length > 0 && (
                    <div className="mt-12 grid gap-4" id="images">
                        {project.images.map((image) => (
                            <article
                                key={image}
                                className="detail-reveal group relative overflow-hidden rounded-2xl border border-border/70 bg-background-light/55"
                            >
                                <div
                                    className="aspect-[16/9] w-full bg-cover bg-center bg-no-repeat"
                                    style={{
                                        backgroundImage: `url(${image})`,
                                    }}
                                ></div>

                                <a
                                    href={image}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/75 text-muted-foreground opacity-0 transition-all hover:border-primary/70 hover:text-primary group-hover:opacity-100"
                                    aria-label="Open full image"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectDetails;
