type MaxLabVideoCardProps = {
  title: string;
  embedUrl: string;
  tag?: string;
};

export default function MaxLabVideoCard({
  title,
  embedUrl,
  tag,
}: MaxLabVideoCardProps) {
  return (
    <div className="border rounded-xl p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {tag && (
          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-md border">
            {tag}
          </span>
        )}
      </div>

      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}