export interface EmailData {
  subject: string;
  sender: string;
  body: string;
}

export interface EmailSummary {
  id: string;
  subject: string;
  sender: string;
  summary: string;
  keyPoints: string[];
  sentiment: "positive" | "neutral" | "negative";
  actionItems: string[];
  category: string;
  estimatedReadTime: string;
}

export interface GeminiResponse {
  summary: string;
  keyPoints: string[];
  sentiment: "positive" | "neutral" | "negative";
  actionItems: string[];
  category: string;
  estimatedReadTime: string;
}
