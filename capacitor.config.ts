import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c777807cb32c4051ab579f78ba996e9d',
  appName: 'OurPureNaturals',
  webDir: 'dist',
  server: {
    url: 'https://c777807c-b32c-4051-ab57-9f78ba996e9d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3CB043',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP'
    }
  }
};

export default config;
