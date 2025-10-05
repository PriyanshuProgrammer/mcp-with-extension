async function initialize() {
  const initRequest = {
    method: "tools/call",
    params: {
      name: "summarize-email",
      arguments: {
        apiKey: "AIzaSyD55ISrrVFy1xS09jAzST_LFVE0zVmafhQ",
        email: {
          subject: "Quarterly Marketing Review & Strategy Update",
          sender: "sarah.johnson@company.com",
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
        },
      },
    },
    jsonrpc: "2.0",
    id: 2,
  };

  const response = await fetch("http://localhost:3000/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "Mcp-Session-Id": "4caa9ceb-2c69-4e4c-bdd2-b98e0af8b09d",
    },
    body: JSON.stringify(initRequest),
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  console.log(response.headers);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    // SSE events are usually separated by double newline \n\n
    const events = chunk.split("\n\n");
    for (const event of events) {
      if (event.trim()) {
        console.log("Received event:", event);
      }
    }
  }
}

initialize();
