import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import './CommentSection.css';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setComments(data || []));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, name: name.trim(), body: body.trim() })
      .select()
      .single();
    setSubmitting(false);
    if (error) {
      toast.error('Failed to post comment.');
      return;
    }
    setComments(c => [...c, data]);
    setName('');
    setBody('');
    toast.success('Comment posted!');
  };

  return (
    <div className="comment-section">
      <h3 className="comments-heading">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="comments-empty">No comments yet — be the first!</p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="comment">
              <div className="comment-header">
                <span className="comment-name">{c.name}</span>
                <span className="comment-date">
                  {new Date(c.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>
              <p className="comment-body">{c.body}</p>
            </div>
          ))
        )}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <h4 className="comment-form-heading">Leave a comment</h4>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="comment-input"
        />
        <textarea
          placeholder="Write your comment..."
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          rows={4}
          className="comment-input comment-textarea"
        />
        <button type="submit" className="comment-submit" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}
