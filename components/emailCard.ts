import type { EmailSummary } from "../types/email.js";

export function generateEmailCard(emailSummary: EmailSummary): string {
  const sentimentIcon = {
    positive: "😊",
    neutral: "😐",
    negative: "😔",
  }[emailSummary.sentiment];

  const categoryIcon =
    {
      work: "💼",
      personal: "👤",
      marketing: "📢",
      support: "🎧",
      notification: "🔔",
      other: "📧",
    }[emailSummary.category] || "📧";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Summary Card</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .email-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        
        .email-card:hover {
            transform: translateY(-5px);
        }
        
        .card-header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 24px;
            position: relative;
        }
        
        .priority-badge {
            position: absolute;
            top: 16px;
            right: 16px;
            background: blue;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .subject {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
            line-height: 1.3;
        }
        
        .meta-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            opacity: 0.9;
        }
        
        .sender-info {
            font-size: 14px;
        }
        
        .timestamp {
            font-size: 12px;
            opacity: 0.8;
        }
        
        .card-body {
            padding: 24px;
        }
        
        .summary-section {
            margin-bottom: 24px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .summary-text {
            font-size: 14px;
            line-height: 1.6;
            color: #6b7280;
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #6366f1;
        }
        
        .key-points {
            list-style: none;
            margin-bottom: 24px;
        }
        
        .key-point {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 14px;
            color: #374151;
        }
        
        .key-point::before {
            content: "•";
            color: #6366f1;
            font-weight: bold;
            font-size: 16px;
        }
        
        .action-items {
            margin-bottom: 24px;
        }
        
        .action-item {
            background: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 6px;
            padding: 8px 12px;
            margin-bottom: 8px;
            font-size: 13px;
            color: #92400e;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .action-item::before {
            content: "⚡";
        }
        
        .card-footer {
            background: #f9fafb;
            padding: 16px 24px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .footer-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: #6b7280;
        }
        
        .category-tag {
            background: #e0e7ff;
            color: #3730a3;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .sentiment-indicator {
            font-size: 16px;
        }
        
        .no-action-items {
            color: #9ca3af;
            font-style: italic;
            text-align: center;
            padding: 16px;
            font-size: 14px;
        }
        
        @media (max-width: 640px) {
            .card-header {
                padding: 20px;
            }
            
            .card-body {
                padding: 20px;
            }
            
            .meta-info {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .card-footer {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    </style>
</head>
<body>
    <div class="email-card">
        <div class="card-header">
            <h1 class="subject">${escapeHtml(emailSummary.subject)}</h1>
            <div class="meta-info">
                <div class="sender-info">
                    <strong>From:</strong> ${escapeHtml(emailSummary.sender)}
                </div>
            </div>
        </div>
        
        <div class="card-body">
            <div class="summary-section">
                <h2 class="section-title">
                    📝 Summary
                </h2>
                <div class="summary-text">
                    ${escapeHtml(emailSummary.summary)}
                </div>
            </div>
            
            ${
              emailSummary.keyPoints.length > 0
                ? `
            <div class="summary-section">
                <h2 class="section-title">
                    🔑 Key Points
                </h2>
                <ul class="key-points">
                    ${emailSummary.keyPoints
                      .map(
                        (point) => `
                        <li class="key-point">${escapeHtml(point)}</li>
                    `
                      )
                      .join("")}
                </ul>
            </div>
            `
                : ""
            }
            
            <div class="action-items">
                <h2 class="section-title">
                    ⚡ Action Items
                </h2>
                ${
                  emailSummary.actionItems.length > 0
                    ? emailSummary.actionItems
                        .map(
                          (item) => `
                        <div class="action-item">${escapeHtml(item)}</div>
                    `
                        )
                        .join("")
                    : '<div class="no-action-items">No action items found</div>'
                }
            </div>
        </div>
        
        <div class="card-footer">
            <div class="footer-item">
                <span class="category-tag">
                    ${categoryIcon} ${emailSummary.category}
                </span>
            </div>
            <div class="footer-item">
                <span class="sentiment-indicator">${sentimentIcon}</span>
                ${emailSummary.sentiment} sentiment
            </div>
            <div class="footer-item">
                📖 ${emailSummary.estimatedReadTime}
            </div>
        </div>
    </div>
</body>
</html>
`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timestamp;
  }
}
