import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fightingdemons.app',
  appName: 'Fighting Demons',
  webDir: 'build',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_launcher_foreground',
      iconColor: '#9C27B0',
      sound: 'default'
    }
  }
};

export default config;
