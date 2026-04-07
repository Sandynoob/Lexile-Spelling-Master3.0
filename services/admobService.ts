import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const AdMobService = {
  // 官方测试 ID (用于调试)
  bannerAdId: 'ca-app-pub-3940256099942544/6300978111',
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
  isBannerVisible: false,
  isProcessing: false,

  async showBanner(position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER) {
    if (this.isProcessing) {
      console.log('AdMobService: Already processing an ad request, skipping');
      return;
    }

    try {
      this.isProcessing = true;
      
      // 确保初始化完成
      await this.initialize();
      
      if (!this.isInitialized && Capacitor.isNativePlatform()) {
        console.warn('AdMobService: Cannot show banner, initialization failed');
        this.isProcessing = false;
        return;
      }

      // 如果广告已经在该位置显示，则跳过
      if (this.isBannerVisible && this.currentPosition === position) {
        console.log('AdMobService: Banner already visible at this position');
        this.isProcessing = false;
        return;
      }

      console.log(`AdMobService: Showing banner at ${position}...`);
      if (Capacitor.isNativePlatform()) {
        // 如果当前有广告在别处显示，先隐藏
        if (this.isBannerVisible) {
          await AdMob.hideBanner();
        }

        const options: BannerAdOptions = {
          adId: this.bannerAdId,
          adSize: BannerAdSize.BANNER,
          position: position,
          margin: 0,
          isTesting: true, // 调试阶段强制开启测试模式
        };
        
        await AdMob.showBanner(options);
        this.isBannerVisible = true;
        this.currentPosition = position;
        console.log('AdMobService: Banner shown successfully');
      }
    } catch (error) {
      console.error('AdMobService: Show banner failed', error);
      this.isBannerVisible = false;
      this.currentPosition = null;
    } finally {
      this.isProcessing = false;
    }
  },

  async hideBanner() {
    if (this.isProcessing) return;
    if (!this.isBannerVisible) return; // 如果已经隐藏，则不再调用

    try {
      this.isProcessing = true;
      if (Capacitor.isNativePlatform()) {
        await AdMob.hideBanner();
        this.isBannerVisible = false;
        this.currentPosition = null;
        console.log('AdMobService: Banner hidden');
      }
    } catch (error) {
      console.error('AdMobService: Hide banner failed', error);
    } finally {
      this.isProcessing = false;
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
