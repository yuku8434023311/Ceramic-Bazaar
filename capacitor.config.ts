import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ceramicbazaar.app',
  appName: 'Ceramic Bazaar',
  webDir: 'out',
  server: {
    url: 'https://ceramic-bazaar.vercel.app',
    allowNavigation: ['ceramic-bazaar.vercel.app', 'ceramicbazaar.com', '*.ceramicbazaar.com', '*.vercel.app'],
    cleartext: true
  }
};

export default config;

