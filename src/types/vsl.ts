export interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
  replies?: Comment[];
}

export interface ColorConfig {
  gradientStart: string;
  gradientEnd: string;
  urgencyBg: string;
  urgencyText: string;
  headlineColor: string;
  subheadlineColor: string;
  liveBadgeBg: string;
  liveBadgeText: string;
  footerBg: string;
  footerText: string;
  commentBg: string;
  commentText: string;
  commentNameColor: string;
  facebookBlue: string;
}

export interface VSLConfig {
  urgencyText: string;
  urgencyDatePrefix: string;
  headline: string;
  subheadline: string;
  vturbEmbedCode: string;
  comments: Comment[];
  viewerCount: number;
  liveBadgeText1: string;
  liveBadgeText2: string;
  liveBadgeText3: string;
  footerText: string;
  footerCountry: string;
  colors: ColorConfig;
}
