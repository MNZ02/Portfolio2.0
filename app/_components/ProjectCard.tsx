'use client';
import TransitionLink from '@/components/TransitionLink';
import { cn } from '@/lib/utils';
import { IProject } from '@/types';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

interface Props {
    project: IProject;
    index: number;
    featured?: boolean;
}

const ProjectCard = ({ project, index, featured = false }: Props) => {
    const hasPreview = project.thumbnail.trim().length > 0;

    return (
        <article
            className={cn(
                'project-card group relative overflow-hidden rounded-[28px] border border-border/60 bg-[linear-gradient(145deg,hsl(var(--surface-1)/0.92),hsl(var(--surface-2)/0.78))] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_18px_55px_hsl(var(--background)/0.45)]',
                featured ? 'lg:col-span-8' : 'lg:col-span-4',
            )}
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,hsl(var(--primary)/0.18),transparent_48%),radial-gradient(circle_at_88%_100%,hsl(var(--accent-soft)/0.16),transparent_42%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" />

            {hasPreview && (
                <div
                    className={cn(
                        'relative overflow-hidden border-b border-border/50',
                        featured ? 'aspect-[16/8.6]' : 'aspect-[16/10]',
                    )}
                >
                    <Image
                        src={project.thumbnail}
                        alt={`${project.title} preview`}
                        fill
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes={featured ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, 100vw'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
                </div>
            )}

            <div className="relative p-5 md:p-6">
                <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-background/55 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/90 backdrop-blur-sm">
                        {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span
                        className={cn(
                            'rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.13em] backdrop-blur-sm',
                            project.status === 'in-progress'
                                ? 'border-primary/35 bg-primary/15 text-primary'
                                : 'border-white/20 bg-background/55 text-foreground/85',
                        )}
                    >
                        {project.status === 'in-progress'
                            ? 'In Progress'
                            : 'Completed'}
                    </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <h3
                        className={cn(
                            'font-sora leading-[0.98]',
                            featured
                                ? 'text-3xl sm:text-[2.2rem]'
                                : 'text-[1.95rem] sm:text-[2.05rem]',
                        )}
                    >
                        {project.title}
                    </h3>
                    <span className="mt-1 rounded-full border border-border/70 bg-background/45 px-2.5 py-1 text-[11px] uppercase tracking-[0.13em] text-muted-foreground">
                        {project.year}
                    </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                    {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.slice(0, featured ? 5 : 4).map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-foreground/90"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/12 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-primary transition-all duration-300 hover:border-primary/60 hover:bg-primary/18"
                        >
                            Live Demo
                            <ExternalLink size={13} />
                        </a>
                    )}

                    {project.sourceCode && (
                        <a
                            href={project.sourceCode}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/50 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-foreground/85 transition-all duration-300 hover:border-primary/45 hover:text-primary"
                        >
                            GitHub
                            <Github size={13} />
                        </a>
                    )}

                    <TransitionLink
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/65 bg-background/45 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-foreground/85 transition-all duration-500 hover:border-primary/45 hover:text-primary md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    >
                        Case Study
                        <ArrowUpRight size={13} />
                    </TransitionLink>
                </div>
            </div>
        </article>
    );
};

export default ProjectCard;
