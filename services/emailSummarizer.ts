import type {
  EmailData,
  EmailSummary,
  GeminiResponse,
} from "../types/email.js";
import { randomUUID } from "crypto";
import { GoogleGenAI } from "@google/genai";

export class EmailSummarizerService {
  genAI: GoogleGenAI;
  private model: string;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({
      apiKey: apiKey,
    });
    this.model = "gemini-2.5-pro";
  }

  async summarizeEmail(emailData: EmailData): Promise<EmailSummary> {
    const prompt = this.createPrompt(emailData);

    try {
      const response = await this.genAI.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
      });
      const text = response.text ?? "";

      console.log("Raw Gemini Response:", text);

      const geminiResponse = this.parseGeminiResponse(text);
      console.log("Parsed Gemini Response:", geminiResponse);

      return {
        id: randomUUID(),
        subject: emailData.subject,
        sender: emailData.sender,
        summary: geminiResponse.summary,
        keyPoints: geminiResponse.keyPoints,
        sentiment: geminiResponse.sentiment,
        actionItems: geminiResponse.actionItems,
        category: geminiResponse.category,
        estimatedReadTime: geminiResponse.estimatedReadTime,
      };
    } catch (error) {
      console.error("Error summarizing email:", error);
      throw new Error("Failed to summarize email with Gemini");
    }
  }

  private createPrompt(emailData: EmailData): string {
    return `
Analyze the following email and provide a structured summary in JSON format:

Subject: ${emailData.subject}
From: ${emailData.sender}
Email Body:
${emailData.body}

Please provide your response in the following JSON format only (no additional text):
{
  "summary": "A concise 2-3 sentence summary of the email content",
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "sentiment": "positive|neutral|negative",
  "actionItems": ["action item 1", "action item 2"],
  "category": "work|personal|marketing|support|notification|other",
  "estimatedReadTime": "X min read"
}

Focus on:
- Creating a clear, concise summary
- Identifying 3-5 key points maximum
- Detecting the overall sentiment
- Extracting actionable items (if any)
- Categorizing the email type
- Estimating reading time based on content length
`;
  }

  private parseGeminiResponse(text: string): GeminiResponse {
    try {
      // Remove any markdown formatting or extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      return {
        summary: parsed.summary || "Summary not available",
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        sentiment: ["positive", "neutral", "negative"].includes(
          parsed.sentiment
        )
          ? parsed.sentiment
          : "neutral",
        actionItems: Array.isArray(parsed.actionItems)
          ? parsed.actionItems
          : [],
        category: parsed.category || "other",
        estimatedReadTime: parsed.estimatedReadTime || "1 min read",
      };
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      // Return fallback response
      return {
        summary: "Unable to generate summary",
        keyPoints: [],
        sentiment: "neutral",
        actionItems: [],
        category: "other",
        estimatedReadTime: "1 min read",
      };
    }
  }

  private determinePriority(
    geminiResponse: GeminiResponse
  ): "low" | "normal" | "high" {
    const hasActionItems = geminiResponse.actionItems.length > 0;
    const isUrgent =
      geminiResponse.summary.toLowerCase().includes("urgent") ||
      geminiResponse.summary.toLowerCase().includes("asap") ||
      geminiResponse.summary.toLowerCase().includes("immediately");

    if (isUrgent || hasActionItems) {
      return "high";
    }

    return "normal";
  }
}
