
import { Article, AffiliateLink } from "../types";
import { AFFILIATE_LINKS, ADS_SLOTS } from "../constants";

export const injectAffiliateLinks = (content: string, links: AffiliateLink[]): string => {
  let processed = content;
  links.forEach(link => {
    // Regex to replace keywords with anchor tags, avoiding replacing if already in a tag
    const regex = new RegExp(`(?<!<[^>]*)${link.keyword}(?![^<]*>)`, 'gi');
    processed = processed.replace(regex, `<a href="${link.url}" class="text-blue-600 underline font-semibold" target="_blank" rel="nofollow sponsored">${link.keyword}</a>`);
  });
  return processed;
};

export const injectAds = (content: string): string => {
  const paragraphs = content.split('</p>');
  if (paragraphs.length < 3) return content;
  
  // Inject ad after the second paragraph
  paragraphs.splice(2, 0, ADS_SLOTS.AFTER_H2);
  
  return ADS_SLOTS.BEFORE_CONTENT + paragraphs.join('</p>') + ADS_SLOTS.AFTER_CONTENT;
};

// Simulation of a database or CMS
const STORAGE_KEY = 'pinoyhowto_articles';

export const saveArticle = (article: Article) => {
  const existing = getArticles();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([article, ...existing]));
};

export const getArticles = (): Article[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  return getArticles().find(a => a.slug === slug);
};
