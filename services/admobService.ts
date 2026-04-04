import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const AdMobService = {
  // 正式广告 ID
  bannerAdId: 'ca-app-pub-9053893199466734/4831734476',
  interstitialAdId: 'ca-app-pub-9053893199466734/4448591090',

  async initialize() {
    try {
      console.log('AdMobService: Initializing...');
      if (Capacitor.isNativePlatform()) {
        await AdMob.initialize({
          testingDevices: [], // 生产环境请留空
          initializeForTesting: false, // 生产环境设为 false
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
        // 先隐藏再显示，确保位置更新
        await AdMob.hideBanner();
        
        const options: BannerAdOptions = {
          adId: this.bannerAdId,
          adSize: BannerAdSize.BANNER,
          position: position,
          margin: 0,
          isTesting: false, // 生产环境设为 false
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
