import { AdMob, BannerAdPosition, BannerAdSize, AdMobBannerSize } from '@capacitor-community/admob';

/**
 * 初始化 AdMob 插件
 */
export async function initializeAdMob(): Promise<void> {
  await AdMob.initialize();
}

/**
 * 顯示橫幅廣告 (Banner)
 * 使用你的橫幅 ID: ca-app-pub-9053893199466734/4831734476
 */
export async function showBanner(): Promise<void> {
  const options = {
    adId: 'ca-app-pub-9053893199466734/4831734476',
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    // npa: true, // 如果需要符合 GDPR (非個人化廣告) 可開啟
  };
  await AdMob.showBanner(options);
}

/**
 * 準備並顯示插屏廣告 (Interstitial)
 * 使用你的插屏 ID: ca-app-pub-9053893199466734/4448591090
 */
export async function showInterstitial(): Promise<void> {
  await AdMob.prepareInterstitial({
    adId: 'ca-app-pub-9053893199466734/4448591090',
  });
  await AdMob.showInterstitial();
}

/**
 * 隱藏橫幅廣告
 */
export async function hideBanner(): Promise<void> {
  await AdMob.hideBanner();
}
