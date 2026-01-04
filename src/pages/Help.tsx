import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, MessageCircle, ChevronDown, 
  Send, HelpCircle, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order by going to 'My Orders' from the Account page. Click on any order to see real-time tracking with live driver location."
  },
  {
    question: "What are your delivery hours?",
    answer: "We deliver from 6 AM to 10 PM every day. For scheduled deliveries, you can choose your preferred time slot during checkout."
  },
  {
    question: "How do I return or refund an item?",
    answer: "If you're not satisfied with any product, contact us within 24 hours of delivery. We offer full refunds or replacements for quality issues."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept UPI, Credit/Debit Cards, Net Banking, Wallets (Paytm, PhonePe), and Cash on Delivery."
  },
  {
    question: "How do subscriptions work?",
    answer: "Subscribe to products you use regularly and get them delivered automatically. You can pause, modify, or cancel anytime from your Subscriptions page."
  },
  {
    question: "Is there a minimum order value?",
    answer: "There's no minimum order value. However, orders above ₹199 qualify for free delivery."
  },
  {
    question: "How fresh are your products?",
    answer: "All our products are sourced fresh daily from local farms and vendors. Meat and fish are never frozen - always fresh."
  },
];

const Help: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        user_id: user?.id || null,
        name: result.data.name,
        email: result.data.email,
        subject: result.data.subject,
        message: result.data.message,
      });

      if (error) throw error;

      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const phone = '919876543210';
    const message = encodeURIComponent('Hi! I need help with my order.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const openPhone = () => {
    window.open('tel:+919876543210', '_self');
  };

  const openEmail = () => {
    window.open('mailto:support@freshmart.com', '_self');
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground sticky top-0 z-50">
        <div className="flex items-center gap-4 px-4 py-4 safe-area-top">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-xl font-bold">Help & Support</h1>
            <p className="text-sm opacity-80">We're here to help</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={openWhatsApp}
            className="bg-background rounded-xl p-4 shadow-sm border border-border flex flex-col items-center gap-2 hover:border-primary transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-foreground">WhatsApp</span>
          </button>
          <button
            onClick={openPhone}
            className="bg-background rounded-xl p-4 shadow-sm border border-border flex flex-col items-center gap-2 hover:border-primary transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-foreground">Call Us</span>
          </button>
          <button
            onClick={openEmail}
            className="bg-background rounded-xl p-4 shadow-sm border border-border flex flex-col items-center gap-2 hover:border-primary transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-foreground">Email</span>
          </button>
        </div>

        {/* FAQ Section */}
        <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Form */}
        <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-primary" />
            Send us a Message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Subject"
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
            </div>
            <div>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              />
              {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Help;
