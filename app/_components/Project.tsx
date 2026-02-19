import TransitionLink from '@/components/TransitionLink';
import { cn } from '@/lib/utils';
import { IProject } from '@/types';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';

interface Props {
    index: number;
    project: IProject;
    selectedProject: string | null;
    onMouseEnter: (_slug: string) => void;
}

const Project = ({ index, project, selectedProject, onMouseEnter }: Props) => {
    const statusLabel =
        project.status === 'in-progress' ? 'In Progress' : 'Completed';

    return (
        <TransitionLink
            href={`/projects/${project.slug}`}
            className="project-row group block rounded-2xl border border-border/70 bg-[hsl(var(--surface-1)/0.84)] p-5 transition-all duration-300 hover:border-primary/45 hover:bg-[hsl(var(--surface-2)/0.85)] md:p-7"
            onMouseEnter={() => onMouseEnter(project.slug)}
        >
            {selectedProject === null && (
                <Image
                    src={project.thumbnail}
                    alt={`${project.title} preview`}
                    width="560"
                    height="350"
                    className="mb-6 aspect-[16/10] w-full rounded-xl border border-border/60 object-cover object-top"
                    loading="lazy"
                />
            )}

            <div className="flex items-start gap-4 md:gap-5">
                <div className="pt-1 font-anton text-sm text-muted-foreground">
                    {(index + 1).toString().padStart(2, '0')}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <h4 className="font-anton text-3xl leading-[0.95] sm:text-4xl md:text-5xl">
                            {project.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-border/70 bg-background-light/70 px-3 py-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                {project.year}
                            </span>
                            {project.status && (
                                <span
                                    className={cn(
                                        'rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em]',
                                        {
                                            'border-primary/45 bg-primary/12 text-primary':
                                                project.status ===
                                                'in-progress',
                                            'border-border/70 bg-background-light/70 text-muted-foreground':
                                                project.status === 'completed',
                                        },
                                    )}
                                >
                                    {statusLabel}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="mt-3 max-w-[760px] text-sm text-muted-foreground md:text-base md:leading-relaxed">
                        {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {project.techStack.slice(0, 4).map((tech) => (
                            <span
                                className="rounded-full border border-border/60 bg-background-light/60 px-3 py-1 text-xs uppercase tracking-[0.1em] text-foreground/85"
                                key={tech}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-primary/90 transition-colors group-hover:text-primary">
                        View Case Study
                        <MoveUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                </div>
            </div>
        </TransitionLink>
    );
};

export default Project;
