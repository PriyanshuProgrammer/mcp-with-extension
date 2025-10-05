// Email Summarizer MCP Tool Test Example
// This example shows how to use the email summarization tool

// Sample email data to test with
const sampleEmail = {
  subject: "Quarterly Marketing Review & Strategy Update",
  sender: "sarah.johnson@company.com",
  recipient: "team@company.com",
  timestamp: "2024-10-05T14:30:00Z",
  body: `Hi Team,

I hope you're all doing well. I wanted to share some updates from our quarterly marketing review and discuss our strategy moving forward.

Key highlights from Q3:
- We exceeded our lead generation targets by 25%
- Social media engagement increased by 40% compared to Q2
- Our new content marketing campaign drove 15% more website traffic
- Email campaign open rates improved to 28% (industry average is 21%)

Moving into Q4, we need to focus on:
1. Launching the holiday campaign by November 1st
2. Implementing the new CRM system integration
3. Preparing for the product launch in December
4. Optimizing our SEO strategy for 2025

Action items:
- Marketing team: Please review the attached campaign briefs by Friday
- Design team: We need updated creative assets for the holiday campaign
- Analytics team: Set up tracking for the new campaigns
- Everyone: Block your calendars for the strategy workshop on October 15th

Please come prepared with your Q4 goals and any concerns you might have. We'll also be discussing budget allocations for next quarter.

Looking forward to a productive discussion!

Best regards,
Sarah Johnson
Marketing Director`,
  attachments: ["Q3_Marketing_Report.pdf", "Holiday_Campaign_Brief.docx", "Budget_Allocation_2025.xlsx"],
  priority: "high",
  category: "work"
};

// Example of how to call the MCP tool
const exampleUsage = {
  tool: "summarize-email",
  parameters: {
    apiKey: "YOUR_GOOGLE_GEMINI_API_KEY_HERE", // Replace with your actual API key
    email: sampleEmail
  }
};

console.log("Email Summarizer MCP Tool Example");
console.log("=================================");
console.log("");
console.log("Sample email data:");
console.log(JSON.stringify(sampleEmail, null, 2));
console.log("");
console.log("Tool call example:");
console.log(JSON.stringify(exampleUsage, null, 2));
console.log("");
console.log("Instructions:");
console.log("1. Start the MCP server: bun run index.ts");
console.log("2. Server will be available at: http://localhost:3000/mcp");
console.log("3. Use an MCP client to call the 'summarize-email' tool");
console.log("4. Pass your Google Gemini API key and email data");
console.log("5. Receive a beautiful HTML card with the email summary");
console.log("");
console.log("Expected output:");
console.log("- Concise email summary");
console.log("- Key points extraction");
console.log("- Action items identification");
console.log("- Sentiment analysis");
console.log("- Priority and category detection");
console.log("- Beautiful responsive HTML card display");

export { sampleEmail, exampleUsage };