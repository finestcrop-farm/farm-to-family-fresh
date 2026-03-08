import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Send, MessageSquare, ThumbsUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const RateUs: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTags = [
    'Fast Delivery', 'Fresh Products', 'Great Prices', 'Easy to Use',
    'Good Variety', 'Helpful Support', 'Subscription Love', 'Eco-Friendly',
  ];

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: 'Please select a rating', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      await supabase.from('contact_messages').insert({
        name: profile?.full_name || 'Anonymous',
        email: user?.email || 'noreply@ourpurenaturals.com',
        subject: `App Rating: ${rating}/5 Stars`,
        message: `Rating: ${rating}/5\nTags: ${selectedTags.join(', ')}\nFeedback: ${feedback}`,
        user_id: user?.id || null,
      });
      setSubmitted(true);
      toast({ title: 'Thank you for your feedback! 💚' });
    } catch {
      toast({ title: 'Failed to submit. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-primary-foreground/10" aria-label="Go back">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-heading text-lg font-bold">Rate Us</h1>
          </div>
        </header>
        <main className="px-4 py-16 text-center">
          <div className="bg-card border border-border rounded-2xl shadow-card p-8 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">Thank You!</h2>
            <p className="text-sm text-muted-foreground mt-2">Your feedback helps us improve and serve you better.</p>
            <div className="flex justify-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-6 h-6 ${s <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/20'}`} />
              ))}
            </div>
            <Button variant="hero" className="mt-6 w-full" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors" aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg font-bold">Rate Us</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-5">
        {/* Star Rating */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-6 text-center">
          <MessageSquare className="w-10 h-10 text-primary mx-auto mb-3" />
          <h2 className="font-heading text-lg font-bold text-foreground">How's your experience?</h2>
          <p className="text-sm text-muted-foreground mt-1">We'd love to hear from you!</p>
          <div className="flex justify-center gap-2 mt-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredStar || rating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-muted-foreground/20'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm font-medium text-primary mt-2 animate-fade-in">
              {ratingLabels[rating]}
            </p>
          )}
        </div>

        {/* Quick Tags */}
        <div>
          <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">What do you love?</h3>
          <div className="flex flex-wrap gap-2">
            {feedbackTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-5">
          <h3 className="font-heading text-sm font-bold text-foreground mb-3">Tell us more (optional)</h3>
          <Textarea
            placeholder="Share your thoughts, suggestions, or what we can improve..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Submit */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default RateUs;
