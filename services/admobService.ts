import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const AdMobService = {
  // 广告 ID
  bannerAdId: Capacitor.getPlatform() === 'android' ? 'ca-app-pub-9053893199466734/4831734476' : 'test',
  interstitialAdId: Capacitor.getPlatform() === 'android' ? 'ca-app-pub-9053893199466734/4448591090' : 'test',

  async initialize() {
    try {
      if (Capacitor.isNativePlatform()) {
        await AdMob.initialize({
          testingDevices: [], // 生产环境请留空
          initializeForTesting: false,
        });
        console.log('AdMob initialized');
      }
    } catch (error) {
      console.error('AdMob initialization failed', error);
    }
  },

  async showBanner() {
    try {
      if (Capacitor.isNativePlatform()) {
        const options: BannerAdOptions = {
          adId: this.bannerAdId,
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: false,
        };
        await AdMob.showBanner(options);
      }
    } catch (error) {
      console.error('Show banner failed', error);
    }
  },

  async hideBanner() {
    try {
      if (Capacitor.isNativePlatform()) {
        await AdMob.hideBanner();
      }
    } catch (error) {
      console.error('Hide banner failed', error);
    }
  },

  async prepareInterstitial() {
    try {
      if (Capacitor.isNativePlatform()) {
        await AdMob.prepareInterstitial({
          adId: this.interstitialAdId,
          isTesting: false,
        });
      }
    } catch (error) {
      console.error('Prepare interstitial failed', error);
    }
  },

  async showInterstitial() {
    try {
      if (Capacitor.isNativePlatform()) {
        await AdMob.showInterstitial();
      }
    } catch (error) {
      console.error('Show interstitial failed', error);
    }
  }
};
