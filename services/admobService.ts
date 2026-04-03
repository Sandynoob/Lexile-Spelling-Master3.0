import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize, InterstitialAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID || 'ca-app-pub-9053893199466734/4831734476';
const INTERSTITIAL_ID = import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || 'ca-app-pub-9053893199466734/4448591090';

export const AdMobService = {
  async initialize() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await AdMob.initialize();
      console.log('AdMob initialized');
    } catch (error) {
      console.error('AdMob initialization failed', error);
    }
  },

  async showBanner() {
    if (!Capacitor.isNativePlatform()) return;

    const options: BannerAdOptions = {
      adId: BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: false, // Set to false for production
    };

    try {
      await AdMob.showBanner(options);
      console.log('Banner ad shown');
    } catch (error) {
      console.error('Banner ad failed to show', error);
    }
  },

  async hideBanner() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await AdMob.hideBanner();
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Banner ad failed to hide', error);
    }
  },

  async showInterstitial() {
    if (!Capacitor.isNativePlatform()) return;

    const options: InterstitialAdOptions = {
      adId: INTERSTITIAL_ID,
      isTesting: false, // Set to false for production
    };

    try {
      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown');
    } catch (error) {
      console.error('Interstitial ad failed to show', error);
    }
  }
};
