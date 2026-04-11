import { Comment, ColorConfig } from '@/types/vsl';
import { ThumbsUp } from 'lucide-react';

interface CommentCardProps {
  comment: Comment;
  isReply?: boolean;
  colors: ColorConfig;
}

export function CommentCard({ comment, isReply = false, colors }: CommentCardProps) {
  return (
    <div className={`flex gap-3 ${isReply ? 'ml-12 mt-3' : ''}`}>
      <img
        src={comment.avatar}
        alt={comment.name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-sm" style={{ color: colors.commentNameColor }}>
          {comment.name}
        </h4>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: colors.commentText }}>
          {comment.text}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <button className="font-semibold hover:underline" style={{ color: colors.facebookBlue }}>
            Like
          </button>
          <span>·</span>
          <button className="font-semibold hover:underline" style={{ color: colors.facebookBlue }}>
            Reply
          </button>
          <span>·</span>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" style={{ color: colors.facebookBlue, fill: colors.facebookBlue }} />
            <span>{comment.likes}</span>
          </div>
          <span>·</span>
          <span>{comment.time}</span>
        </div>

        {comment.replies?.map(reply => (
          <CommentCard key={reply.id} comment={reply} isReply colors={colors} />
        ))}
      </div>
    </div>
  );
}
