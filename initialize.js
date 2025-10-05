async function initialize() {
  const initRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {},
      },
      clientInfo: {
        name: "fetch-client",
        version: "1.0.0",
      },
    },
  };

  const response = await fetch("http://localhost:3000/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify(initRequest),
  });
  console.log(await response.headers);
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

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
