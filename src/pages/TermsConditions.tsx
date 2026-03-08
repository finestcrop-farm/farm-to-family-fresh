import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const TermsConditions: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using the Our Pure Naturals application ("App"), you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use immediately. These terms apply to all users, including browsers, customers, merchants, and contributors of content.`,
    },
    {
      title: '2. Account Registration',
      content: `To use certain features, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years of age to create an account. We reserve the right to suspend or terminate accounts that violate our policies.`,
    },
    {
      title: '3. Products & Pricing',
      content: `All products listed are subject to availability. Prices are displayed in Indian Rupees (₹) and include applicable taxes unless stated otherwise. We reserve the right to modify prices without prior notice. Product images are representative and actual items may vary slightly in appearance.`,
    },
    {
      title: '4. Orders & Delivery',
      content: `Once an order is placed and confirmed, it is binding. Delivery times are estimates and may vary based on location, weather, and other factors. We aim to deliver within the selected time slot. If an order cannot be fulfilled, we will notify you and process a full refund. Minimum order values may apply for free delivery.`,
    },
    {
      title: '5. Cancellations & Refunds',
      content: `Orders can be cancelled before they are dispatched. Once dispatched, cancellations are not accepted. Refunds for cancelled orders will be processed within 5-7 business days to the original payment method. For quality issues, contact us within 24 hours of delivery with photographic evidence for a replacement or refund.`,
    },
    {
      title: '6. Payment Terms',
      content: `We accept UPI, credit/debit cards, net banking, and cash on delivery (where available). All online payments are processed through secure, PCI-DSS compliant payment gateways. We do not store your payment card details on our servers.`,
    },
    {
      title: '7. Subscriptions',
      content: `Subscription orders are recurring and will be charged and delivered as per the chosen frequency (daily, weekly, or monthly). You can pause, modify, or cancel subscriptions at any time through the App. Changes take effect from the next billing cycle.`,
    },
    {
      title: '8. Intellectual Property',
      content: `All content on this App, including text, graphics, logos, images, and software, is the property of Our Pure Naturals and is protected by Indian copyright and intellectual property laws. Unauthorized reproduction, distribution, or modification is prohibited.`,
    },
    {
      title: '9. User Conduct',
      content: `Users agree not to: use the App for any unlawful purpose; attempt to hack, disrupt, or exploit the App; submit false reviews or fraudulent orders; impersonate another person or entity; harvest or collect user data without consent.`,
    },
    {
      title: '10. Limitation of Liability',
      content: `Our Pure Naturals shall not be liable for any indirect, incidental, or consequential damages arising from use of the App. Our total liability shall not exceed the amount paid by you for the specific order in question. We are not responsible for delays caused by force majeure events.`,
    },
    {
      title: '11. Governing Law',
      content: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana. We encourage users to first attempt to resolve disputes through our customer support before pursuing legal action.`,
    },
    {
      title: '12. Changes to Terms',
      content: `We reserve the right to update these Terms at any time. Continued use of the App after changes constitutes acceptance. We will notify users of significant changes via the App or email. It is your responsibility to review these terms periodically.`,
    },
    {
      title: '13. Contact Information',
      content: `For questions regarding these Terms, contact us at:\n\nEmail: legal@ourpurenaturals.com\nPhone: +91 99999 99999\nAddress: Our Pure Naturals, Hyderabad, Telangana, India`,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg font-bold">Terms & Conditions</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        <div className="bg-card border border-border rounded-2xl shadow-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-foreground">Terms & Conditions</h2>
              <p className="text-xs text-muted-foreground">Last updated: March 8, 2026</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Welcome to Our Pure Naturals. These terms govern your use of our mobile application and services. Please read them carefully before using the App.
          </p>
        </div>

        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-2xl shadow-card p-5 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">{section.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default TermsConditions;
