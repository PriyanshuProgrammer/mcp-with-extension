#!/usr/bin/env node

// Simple Node.js example using fetch to interact with MCP UI Server
// Run with: node simple-example.js

async function main() {
    const MCP_ENDPOINT = 'http://localhost:3000/mcp';
    let sessionId = null;

    console.log('🚀 Simple MCP Client Example\n');

    try {
        // 1. Initialize session
        console.log('1️⃣ Initializing session...');
        const initResponse = await fetch(MCP_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "initialize",
                params: {
                    protocolVersion: "2024-11-05",
                    capabilities: { tools: {} },
                    clientInfo: { name: "simple-client", version: "1.0.0" }
                }
            })
        });

        if (!initResponse.ok) {
            throw new Error(`Init failed: ${initResponse.status}`);
        }

        sessionId = initResponse.headers.get('Mcp-Session-Id');
        const initData = await initResponse.json();
        console.log('✅ Session initialized with ID:', sessionId);
        console.log('📋 Server capabilities:', JSON.stringify(initData.result?.capabilities, null, 2));

        // 2. List tools
        console.log('\n2️⃣ Listing tools...');
        const toolsResponse = await fetch(MCP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'mcp-session-id': sessionId
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 2,
                method: "tools/list"
            })
        });

        if (!toolsResponse.ok) {
            throw new Error(`Tools list failed: ${toolsResponse.status}`);
        }

        const toolsData = await toolsResponse.json();
        console.log('🔧 Available tools:');
        toolsData.result?.tools?.forEach(tool => {
            console.log(`   - ${tool.name}: ${tool.description}`);
        });

        // 3. Call greet tool
        console.log('\n3️⃣ Calling greet tool...');
        const greetResponse = await fetch(MCP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'mcp-session-id': sessionId
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 3,
                method: "tools/call",
                params: {
                    name: "greet",
                    arguments: {}
                }
            })
        });

        if (!greetResponse.ok) {
            throw new Error(`Greet tool failed: ${greetResponse.status}`);
        }

        const greetData = await greetResponse.json();
        console.log('🎨 Greet tool response:');
        
        if (greetData.result?.content) {
            greetData.result.content.forEach((content, index) => {
                console.log(`   Content ${index + 1}:`);
                console.log(`     Type: ${content.type}`);
                console.log(`     MIME: ${content.mimeType}`);
                console.log(`     URI: ${content.uri}`);
                
                if (content.text) {
                    try {
                        const uiData = JSON.parse(content.text);
                        console.log(`     UI Type: ${uiData.type}`);
                        if (uiData.iframeUrl) {
                            console.log(`     🌐 iframe URL: ${uiData.iframeUrl}`);
                        }
                    } catch (e) {
                        console.log(`     Raw text: ${content.text}`);
                    }
                }
            });
        }

        // 4. End session
        console.log('\n4️⃣ Ending session...');
        const endResponse = await fetch(MCP_ENDPOINT, {
            method: 'DELETE',
            headers: { 'mcp-session-id': sessionId }
        });

        if (endResponse.ok) {
            console.log('✅ Session ended successfully');
        } else {
            console.log(`⚠️ Session end status: ${endResponse.status}`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        // Try to clean up session
        if (sessionId) {
            try {
                await fetch(MCP_ENDPOINT, {
                    method: 'DELETE',
                    headers: { 'mcp-session-id': sessionId }
                });
            } catch (cleanupError) {
                // Ignore cleanup errors
            }
        }
    }

    console.log('\n✨ Example completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.error('❌ This example requires Node.js 18+ with built-in fetch support.');
    console.log('💡 Alternatively, install node-fetch: npm install node-fetch');
    console.log('   Then add: import fetch from "node-fetch";');
    process.exit(1);
}

main().catch(console.error);