# # Email Summarizer MCP Server

#Demo

[Demo](https://github.com/user-attachments/assets/ce672649-44e5-486a-a580-7cf0abe708e5)

A powerful Model Context Protocol (MCP) server that transforms email data into beautiful, AI-generated summary cards using Google Gemini.

## Features

🤖 **AI-Powered Summarization**: Uses Google Gemini to analyze and summarize email content
📧 **Beautiful UI Cards**: Generates responsive HTML cards with professional styling
🎯 **Smart Analysis**: Extracts key points, action items, sentiment, and priority
📊 **Comprehensive Insights**: Provides reading time, categorization, and attachment info
🎨 **Responsive Design**: Works perfectly on desktop and mobile devices

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) runtime
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone and navigate to the project:
```bash
cd mcp-ui-server
```

2. Install dependencies:
```bash
bun install
```

3. Start the server:
```bash
bun run index.ts
```

The server will be available at `http://localhost:3000/mcp`

## Usage

### MCP Tool: `summarize-email`

Analyzes email data and generates a beautiful summary card.

#### Input Schema

```typescript
{
  apiKey: string;           // Your Google Gemini API key
  email: {
    subject: string;        // Email subject line
    sender: string;         // Sender email address
    recipient: string;      // Recipient email address
    timestamp: string;      // Email timestamp (ISO format)
    body: string;          // Email content
    attachments?: string[]; // Optional: attachment names
    priority?: 'low' | 'normal' | 'high'; // Optional: priority level
    category?: string;      // Optional: email category
  }
}
```

#### Example Usage

```javascript
const emailData = {
  subject: "Quarterly Marketing Review & Strategy Update",
  sender: "sarah.johnson@company.com",
  recipient: "team@company.com",
  timestamp: "2024-10-05T14:30:00Z",
  body: "Hi Team, I hope you're all doing well...",
  attachments: ["Q3_Report.pdf", "Campaign_Brief.docx"],
  priority: "high",
  category: "work"
};

// Call the MCP tool
const result = await callMCPTool('summarize-email', {
  apiKey: 'your-gemini-api-key',
  email: emailData
});
```

#### Output

The tool returns a beautiful HTML card containing:

- **Email Metadata**: Subject, sender, timestamp, priority badge
- **AI Summary**: Concise 2-3 sentence overview
- **Key Points**: Bullet-pointed main topics (3-5 items)
- **Action Items**: Extracted tasks and deliverables
- **Smart Insights**: 
  - Sentiment analysis (positive/neutral/negative)
  - Category detection (work/personal/marketing/etc.)
  - Reading time estimation
  - Attachment count

### UI Features

- **Priority Badges**: Color-coded priority indicators
- **Sentiment Icons**: Visual sentiment representation
- **Category Tags**: Categorized with relevant emojis
- **Responsive Design**: Optimized for all screen sizes
- **Hover Effects**: Interactive animations
- **Professional Styling**: Clean, modern design

## Architecture

```
├── index.ts                 # Main MCP server
├── types/
│   └── email.ts            # TypeScript interfaces
├── services/
│   └── emailSummarizer.ts  # Gemini integration service
├── components/
│   └── emailCard.ts        # HTML card generator
└── example-usage.js        # Usage examples
```

## API Reference

### EmailSummarizerService

The core service that integrates with Google Gemini:

```typescript
class EmailSummarizerService {
  constructor(apiKey: string)
  async summarizeEmail(emailData: EmailData): Promise<EmailSummary>
}
```

### generateEmailCard

Generates beautiful HTML cards from email summaries:

```typescript
function generateEmailCard(emailSummary: EmailSummary): string
```

## Error Handling

The tool includes comprehensive error handling:

- **Invalid API Key**: Clear error message with troubleshooting tips
- **Gemini API Errors**: Graceful fallback with error details
- **Malformed Data**: Validation and helpful error messages
- **Network Issues**: Timeout and retry logic

## Development

### Running in Development

```bash
bun run index.ts
```

### Type Checking

The project uses TypeScript with strict type checking enabled.

### Testing

Use the provided `example-usage.js` file to test the functionality:

```bash
node example-usage.js
```

## Configuration

### Environment Variables

While not required, you can set these environment variables:

```bash
PORT=3000                    # Server port (default: 3000)
GEMINI_API_KEY=your-key     # Default API key (optional)
```

### Customization

#### Styling

Modify `components/emailCard.ts` to customize the HTML/CSS styling.

#### AI Prompts

Update the prompt in `services/emailSummarizer.ts` to adjust AI behavior.

#### Schema

Extend the email schema in `types/email.ts` for additional fields.

## Security

- API keys are never logged or stored
- Input validation prevents injection attacks
- Rate limiting recommended for production use
- CORS enabled for cross-origin requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the example usage file
- Review error messages in the HTML output
- Ensure your Gemini API key is valid and has quota

---

**Note**: This tool requires a valid Google Gemini API key. The API key is only used for the current request and is not stored or logged.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
