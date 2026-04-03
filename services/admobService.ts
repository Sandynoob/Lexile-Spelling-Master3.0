
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions } from '@capacitor-community/admob';

export class AdMobService {
  private static isInitialized = false;

  static async initialize() {
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
    try {
      await AdMob.hideBanner();
    } catch (e) {
      console.error('Failed to hide banner', e);
    }
  }

  static async resumeBanner() {
    try {
      await AdMob.resumeBanner();
    } catch (e) {
      console.error('Failed to resume banner', e);
    }
  }

  static async removeBanner() {
    try {
      await AdMob.removeBanner();
    } catch (e) {
      console.error('Failed to remove banner', e);
    }
  }

  static async showInterstitial() {
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
