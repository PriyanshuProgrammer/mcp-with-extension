import express from "express";
import cors from "cors";
import z from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createUIResource } from "@mcp-ui/server";
import { randomUUID } from "crypto";
import { EmailSummarizerService } from "./services/emailSummarizer.js";
import { generateEmailCard } from "./components/emailCard.js";
import type { EmailData } from "./types/email.js";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id"],
    allowedHeaders: ["Content-Type", "mcp-session-id"],
  })
);
app.use(express.json());

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication.
app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // A session already exists; reuse the existing transport.
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // This is a new initialization request. Create a new transport.
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        transports[sid] = transport;
        console.log(`MCP Session initialized: ${sid}`);
      },
    });

    // Clean up the transport from our map when the session closes.
    transport.onclose = () => {
      if (transport.sessionId) {
        console.log(`MCP Session closed: ${transport.sessionId}`);
        delete transports[transport.sessionId];
      }
    };

    // Create a new server instance for this specific session.
    const server = new McpServer({
      name: "email-summarizer-server",
      version: "1.0.0",
    });

    // Register email summarization tool
    server.registerTool(
      "summarize-email",
      {
        title: "Email Summarizer",
        description:
          "Summarize email content using Google Gemini AI and display as a beautiful card",
        inputSchema: {
          apiKey: z.string(),
          email: z.object({
            subject: z.string(),
            sender: z.string(),
            body: z.string(),
          }),
        },
      },
      async ({ apiKey, email }) => {
        try {
          console.log("hello world");
          // Validate API key
          if (
            !apiKey ||
            typeof apiKey !== "string" ||
            apiKey.trim().length === 0
          ) {
            throw new Error("Valid Google Gemini API key is required");
          }

          // Create email summarizer service
          const emailSummarizer = new EmailSummarizerService(apiKey);

          // Generate summary
          const emailSummary = await emailSummarizer.summarizeEmail(email);

          // Generate beautiful HTML card
          const htmlCard = generateEmailCard(emailSummary);

          // Create data URL for the HTML content
          const dataUrl = `data:text/html;base64,${Buffer.from(
            htmlCard
          ).toString("base64")}`;

          // Create UI resource
          const uiResource = createUIResource({
            uri: `ui://email-summary-${emailSummary.id}`,
            content: {
              type: "externalUrl",
              iframeUrl: dataUrl,
            },
            encoding: "text",
          });

          return {
            content: [uiResource],
          };
        } catch (error) {
          console.error("Error in email summarization:", error);

          // Create error card
          const errorHtml = `
					<!DOCTYPE html>
					<html>
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>Error</title>
						<style>
							body { 
								font-family: Arial, sans-serif; 
								padding: 20px; 
								background: #fee;
								color: #c53030;
							}
							.error-card {
								background: white;
								padding: 20px;
								border-radius: 8px;
								border-left: 4px solid #e53e3e;
								box-shadow: 0 2px 4px rgba(0,0,0,0.1);
							}
							h1 { margin: 0 0 10px 0; }
							p { margin: 0; }
						</style>
					</head>
					<body>
						<div class="error-card">
							<h1>❌ Email Summarization Failed</h1>
							<p><strong>Error:</strong> ${
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred"
              }</p>
							<p><strong>Tip:</strong> Make sure your Google Gemini API key is valid and you have sufficient quota.</p>
						</div>
					</body>
					</html>
				`;

          const errorDataUrl = `data:text/html;base64,${Buffer.from(
            errorHtml
          ).toString("base64")}`;

          const errorResource = createUIResource({
            uri: `ui://email-error-${randomUUID()}`,
            content: {
              type: "externalUrl",
              iframeUrl: errorDataUrl,
            },
            encoding: "text",
          });

          return {
            content: [errorResource],
          };
        }
      }
    );

    // Register our original greet tool
    server.registerTool(
      "greet",
      {
        title: "Greet",
        description: "A simple tool that returns a UI resource.",
        inputSchema: {
          name: z.string(),
          age: z.number(),
        },
      },
      async ({ name, age }) => {
        // Create the UI resource to be returned to the client (this is the only part specific to MCP-UI)
        const uiResource = createUIResource({
          uri: "ui://greeting",
          content: {
            type: "externalUrl",
            iframeUrl: "https://landingpage-two-rouge.vercel.app/",
          },
          encoding: "text",
        });

        return {
          content: [uiResource],
        };
      }
    );

    // Connect the server instance to the transport for this session.
    await server.connect(transport);
  } else {
    return res.status(400).json({
      error: { message: "Bad Request: No valid session ID provided" },
    });
  }

  // Handle the client's request using the session's transport.
  await transport.handleRequest(req, res, req.body);
});

// A separate, reusable handler for GET and DELETE requests.
const handleSessionRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    return res.status(404).send("Session not found");
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// GET handles the long-lived stream for server-to-client messages.
app.get("/mcp", handleSessionRequest);

// DELETE handles explicit session termination from the client.
app.delete("/mcp", handleSessionRequest);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log(`MCP endpoint available at http://localhost:${port}/mcp`);
});
