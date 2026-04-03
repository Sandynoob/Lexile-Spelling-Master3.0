import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const AdMobService = {
  // Google 官方测试广告 ID
  bannerAdId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialAdId: 'ca-app-pub-3940256099942544/1033173712',

  async initialize() {
    try {
      if (Capacitor.isNativePlatform()) {
        await AdMob.initialize({
          testingDevices: [], // 生产环境请留空
          initializeForTesting: true,
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
          isTesting: true,
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
          isTesting: true,
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
