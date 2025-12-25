
export interface Article {
  id: string;
  keyword: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  content: string; // Markdown or HTML
  faqs: FAQ[];
  internalLinks: string[];
  createdAt: string;
  author: string;
  category: string;
  featuredImage: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface AutomationTask {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  keyword: string;
  logs: string[];
  timestamp: string;
}

export interface AffiliateLink {
  keyword: string;
  url: string;
}
