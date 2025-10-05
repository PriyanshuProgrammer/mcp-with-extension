async function initialize() {
  const initRequest = {
    method: "tools/list",
    params: {},
    jsonrpc: "2.0",
    id: 2,
  };

  const response = await fetch("http://localhost:3000/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "Mcp-Session-Id": "ed62cbcd-90cc-4438-bd46-017e1192d15e",
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
