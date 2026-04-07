import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const AdMobService = {
  // 正式广告 ID
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
        // 如果当前有广告在显示，先彻底移除
        if (this.isBannerVisible) {
          await AdMob.removeBanner();
        }

        const options: BannerAdOptions = {
          adId: this.bannerAdId,
          adSize: BannerAdSize.BANNER,
          position: position,
          margin: 0,
          isTesting: false,
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
    // 注意：这里不再检查 isBannerVisible，而是强制尝试移除，确保彻底干净
    
    try {
      this.isProcessing = true;
      if (Capacitor.isNativePlatform()) {
        // 使用 removeBanner 彻底销毁视图，而不是隐藏
        await AdMob.removeBanner();
        this.isBannerVisible = false;
        this.currentPosition = null;
        console.log('AdMobService: Banner removed (destroyed)');
      }
    } catch (error) {
      // 如果移除失败（例如本来就没有广告），静默处理
      console.log('AdMobService: No banner to remove or remove failed');
      this.isBannerVisible = false;
      this.currentPosition = null;
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
