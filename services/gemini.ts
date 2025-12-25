
import { GoogleGenAI, Type } from "@google/genai";
import { Article, FAQ } from "../types";

const API_KEY = process.env.API_KEY || '';

export const generateHowToArticle = async (keyword: string): Promise<Article> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Write a comprehensive 800-word SEO-optimized 'How To' article for the Philippine audience. 
    The keyword is: "${keyword}".
    Requirements:
    - Informative, helpful tone.
    - Specific references to Philippine context (apps, locations, currencies).
    - Structured as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metaTitle: { type: Type.STRING, description: "Max 60 chars" },
          metaDescription: { type: Type.STRING, description: "Max 155 chars" },
          h1: { type: Type.STRING },
          content: { type: Type.STRING, description: "Full HTML content with H2, H3 tags" },
          faqs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["question", "answer"]
            }
          },
          category: { type: Type.STRING },
          internalLinkSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["metaTitle", "metaDescription", "h1", "content", "faqs", "category"]
      },
    },
  });

  const rawJson = JSON.parse(response.text);
  
  const slug = keyword.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    keyword,
    slug,
    metaTitle: rawJson.metaTitle,
    metaDescription: rawJson.metaDescription,
    h1: rawJson.h1,
    content: rawJson.content,
    faqs: rawJson.faqs,
    internalLinks: rawJson.internalLinkSuggestions || [],
    createdAt: new Date().toISOString(),
    author: "PinoyHowTo Editorial Team",
    category: rawJson.category,
    featuredImage: `https://picsum.photos/seed/${slug}/1200/630`,
  };
};

export const fetchTrendingKeywords = async (): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "List 5 trending 'how-to' long-tail keywords relevant to the Philippines today. Return as a JSON array of strings.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  
  return JSON.parse(response.text);
};
