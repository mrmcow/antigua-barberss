"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Star, Send, Users, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  display_name: string | null;
  comment: string;
  rating: number | null;
  is_local: boolean;
  created_at: string;
}

interface CommunityCommentsProps {
  barbershopId: string;
  barbershopName: string;
}

export function CommunityComments({ barbershopId, barbershopName }: CommunityCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [myCommentIds, setMyCommentIds] = useState<Set<string>>(new Set());
  
  // Form state
  const [newComment, setNewComment] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load my comment IDs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`my-comments-${barbershopId}`);
    if (stored) {
      setMyCommentIds(new Set(JSON.parse(stored)));
    }
  }, [barbershopId]);

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('barbershop_id', barbershopId)
        .eq('is_verified', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setComments(data);
      }
      setLoading(false);
    }
    fetchComments();
  }, [barbershopId]);

  // Submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    
    const { data, error } = await supabase
      .from('community_comments')
      .insert({
        barbershop_id: barbershopId,
        comment: newComment.trim(),
        display_name: displayName.trim() || null,
        is_verified: true // Auto-approve for now, add moderation later
      })
      .select()
      .single();

    if (!error && data) {
      setComments(prev => [data, ...prev]);
      
      // Store this comment ID as "mine"
      const newMyCommentIds = new Set(Array.from(myCommentIds).concat([data.id]));
      setMyCommentIds(newMyCommentIds);
      localStorage.setItem(`my-comments-${barbershopId}`, JSON.stringify(Array.from(newMyCommentIds)));
      
      setNewComment("");
      setDisplayName("");
      setShowForm(false);
    }
    
    setSubmitting(false);
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    const { error } = await supabase
      .from('community_comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      setComments(prev => prev.filter(c => c.id !== commentId));
      
      // Remove from my comments
      const newMyCommentIds = new Set(myCommentIds);
      newMyCommentIds.delete(commentId);
      setMyCommentIds(newMyCommentIds);
      localStorage.setItem(`my-comments-${barbershopId}`, JSON.stringify(Array.from(newMyCommentIds)));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours < 1 ? "Just now" : `${diffInHours}h ago`;
    }
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-gray-900">
          <MessageSquare className="w-4 h-4 text-[#0072C6]" />
          Community Says
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[10px] font-bold uppercase tracking-widest bg-[#CE1126] text-white px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors"
        >
          Add Comment
        </button>
      </div>

      {/* Add Comment Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
          <div>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name (Optional)"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#CE1126] focus:outline-none text-xs font-medium"
              maxLength={50}
            />
          </div>

          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#CE1126] focus:outline-none text-xs resize-none"
              rows={2}
              maxLength={500}
              required
            />
            <div className="text-[10px] text-gray-400 mt-1 text-right">{newComment.length}/500</div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-4 py-1.5 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-wider rounded-full hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-xs font-medium">No community comments yet.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#FCD116]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-3 h-3 text-[#0072C6]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        {comment.display_name || "Anonymous"}
                      </span>
                      {myCommentIds.has(comment.id) && (
                        <span className="text-[10px] bg-[#CE1126] text-white px-1.5 py-px rounded-full font-bold leading-none">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 block leading-none mt-0.5">{formatDate(comment.created_at)}</span>
                  </div>
                </div>
                
                {/* Delete button for my comments OR claim button for unclaimed */}
                {myCommentIds.has(comment.id) ? (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete your comment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const newMyCommentIds = new Set(Array.from(myCommentIds).concat([comment.id]));
                      setMyCommentIds(newMyCommentIds);
                      localStorage.setItem(`my-comments-${barbershopId}`, JSON.stringify(Array.from(newMyCommentIds)));
                    }}
                    className="text-[10px] text-gray-300 hover:text-gray-400 font-medium transition-colors"
                    title="Claim this comment as yours"
                  >
                    Claim
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pl-8">
                {comment.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
