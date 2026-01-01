import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, User, Phone, ArrowLeft, RefreshCw, Shield, Gift, Truck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import logoImg from '@/assets/logo.png';
import OTPInput from '@/components/OTPInput';
import { useAuth } from '@/contexts/AuthContext';

type SignupStep = 'details' | 'otp';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { user, signUp, verifyOTP } = useAuth();
  const [step, setStep] = useState<SignupStep>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to Terms & Conditions');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signUp(phone, name);
    
    if (error) {
      toast.error(error.message || 'Failed to send OTP');
      setIsLoading(false);
      return;
    }
    
    toast.success(`OTP sent to +91 ${phone}`);
    setIsLoading(false);
    setStep('otp');
    startResendTimer();
  };

  const handleVerifyOTP = async (otp: string) => {
    setIsLoading(true);
    
    const { error } = await verifyOTP(phone, otp);
    
    if (error) {
      toast.error(error.message || 'Invalid OTP');
      setIsLoading(false);
      return;
    }
    
    toast.success('Account created successfully! Welcome 🎉');
    setIsLoading(false);
    navigate('/');
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    const { error } = await signUp(phone, name);
    
    if (error) {
      toast.error(error.message || 'Failed to resend OTP');
    } else {
      toast.success('OTP resent successfully!');
      startResendTimer();
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom">
      {/* Header with gradient */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-10 pb-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-foreground/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary-foreground/5 rounded-full" />
        
        <div className="relative z-10">
          {step === 'otp' && (
            <button 
              onClick={() => setStep('details')}
              className="flex items-center gap-2 mb-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <img 
            src={logoImg} 
            alt="OurPureNaturals" 
            className="h-12 w-auto mb-5"
          />
          <h1 className="font-heading text-2xl font-bold mb-1">
            {step === 'otp' ? 'Verify Phone' : 'Create Account'}
          </h1>
          <p className="text-primary-foreground/80">
            {step === 'otp' 
              ? `Enter the 6-digit code sent to +91 ${phone}`
              : 'Join us for fresh, natural products'
            }
          </p>
          
          {/* Step indicator */}
          <div className="flex gap-2 mt-4">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  (s === 1 && step === 'details') || (s === 2 && step === 'otp')
                    ? "w-10 bg-primary-foreground" 
                    : s < (step === 'details' ? 1 : 2)
                    ? "w-6 bg-primary-foreground/60"
                    : "w-6 bg-primary-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="flex-1 px-6 -mt-6 relative z-10 pb-8">
        <div className="bg-card rounded-2xl shadow-elevated p-6 border border-border">
          {step === 'details' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-border pr-3">
                    <span className="text-base">🇮🇳</span>
                    <span className="text-sm font-semibold text-foreground">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10 digit number"
                    className="w-full pl-24 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  We'll send an OTP to verify your number
                </p>
              </div>

              {/* Referral Code (Optional) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Referral Code <span className="text-muted-foreground">(Optional)</span>
                </label>
                <div className="relative">
                  <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="Enter referral code"
                    className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                  />
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5",
                    agreeTerms
                      ? "bg-primary border-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {agreeTerms && (
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <p className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <button type="button" className="text-primary font-medium hover:underline">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-primary font-medium hover:underline">
                    Privacy Policy
                  </button>
                </p>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full mt-4"
                disabled={isLoading || phone.length !== 10 || !agreeTerms}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending OTP...
                  </div>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-3">Join us & enjoy:</h3>
                <div className="space-y-2">
                  {[
                    { icon: Gift, text: '₹100 off on your first order', color: 'text-amber-500' },
                    { icon: Truck, text: 'Free delivery on orders above ₹199', color: 'text-primary' },
                    { icon: Heart, text: 'Exclusive member-only offers', color: 'text-rose-500' },
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <benefit.icon className={cn("w-4 h-4", benefit.color)} />
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SMS Provider Note */}
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  📱 Note: Phone OTP requires an SMS provider (Twilio) to be configured in Lovable Cloud settings.
                </p>
              </div>
            </form>
          ) : (
            /* OTP Verification Step */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-soft">
                  <Phone className="w-10 h-10 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  We've sent a verification code to
                </p>
                <p className="font-semibold text-foreground text-lg mt-1">
                  +91 {phone}
                </p>
                <button 
                  onClick={() => setStep('details')}
                  className="text-sm text-primary font-medium mt-1 hover:underline"
                >
                  Change number
                </button>
              </div>

              <OTPInput 
                length={6} 
                onComplete={handleVerifyOTP}
                disabled={isLoading}
              />

              {isLoading && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-sm">Verifying & creating account...</span>
                </div>
              )}

              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || isLoading}
                  className={cn(
                    "flex items-center justify-center gap-2 mx-auto text-sm font-semibold transition-colors",
                    resendTimer > 0 || isLoading
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-primary hover:text-primary/80"
                  )}
                >
                  <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>

              {/* OTP Tips */}
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  📱 Check your SMS inbox for the OTP. If you don't see it, check your spam folder.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Login link */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
