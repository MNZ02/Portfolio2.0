import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    icon?: ReactNode;
    className?: string;
    classNames?: {
        container?: string;
        title?: string;
        icon?: string;
        eyebrow?: string;
    };
    title: string;
    eyebrow?: string;
}

const SectionTitle = ({
    icon,
    title,
    className,
    classNames,
    eyebrow,
}: Props) => {
    return (
        <div
            className={cn(
                'mb-12 flex items-end gap-4 md:gap-7',
                className,
                classNames?.container,
            )}
        >
            <span className="shrink-0 rounded-full border border-border/70 bg-background-light/70 p-2.5">
                {icon ? (
                    icon
                ) : (
                    <span
                        className={cn(
                            'block font-mono text-sm font-semibold text-primary/80',
                            classNames?.icon,
                        )}
                    >
                        {'</>'}
                    </span>
                )}
            </span>

            <div className="min-w-0">
                {eyebrow && (
                    <p className={cn('eyebrow mb-2', classNames?.eyebrow)}>
                        {eyebrow}
                    </p>
                )}
                <h2
                    className={cn(
                        'text-xl leading-none uppercase tracking-[0.15em]',
                        classNames?.title,
                    )}
                >
                    {title}
                </h2>
            </div>

            <span className="hidden h-px flex-1 bg-border/70 md:block"></span>
        </div>
    );
};

export default SectionTitle;
