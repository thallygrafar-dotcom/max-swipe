function formatInline(text: string) {
  // Handle **bold**, *italic*, and clean up stray asterisks
  return text
    .split(/(\*\*.*?\*\*|\*.*?\*)/g)
    .map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-foreground font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em key={i} className="text-foreground/90 italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      // Clean stray asterisks
      return part.replace(/\*/g, '');
    });
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trimStart();

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2
          key={i}
          className="text-base font-bold font-display text-foreground mt-10 mb-4 pb-2 border-b border-border flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          {formatInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-sm font-semibold text-foreground mt-6 mb-3">
          {formatInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2.5 ml-1 my-1.5">
          <span className="text-primary mt-1.5 text-[8px]">●</span>
          <span className="text-sm text-foreground/85 leading-relaxed">
            {formatInline(trimmed.slice(2))}
          </span>
        </div>
      );
    } else if (trimmed.match(/^\d+\.\s/)) {
      const text = trimmed.replace(/^\d+\.\s/, '');
      const num = trimmed.match(/^(\d+)\./)?.[1];
      elements.push(
        <div key={i} className="flex items-start gap-2.5 ml-1 my-1.5">
          <span className="text-primary text-xs font-bold mt-0.5 tabular-nums">
            {num}.
          </span>
          <span className="text-sm text-foreground/85 leading-relaxed">
            {formatInline(text)}
          </span>
        </div>
      );
    } else if (trimmed === '') {
      elements.push(<div key={i} className="h-3" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-foreground/85 my-2 leading-relaxed">
          {formatInline(trimmed)}
        </p>
      );
    }
  });

  return <>{elements}</>;
}
