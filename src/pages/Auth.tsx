import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, Phone, Mail, ArrowLeft, RefreshCw, Shield, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import logoImg from '@/assets/logo.png';
import OTPInput from '@/components/OTPInput';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';

type AuthMode = 'login' | 'signup';
type AuthMethod = 'phone' | 'email';
type AuthStep = 'choose' | 'form' | 'otp';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, signInWithPhone, verifyOTP, signUp } = useAuth();
  const { completeOnboarding } = useApp();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [method, setMethod] = useState<AuthMethod>('email');
  const [step, setStep] = useState<AuthStep>('choose');
  
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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

  const handleGuestContinue = () => {
    completeOnboarding();
    navigate('/home');
    toast.success('Welcome! You can create an account anytime.');
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) {
        toast.error(error.message || 'Google sign-in failed. Please use Email to continue.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed. Please use Email to continue.');
    }
    setIsLoading(false);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    setIsLoading(true);
    
    const { error } = mode === 'signup' 
      ? await signUp(phone, name) 
      : await signInWithPhone(phone);
    
    if (error) {
      const msg = error.message || 'Failed to send OTP';
      if (/sms provider|twilio/i.test(msg)) {
        toast.error('SMS OTP is temporarily unavailable. Please use Email or Google to sign in.');
      } else {
        toast.error(msg);
      }
      setIsLoading(false);
      return;
    }
    
    toast.success(`OTP sent to +91 ${phone}`);
    setIsLoading(false);
    setStep('otp');
    startResendTimer();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: name,
            },
          },
        });
        
        if (error) {
          toast.error(error.message);
        } else if (data.user && data.session) {
          // Auto-confirm is enabled, user is logged in immediately
          toast.success('Account created! Welcome! 🎉');
          completeOnboarding();
          navigate('/');
        } else if (data.user && !data.session) {
          // Email confirmation required
          toast.success('Account created! Check your email to confirm.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back! 🎉');
          completeOnboarding();
          navigate('/');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    }
    
    setIsLoading(false);
  };

  const handleVerifyOTP = async (otp: string) => {
    setIsLoading(true);
    
    const { error } = await verifyOTP(phone, otp);
    
    if (error) {
      toast.error(error.message || 'Invalid OTP');
      setIsLoading(false);
      return;
    }
    
    toast.success(mode === 'signup' ? 'Account created! 🎉' : 'Welcome back! 🎉');
    setIsLoading(false);
    completeOnboarding();
    navigate('/home');
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    const { error } = mode === 'signup' 
      ? await signUp(phone, name) 
      : await signInWithPhone(phone);
    
    if (error) {
      const msg = error.message || 'Failed to resend OTP';
      if (/sms provider|twilio/i.test(msg)) {
        toast.error('SMS OTP is temporarily unavailable. Please use Email or Google to sign in.');
      } else {
        toast.error(msg);
      }
    } else {
      toast.success('OTP resent successfully!');
      startResendTimer();
    }
    setIsLoading(false);
  };

  const resetToChoose = () => {
    setStep('choose');
    setMethod('email');
    setPhone('');
    setEmail('');
    setPassword('');
  };

  const getTitle = () => {
    if (step === 'otp') return 'Verify OTP';
    if (mode === 'signup') return 'Create Account';
    return 'Welcome Back!';
  };

  const getSubtitle = () => {
    if (step === 'otp') return `Enter the 6-digit code sent to +91 ${phone}`;
    if (mode === 'signup') return 'Join us for fresh, natural products';
    return 'Sign in to continue';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom">
      {/* Header with gradient */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-foreground/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary-foreground/5 rounded-full" />
        
        <div className="relative z-10">
          {step !== 'choose' && (
            <button 
              onClick={resetToChoose}
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
          <h1 className="font-heading text-2xl font-bold mb-1">{getTitle()}</h1>
          <p className="text-primary-foreground/80">{getSubtitle()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 -mt-6 relative z-10 pb-8">
        <div className="bg-card rounded-2xl shadow-elevated p-6 border border-border">
          
          {/* Step: Choose method */}
          {step === 'choose' && (
            <div className="space-y-4">
              {/* Guest continue */}
              <Button
                variant="outline"
                size="xl"
                className="w-full border-dashed border-2"
                onClick={handleGuestContinue}
              >
                <User className="w-5 h-5 mr-2" />
                Continue without account
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or sign in with</span>
                </div>
              </div>

              {/* Google */}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              {/* Email */}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => { setMethod('email'); setStep('form'); }}
              >
                <Mail className="w-5 h-5 mr-2" />
                Continue with Email
              </Button>

              {/* Phone */}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => { setMethod('phone'); setStep('form'); }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Continue with Phone
              </Button>

              {/* Toggle login/signup */}
              <p className="text-center text-sm text-muted-foreground pt-4">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>
          )}

          {/* Step: Form (email or phone) */}
          {step === 'form' && method === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Create a password (min 6 chars)' : 'Enter your password'}
                    className="w-full pl-12 pr-12 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  <>
                    {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </form>
          )}

          {step === 'form' && method === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
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
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  We'll send an OTP to verify your number
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

              {/* Fallback note */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  📱 Phone OTP requires SMS provider configuration. If you don't receive SMS, try Email or Google sign-in instead.
                </p>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </form>
          )}

          {/* Step: OTP verification */}
          {step === 'otp' && (
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
                  onClick={() => setStep('form')}
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
                <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
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

              {/* Fallback options */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-center text-muted-foreground mb-3">
                  Having trouble? Try another method:
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { setMethod('email'); setStep('form'); }}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleGoogleSignIn}
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    </svg>
                    Google
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features - show on choose step */}
        {step === 'choose' && (
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              Secure login • Quick checkout • Order tracking
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
