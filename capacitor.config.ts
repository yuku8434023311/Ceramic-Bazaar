import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ceramicbazaar.app',
  appName: 'Ceramic Bazaar',
  webDir: 'out',
  server: {
    url: 'http://10.171.121.88:3599',
    allowNavigation: ['10.171.121.88:3599', '10.30.51.192:3599', 'localhost:3599', 'ceramicbazaar.com', '*.ceramicbazaar.com', '*.loca.lt'],
    cleartext: true
  }
};

export default config;

