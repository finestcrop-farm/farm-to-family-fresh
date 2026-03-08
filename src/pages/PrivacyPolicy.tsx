import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database, Share2, Trash2, Baby, Globe } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      items: [
        { subtitle: 'Personal Information', text: 'Name, phone number, email address, delivery addresses, and payment information provided during registration and checkout.' },
        { subtitle: 'Usage Data', text: 'App usage patterns, search queries, browsing history within the App, device information, IP address, and location data (with your consent).' },
        { subtitle: 'Order Information', text: 'Purchase history, delivery preferences, subscription details, and communication with our support team.' },
        { subtitle: 'Device Information', text: 'Device type, operating system, unique device identifiers, and push notification tokens.' },
      ],
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      items: [
        { subtitle: 'Service Delivery', text: 'Processing orders, managing deliveries, handling payments, and providing customer support.' },
        { subtitle: 'Personalization', text: 'Customizing product recommendations, offers, and content based on your preferences and purchase history.' },
        { subtitle: 'Communication', text: 'Sending order updates, delivery notifications, promotional offers (with your consent), and important service announcements.' },
        { subtitle: 'Improvement', text: 'Analyzing usage patterns to improve our App, services, and product offerings.' },
      ],
    },
    {
      icon: Share2,
      title: 'Information Sharing',
      items: [
        { subtitle: 'Delivery Partners', text: 'Sharing necessary delivery details (name, address, phone) with our delivery partners to fulfill orders.' },
        { subtitle: 'Payment Processors', text: 'Payment information is shared with PCI-DSS compliant payment gateways for transaction processing.' },
        { subtitle: 'Legal Requirements', text: 'We may disclose information when required by law, court order, or government regulation.' },
        { subtitle: 'No Third-Party Sale', text: 'We never sell your personal information to third parties for marketing purposes.' },
      ],
    },
    {
      icon: Lock,
      title: 'Data Security',
      items: [
        { subtitle: 'Encryption', text: 'All data transmissions are encrypted using SSL/TLS protocols. Sensitive data is encrypted at rest.' },
        { subtitle: 'Access Controls', text: 'Strict access controls ensure only authorized personnel can access personal data, with audit logging.' },
        { subtitle: 'Regular Audits', text: 'We conduct regular security audits and vulnerability assessments to protect your data.' },
        { subtitle: 'Incident Response', text: 'We have a comprehensive incident response plan and will notify affected users within 72 hours of a data breach.' },
      ],
    },
    {
      icon: Trash2,
      title: 'Your Rights',
      items: [
        { subtitle: 'Access & Correction', text: 'You can access and update your personal information through the App settings at any time.' },
        { subtitle: 'Data Deletion', text: 'You can request complete deletion of your account and associated data by contacting our support team.' },
        { subtitle: 'Opt-Out', text: 'You can opt out of promotional communications through notification settings. Transactional messages cannot be opted out.' },
        { subtitle: 'Data Portability', text: 'You can request a copy of your personal data in a machine-readable format.' },
      ],
    },
    {
      icon: Baby,
      title: "Children's Privacy",
      items: [
        { subtitle: 'Age Requirement', text: 'Our App is not intended for children under 18. We do not knowingly collect personal information from minors.' },
        { subtitle: 'Parental Control', text: 'If we discover we have collected data from a minor, we will promptly delete it and notify the parent/guardian.' },
      ],
    },
    {
      icon: Globe,
      title: 'Cookies & Tracking',
      items: [
        { subtitle: 'Essential Cookies', text: 'We use essential cookies for authentication, security, and basic App functionality.' },
        { subtitle: 'Analytics', text: 'We use anonymous analytics to understand how users interact with our App to improve the experience.' },
        { subtitle: 'Preferences', text: 'We store your language, location, and display preferences locally on your device.' },
      ],
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
          <h1 className="font-heading text-lg font-bold">Privacy Policy</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-4">
        {/* Intro Card */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-foreground">Privacy Policy</h2>
              <p className="text-xs text-muted-foreground">Last updated: March 8, 2026</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            At Our Pure Naturals, we are committed to protecting your privacy. This policy explains how we collect, use, store, and protect your personal information when you use our application and services.
          </p>
        </div>

        {/* FSSAI Compliance */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">FSSAI & IT Act Compliant</p>
            <p className="text-xs text-muted-foreground mt-1">
              We comply with the Information Technology Act 2000, IT Rules 2011, and FSSAI regulations for food safety and data protection in India.
            </p>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-2xl shadow-card p-5 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <section.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-heading text-sm font-bold text-foreground">{section.title}</h3>
            </div>
            <div className="space-y-3">
              {section.items.map((item, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-foreground">{item.subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-5">
          <h3 className="font-heading text-sm font-bold text-foreground mb-2">Contact Our Privacy Team</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For privacy-related concerns or data requests, contact us at:
          </p>
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p>📧 privacy@ourpurenaturals.com</p>
            <p>📞 +91 99999 99999</p>
            <p>📍 Our Pure Naturals, Hyderabad, Telangana, India</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default PrivacyPolicy;
