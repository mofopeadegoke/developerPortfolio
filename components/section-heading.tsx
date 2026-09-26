type Props = {
  id: string;
  title: string;
  intro?: string;
};

export function SectionHeading({ id, title, intro }: Props) {
  return (
    <header className="mb-10 md:mb-14">
      <div className="flex items-end gap-4">
        <h2
          id={`${id}-heading`}
          className="font-display text-4xl font-semibold leading-none tracking-tight sm:text-5xl"
        >
          {title}
        </h2>
        <span aria-hidden="true" className="mb-1.5 h-px flex-1 bg-rule" />
      </div>
      {intro && <p className="mt-4 max-w-[60ch] text-lg text-pencil">{intro}</p>}
    </header>
  );
}
