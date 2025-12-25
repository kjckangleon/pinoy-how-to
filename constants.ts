
import { AffiliateLink } from './types';

export const AFFILIATE_LINKS: AffiliateLink[] = [
  { keyword: 'Lazada', url: 'https://c.lazada.com.ph/t/c.your-id' },
  { keyword: 'Shopee', url: 'https://shope.ee/your-id' },
  { keyword: 'smartphone', url: 'https://shope.ee/best-phones' },
  { keyword: 'laptop', url: 'https://shope.ee/best-laptops' },
  { keyword: 'air fryer', url: 'https://shope.ee/best-air-fryers' },
  { keyword: 'GCash', url: 'https://www.gcash.com/referral' },
];

export const CATEGORIES = [
  'Tech & Gadgets',
  'Finance & GCash',
  'Cooking & Recipes',
  'Government Services',
  'Lifestyle',
  'Business Tools'
];

export const ADS_SLOTS = {
  BEFORE_CONTENT: '<div class="my-8 p-4 bg-gray-100 text-center rounded border border-dashed border-gray-400">Ad Space: Above Content</div>',
  AFTER_H2: '<div class="my-8 p-4 bg-gray-100 text-center rounded border border-dashed border-gray-400">Ad Space: In-Article Ad</div>',
  AFTER_CONTENT: '<div class="my-8 p-4 bg-gray-100 text-center rounded border border-dashed border-gray-400">Ad Space: Bottom Ad</div>',
};

export const MOCK_KEYWORDS = [
  "How to register GCash with National ID",
  "How to cook Adobo with Sprite",
  "How to renew NBI clearance online 2024",
  "How to apply for Pag-IBIG housing loan",
  "How to get a passport in the Philippines",
  "How to start a sari-sari store business",
];
