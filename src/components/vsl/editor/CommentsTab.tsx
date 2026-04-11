import { useState } from "react";
import { useVSL } from "@/contexts/vsl/VSLContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Reply, ChevronDown, ChevronRight } from "lucide-react";
import { Comment } from "@/types/vsl";
import ImageUploadField from "@/components/ImageUploadField";

const emptyComment = { name: "", text: "", avatar: "", likes: 0, time: "1 h" };

export function CommentsTab() {
  const { config, updateComment, addComment, removeComment, addReply, updateReply, removeReply } = useVSL();
  const [newComment, setNewComment] = useState({ ...emptyComment });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newReply, setNewReply] = useState({ ...emptyComment });
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const handleAddComment = () => {
    if (newComment.name && newComment.text) {
      addComment({
        id: Date.now().toString(),
        ...newComment,
        avatar: newComment.avatar || `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
      });
      setNewComment({ ...emptyComment });
    }
  };

  const handleAddReply = (parentId: string) => {
    if (newReply.name && newReply.text) {
      addReply(parentId, {
        id: `${parentId}-${Date.now()}`,
        ...newReply,
        avatar: newReply.avatar || `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
      });
      setNewReply({ ...emptyComment });
      setReplyingTo(null);
      setExpandedReplies(prev => new Set(prev).add(parentId));
    }
  };

  const toggleReplies = (id: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Add new comment */}
      <div className="rounded-lg border p-3 space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Adicionar Novo Comentário</Label>
        <Input placeholder="Nome" value={newComment.name} onChange={e => setNewComment(p => ({ ...p, name: e.target.value }))} className="text-sm" />
        <Textarea placeholder="Texto do comentário" value={newComment.text} onChange={e => setNewComment(p => ({ ...p, text: e.target.value }))} className="text-sm" />
        <div className="flex gap-2">
          <div className="flex-1">
            <ImageUploadField
              label="Avatar (opcional)"
              value={newComment.avatar}
              onChange={(url) => setNewComment(p => ({ ...p, avatar: url }))}
            />
          </div>
          <div className="w-20">
            <Label className="text-xs text-muted-foreground">Likes</Label>
            <Input type="number" className="text-sm mt-1" value={newComment.likes} onChange={e => setNewComment(p => ({ ...p, likes: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>
        <Button onClick={handleAddComment} className="w-full" size="sm">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Adicionar Comentário
        </Button>
      </div>

      {/* Existing comments */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
          Comentários Existentes ({config.comments.length})
        </Label>
        {config.comments.map((comment) => (
          <div key={comment.id} className="rounded-lg border bg-card p-3 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={comment.avatar} alt="" className="w-7 h-7 rounded-full" />
                <Input value={comment.name} onChange={e => updateComment(comment.id, { name: e.target.value })} className="h-7 text-sm font-semibold" />
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-destructive hover:text-destructive" onClick={() => removeComment(comment.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <Textarea value={comment.text} onChange={e => updateComment(comment.id, { text: e.target.value })} className="text-sm" rows={2} />
            <ImageUploadField
              label="Avatar"
              value={comment.avatar}
              onChange={(url) => updateComment(comment.id, { avatar: url })}
            />
            <div className="flex gap-2">
              <Input type="number" value={comment.likes} onChange={e => updateComment(comment.id, { likes: parseInt(e.target.value) || 0 })} className="w-20 h-7 text-sm" placeholder="Likes" />
              <Input value={comment.time} onChange={e => updateComment(comment.id, { time: e.target.value })} className="w-20 h-7 text-sm" placeholder="Tempo" />
            </div>

            {/* Replies section */}
            <div className="border-t pt-2 mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleReplies(comment.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {expandedReplies.has(comment.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  Respostas ({comment.replies?.length || 0})
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => {
                    setReplyingTo(replyingTo === comment.id ? null : comment.id);
                    setNewReply({ ...emptyComment });
                  }}
                >
                  <Reply className="w-3 h-3 mr-1" /> Adicionar Resposta
                </Button>
              </div>

              {replyingTo === comment.id && (
                <div className="ml-4 rounded border border-dashed p-2 space-y-2">
                  <Input placeholder="Nome" value={newReply.name} onChange={e => setNewReply(p => ({ ...p, name: e.target.value }))} className="h-7 text-sm" />
                  <Textarea placeholder="Texto da resposta" value={newReply.text} onChange={e => setNewReply(p => ({ ...p, text: e.target.value }))} className="text-sm" rows={2} />
                  <ImageUploadField
                    label="Avatar (opcional)"
                    value={newReply.avatar}
                    onChange={(url) => setNewReply(p => ({ ...p, avatar: url }))}
                  />
                  <Input type="number" placeholder="Likes" className="w-16 h-7 text-sm" value={newReply.likes} onChange={e => setNewReply(p => ({ ...p, likes: parseInt(e.target.value) || 0 }))} />
                  <Button onClick={() => handleAddReply(comment.id)} size="sm" className="w-full h-7 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Adicionar Resposta
                  </Button>
                </div>
              )}

              {expandedReplies.has(comment.id) && comment.replies?.map((reply) => (
                <div key={reply.id} className="ml-4 rounded border bg-muted/30 p-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={reply.avatar} alt="" className="w-5 h-5 rounded-full" />
                      <Input value={reply.name} onChange={e => updateReply(comment.id, reply.id, { name: e.target.value })} className="h-6 text-xs font-semibold" />
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-destructive hover:text-destructive" onClick={() => removeReply(comment.id, reply.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea value={reply.text} onChange={e => updateReply(comment.id, reply.id, { text: e.target.value })} className="text-xs" rows={2} />
                  <ImageUploadField
                    label="Avatar"
                    value={reply.avatar}
                    onChange={(url) => updateReply(comment.id, reply.id, { avatar: url })}
                  />
                  <div className="flex gap-2">
                    <Input type="number" value={reply.likes} onChange={e => updateReply(comment.id, reply.id, { likes: parseInt(e.target.value) || 0 })} className="w-16 h-6 text-xs" />
                    <Input value={reply.time} onChange={e => updateReply(comment.id, reply.id, { time: e.target.value })} className="w-16 h-6 text-xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
