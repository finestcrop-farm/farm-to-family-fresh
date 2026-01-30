import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Phone, ArrowLeft, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import logoImg from '@/assets/logo.png';
import OTPInput from '@/components/OTPInput';
import { useAuth } from '@/contexts/AuthContext';

type LoginStep = 'phone' | 'otp';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, signInWithPhone, verifyOTP, devAdminLogin, isDevAdmin } = useAuth();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<LoginStep>('phone');
  const [resendTimer, setResendTimer] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (user || isDevAdmin) {
      navigate('/');
    }
  }, [user, isDevAdmin, navigate]);

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
    
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Try dev admin login first (bypasses OTP)
    if (devAdminLogin(phone)) {
      navigate('/');
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signInWithPhone(phone);
    
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
    
    toast.success('Login successful! Welcome back 🎉');
    setIsLoading(false);
    navigate('/');
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    const { error } = await signInWithPhone(phone);
    
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
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-foreground/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary-foreground/5 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-primary-foreground/5 rounded-full blur-xl" />
        
        <div className="relative z-10">
          {step === 'otp' && (
            <button 
              onClick={() => setStep('phone')}
              className="flex items-center gap-2 mb-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <img 
            src={logoImg} 
            alt="OurPureNaturals" 
            className="h-14 w-auto mb-6"
          />
          <h1 className="font-heading text-3xl font-bold mb-2">
            {step === 'otp' ? 'Verify OTP' : 'Welcome Back!'}
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            {step === 'otp' 
              ? `Enter the 6-digit code sent to +91 ${phone}`
              : 'Sign in with your phone number'
            }
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="flex-1 px-6 -mt-8 relative z-10">
        <div className="bg-card rounded-2xl shadow-elevated p-6 border border-border">
          {step === 'phone' ? (
            <>
              <form onSubmit={handleSendOTP} className="space-y-5">
                {/* Phone input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-border pr-3">
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-sm font-semibold text-foreground">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10 digit number"
                      className="w-full pl-24 pr-4 py-4 bg-muted/50 border border-border rounded-xl text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Your number is safe and secure with us
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={isLoading || phone.length !== 10}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending OTP...
                    </div>
                  ) : (
                    <>
                      Get OTP
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Features */}
              <div className="mt-8 pt-6 border-t border-border space-y-4">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Why login with OTP?
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '🔒', text: 'Secure & Safe' },
                    { icon: '⚡', text: 'Quick Access' },
                    { icon: '🚫', text: 'No Password' },
                    { icon: '✅', text: 'Verified Login' },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{feature.icon}</span>
                      <span>{feature.text}</span>
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
            </>
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
                  onClick={() => setStep('phone')}
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
                  <span className="text-sm">Verifying...</span>
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

        {/* Sign up link */}
        <div className="text-center mt-6 mb-8">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
