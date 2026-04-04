import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const AdMobService = {
  // Google 官方测试广告 ID
  bannerAdId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialAdId: 'ca-app-pub-3940256099942544/1033173712',

  async initialize() {
    try {
      console.log('AdMobService: Initializing...');
      if (Capacitor.isNativePlatform()) {
        await AdMob.initialize({
          testingDevices: [], // 生产环境请留空
          initializeForTesting: true,
        });
        console.log('AdMobService: Initialized successfully');
      } else {
        console.log('AdMobService: Not a native platform, skipping initialization');
      }
    } catch (error) {
      console.error('AdMobService: Initialization failed', error);
    }
  },

  async showBanner(position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER) {
    try {
      console.log(`AdMobService: Attempting to show banner at ${position}...`);
      if (Capacitor.isNativePlatform()) {
        const options: BannerAdOptions = {
          adId: this.bannerAdId,
          adSize: BannerAdSize.BANNER,
          position: position,
          margin: 0,
          isTesting: true,
        };
        await AdMob.showBanner(options);
        console.log('AdMobService: Banner shown successfully');
      } else {
        console.log('AdMobService: Not a native platform, skipping banner');
      }
    } catch (error) {
      console.error('AdMobService: Show banner failed', error);
    }
  },

  async hideBanner() {
    try {
      if (Capacitor.isNativePlatform()) {
        await AdMob.hideBanner();
        console.log('AdMobService: Banner hidden');
      }
    } catch (error) {
      console.error('AdMobService: Hide banner failed', error);
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
