import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const AdMobService = {
  // 正式广告 ID
  bannerAdId: 'ca-app-pub-9053893199466734/4831734476',
  interstitialAdId: 'ca-app-pub-9053893199466734/4448591090',

  isInitialized: false,
  initPromise: null as Promise<void> | null,

  async initialize() {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = (async () => {
      try {
        console.log('AdMobService: Initializing...');
        if (Capacitor.isNativePlatform()) {
          await AdMob.initialize({
            testingDevices: [],
            initializeForTesting: false,
          });
          this.isInitialized = true;
          console.log('AdMobService: Initialized successfully');
        }
      } catch (error) {
        console.error('AdMobService: Initialization failed', error);
      }
    })();
    
    return this.initPromise;
  },

  currentPosition: null as BannerAdPosition | null,

  async showBanner(position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER) {
    try {
      // 确保初始化完成
      await this.initialize();
      
      if (!this.isInitialized && Capacitor.isNativePlatform()) {
        console.warn('AdMobService: Cannot show banner, initialization failed');
        return;
      }

      // 增加一个极小的延时，确保 SDK 状态稳定
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(`AdMobService: Attempting to show banner at ${position}...`);
      if (Capacitor.isNativePlatform()) {
        const options: BannerAdOptions = {
          adId: this.bannerAdId,
          adSize: BannerAdSize.BANNER,
          position: position,
          margin: 0,
          isTesting: false,
        };
        await AdMob.showBanner(options);
        this.currentPosition = position;
        console.log('AdMobService: Banner shown successfully');
      } else {
        console.log('AdMobService: Not a native platform, skipping banner');
      }
    } catch (error) {
      console.error('AdMobService: Show banner failed', error);
      this.currentPosition = null;
    }
  },

  async hideBanner() {
    try {
      if (Capacitor.isNativePlatform()) {
        await AdMob.hideBanner();
        this.currentPosition = null;
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
