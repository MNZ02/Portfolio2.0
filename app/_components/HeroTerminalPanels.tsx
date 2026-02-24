import { cn } from '@/lib/utils';
import { IHeroTerminalPanel } from '@/lib/data';

interface Props {
    panels: IHeroTerminalPanel[];
    className?: string;
}

const STATUS_STYLES: Record<NonNullable<IHeroTerminalPanel['status']>, string> = {
    ok: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300',
    warn: 'border-violet-500/35 bg-violet-500/10 text-violet-300',
};

const HeroTerminalPanels = ({ panels, className }: Props) => {
    return (
        <div className={cn('grid gap-3.5', className)}>
            {panels.map((panel, idx) => (
                <article
                    className="hero-terminal-item rounded-xl border border-border/70 bg-[hsl(var(--surface-1)/0.92)] shadow-[0_8px_32px_hsl(var(--background)/0.35)]"
                    key={`${panel.title}-${idx}`}
                >
                    <header className="flex items-center gap-2 border-b border-border/70 px-3.5 py-2.5">
                        <span className="inline-block size-2 rounded-full bg-cyan-300/85"></span>
                        <span className="inline-block size-2 rounded-full bg-sky-300/85"></span>
                        <span className="inline-block size-2 rounded-full bg-violet-300/90"></span>

                        <p className="ml-2 min-w-0 truncate text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                            {panel.title}
                        </p>

                        {panel.status && (
                            <span
                                className={cn(
                                    'ml-auto rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em]',
                                    STATUS_STYLES[panel.status],
                                )}
                            >
                                {panel.status}
                            </span>
                        )}
                    </header>

                    <div className="space-y-2 px-3.5 py-3 font-mono text-[11px] leading-relaxed sm:text-xs md:text-[13px]">
                        <p className="break-words text-primary">$ {panel.prompt}</p>
                        <div className="space-y-1 text-muted-foreground">
                            {panel.output.map((line, lineIdx) => (
                                <p
                                    className={cn('break-words', {
                                        'text-foreground':
                                            line.includes('✓') ||
                                            line.includes('200 OK') ||
                                            line.includes('uptime='),
                                    })}
                                    key={`${panel.title}-${lineIdx}`}
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default HeroTerminalPanels;
