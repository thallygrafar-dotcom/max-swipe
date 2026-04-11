import { useVSL } from '@/contexts/vsl/VSLContext';
import { CommentCard } from './CommentCard';

export function CommentsSection() {
  const { config } = useVSL();

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {config.comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} colors={config.colors} />
          ))}
        </div>
      </div>
    </section>
  );
}
