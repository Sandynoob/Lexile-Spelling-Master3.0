import { registerPlugin } from '@capacitor/core';

export enum BannerAdSize {
  BANNER = 'BANNER',
  FULL_BANNER = 'FULL_BANNER',
  LARGE_BANNER = 'LARGE_BANNER',
  MEDIUM_RECTANGLE = 'MEDIUM_RECTANGLE',
  LEADERBOARD = 'LEADERBOARD',
  ADAPTIVE_BANNER = 'ADAPTIVE_BANNER',
}

export enum BannerAdPosition {
  TOP_CENTER = 'TOP_CENTER',
  CENTER = 'CENTER',
  BOTTOM_CENTER = 'BOTTOM_CENTER',
}

export interface BannerAdOptions {
  adId: string;
  adSize?: BannerAdSize;
  position?: BannerAdPosition;
  margin?: number;
  isTesting?: boolean;
}

export interface AdOptions {
  adId: string;
  isTesting?: boolean;
}

export const AdMob = registerPlugin<any>('AdMob');
