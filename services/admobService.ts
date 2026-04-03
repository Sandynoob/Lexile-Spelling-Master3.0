
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions } from '../lib/admob';
import { Capacitor } from '@capacitor/core';

export class AdMobService {
  private static isInitialized = false;

  static async initialize() {
    if (Capacitor.getPlatform() === 'web') {
      console.log('AdMob is not supported on web. Skipping initialization.');
      return;
    }
    if (this.isInitialized) return;
    
    try {
      await AdMob.initialize({
        initializeForTesting: false,
      });
      this.isInitialized = true;
      console.log('AdMob Initialized');
    } catch (e) {
      console.error('AdMob Initialization failed', e);
    }
  }

  static async showBanner() {
    if (Capacitor.getPlatform() === 'web') return;
    
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-9053893199466734/4831734476', // Production Banner ID
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    };
    
    try {
      await AdMob.showBanner(options);
    } catch (e) {
      console.error('Failed to show banner', e);
    }
  }

  static async hideBanner() {
    if (Capacitor.getPlatform() === 'web') return;
    try {
      await AdMob.hideBanner();
    } catch (e) {
      console.error('Failed to hide banner', e);
    }
  }

  static async resumeBanner() {
    if (Capacitor.getPlatform() === 'web') return;
    try {
      await AdMob.resumeBanner();
    } catch (e) {
      console.error('Failed to resume banner', e);
    }
  }

  static async removeBanner() {
    if (Capacitor.getPlatform() === 'web') return;
    try {
      await AdMob.removeBanner();
    } catch (e) {
      console.error('Failed to remove banner', e);
    }
  }

  static async showInterstitial() {
    if (Capacitor.getPlatform() === 'web') return;
    
    const options: AdOptions = {
      adId: 'ca-app-pub-9053893199466734/4448591090', // Production Interstitial ID
    };
    
    try {
      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
    } catch (e) {
      console.error('Failed to show interstitial', e);
    }
  }
}
