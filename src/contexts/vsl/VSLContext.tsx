import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { VSLConfig, Comment, ColorConfig } from '@/types/vsl';

export const defaultColors: ColorConfig = {
  gradientStart: '#f5d0e0',
  gradientEnd: '#e8d5f0',
  urgencyBg: '#ff4d8f',
  urgencyText: '#ffffff',
  headlineColor: '#1a1a2e',
  subheadlineColor: '#ff6b35',
  liveBadgeBg: '#ef4444',
  liveBadgeText: '#ffffff',
  footerBg: '#1a1a2e',
  footerText: '#ffffff',
  commentBg: '#ffffff',
  commentText: '#374151',
  commentNameColor: '#1f2937',
  facebookBlue: '#1877f2',
};

const defaultComments: Comment[] = [
  {
    id: '1', name: 'Rachel Evans', avatar: 'https://i.pravatar.cc/100?img=1',
    text: 'The Pink Salt Trick gave me my life back. I lost 30 pounds in 6 weeks, and my friends keep asking what I\'m doing differently. I feel confident and energized for my kids\' events now!',
    likes: 159, time: '1 h',
  },
  {
    id: '2', name: 'Ava', avatar: 'https://i.pravatar.cc/100?img=5',
    text: 'This is hands-down the best thing I\'ve done for myself. The Pink Salt Trick helped me lose 27 pounds in 5 weeks, and I\'m not starving or exhausted. I feel like ME again!',
    likes: 129, time: '3 h',
    replies: [{
      id: '2-1', name: 'Nicole J.', avatar: 'https://i.pravatar.cc/100?img=9',
      text: 'Ava, I\'m with you! Dropped 17 pounds and my energy is back. I can\'t stop raving about this trick!',
      likes: 77, time: '3 h',
    }]
  },
  {
    id: '3', name: 'Sophia Mendes', avatar: 'https://i.pravatar.cc/100?img=16',
    text: 'I never thought I\'d fit into my favorite jeans again, but the Pink Salt Trick made it happen. Down 21 pounds in a month, and my husband can\'t stop complimenting me. So grateful!',
    likes: 88, time: '5 h',
  },
  {
    id: '4', name: 'Grace', avatar: 'https://i.pravatar.cc/100?img=20',
    text: 'The Pink Salt Trick is a miracle! I lost 24 pounds in 40 days without changing my diet. My joint pain is gone, and I feel confident at work meetings now. Highly recommend!',
    likes: 202, time: '7 h',
  },
  {
    id: '5', name: 'Melissa Turner', avatar: 'https://i.pravatar.cc/100?img=23',
    text: 'I was about to give up on losing weight, but the Pink Salt Trick changed everything. Dropped 23 pounds in 5 weeks, and I\'m loving how I look in photos again. It\'s so easy and effective!',
    likes: 138, time: '10 h',
  },
  {
    id: '6', name: 'Michelle Grant', avatar: 'https://i.pravatar.cc/100?img=25',
    text: 'This is the easiest thing I\'ve ever done for my health. Lost 23 pounds in a month with the Pink Salt Trick, and I\'m not bloated anymore. I feel like myself again!',
    likes: 253, time: '11 h',
  },
];

export const defaultConfig: VSLConfig = {
  urgencyText: 'Attention:',
  urgencyDatePrefix: 'This Presentation Will Only Be Available Until The End Of',
  headline: 'CELEBRITY TRICKS REVEALED:',
  subheadline: '"PINK SALT" TO WEIGHT LOSS',
  vturbEmbedCode: '',
  comments: defaultComments,
  viewerCount: 985,
  liveBadgeText1: 'people are',
  liveBadgeText2: 'watching this video',
  liveBadgeText3: 'Live now',
  footerText: 'Copyright 2025 © Quality Life & Healthy. All Rights Reserved.',
  footerCountry: 'EUA',
  colors: defaultColors,
};

interface VSLContextType {
  config: VSLConfig;
  updateConfig: (updates: Partial<VSLConfig>) => void;
  updateComment: (id: string, updates: Partial<Comment>) => void;
  addComment: (comment: Comment) => void;
  removeComment: (id: string) => void;
  addReply: (commentId: string, reply: Comment) => void;
  updateReply: (commentId: string, replyId: string, updates: Partial<Comment>) => void;
  removeReply: (commentId: string, replyId: string) => void;
  updateColors: (updates: Partial<ColorConfig>) => void;
  resetColors: () => void;
}

const VSLContext = createContext<VSLContextType | undefined>(undefined);

function migrateConfig(saved: any): VSLConfig {
  if (saved.urgencyDate && !saved.urgencyDatePrefix) {
    saved.urgencyDatePrefix = defaultConfig.urgencyDatePrefix;
    delete saved.urgencyDate;
  }
  return { ...defaultConfig, ...saved, colors: { ...defaultColors, ...(saved.colors || {}) } };
}

export function VSLProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<VSLConfig>(() => {
    const saved = localStorage.getItem('vsl-config');
    if (saved) {
      try { return migrateConfig(JSON.parse(saved)); } catch { return defaultConfig; }
    }
    return defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem('vsl-config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (updates: Partial<VSLConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateComment = (id: string, updates: Partial<Comment>) => {
    setConfig(prev => ({
      ...prev,
      comments: prev.comments.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  };

  const addComment = (comment: Comment) => {
    setConfig(prev => ({ ...prev, comments: [...prev.comments, comment] }));
  };

  const removeComment = (id: string) => {
    setConfig(prev => ({ ...prev, comments: prev.comments.filter(c => c.id !== id) }));
  };

  const addReply = (commentId: string, reply: Comment) => {
    setConfig(prev => ({
      ...prev,
      comments: prev.comments.map(c =>
        c.id === commentId ? { ...c, replies: [...(c.replies || []), reply] } : c
      ),
    }));
  };

  const updateReply = (commentId: string, replyId: string, updates: Partial<Comment>) => {
    setConfig(prev => ({
      ...prev,
      comments: prev.comments.map(c =>
        c.id === commentId
          ? { ...c, replies: (c.replies || []).map(r => r.id === replyId ? { ...r, ...updates } : r) }
          : c
      ),
    }));
  };

  const removeReply = (commentId: string, replyId: string) => {
    setConfig(prev => ({
      ...prev,
      comments: prev.comments.map(c =>
        c.id === commentId
          ? { ...c, replies: (c.replies || []).filter(r => r.id !== replyId) }
          : c
      ),
    }));
  };

  const updateColors = (updates: Partial<ColorConfig>) => {
    setConfig(prev => ({ ...prev, colors: { ...prev.colors, ...updates } }));
  };

  const resetColors = () => {
    setConfig(prev => ({ ...prev, colors: defaultColors }));
  };

  return (
    <VSLContext.Provider value={{ config, updateConfig, updateComment, addComment, removeComment, addReply, updateReply, removeReply, updateColors, resetColors }}>
      {children}
    </VSLContext.Provider>
  );
}

export function useVSL() {
  const context = useContext(VSLContext);
  if (!context) throw new Error('useVSL must be used within a VSLProvider');
  return context;
}
