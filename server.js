import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 7860;

app.use(express.json());

// Mandatory Endpoint: /health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Velo' });
});

// Mandatory Endpoint: /api-docs
app.get('/api-docs', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Velo API Documentation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 2rem; line-height: 1.6; background-color: #0f172a; color: #f8fafc; }
    h1 { border-bottom: 2px solid #334155; padding-bottom: 0.5rem; color: #38bdf8; }
    .endpoint { background: #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #334155; }
    .method { font-weight: bold; padding: 0.2rem 0.5rem; border-radius: 4px; display: inline-block; margin-right: 0.5rem; }
    .get { background-color: #10b981; color: white; }
    .post { background-color: #3b82f6; color: white; }
    pre { background: #090d16; padding: 1rem; border-radius: 6px; overflow-x: auto; border: 1px solid #1e293b; }
    code { font-family: monospace; }
  </style>
</head>
<body>
  <h1>Velo API Documentation</h1>
  <p>Velo - AI-powered novel writing IDE API Endpoints</p>

  <div class="endpoint">
    <h2><span class="method get">GET</span> /health</h2>
    <p><strong>Purpose:</strong> Readiness and liveness check for Hugging Face Spaces.</p>
    <h3>Response Example:</h3>
    <pre><code>{
  "status": "ok",
  "service": "Velo"
}</code></pre>
  </div>

  <div class="endpoint">
    <h2><span class="method get">GET</span> /api-docs</h2>
    <p><strong>Purpose:</strong> Returns documentation for all available API endpoints.</p>
  </div>

  <div class="endpoint">
    <h2><span class="method post">POST</span> /predict</h2>
    <p><strong>Purpose:</strong> Predict story continuation or next scene elements based on context input.</p>
    <h3>Request Example:</h3>
    <pre><code>{
  "prompt": "The old clock struck midnight as Elena entered the library...",
  "maxLength": 100
}</code></pre>
    <h3>Response Example:</h3>
    <pre><code>{
  "continuation": "A faint blue light gleamed from behind the bookshelf...",
  "status": "success"
}</code></pre>
  </div>

  <div class="endpoint">
    <h2><span class="method post">POST</span> /generate</h2>
    <p><strong>Purpose:</strong> Generate narrative suggestions or plot outlines.</p>
    <h3>Request Example:</h3>
    <pre><code>{
  "genre": "Sci-Fi",
  "topic": "First contact with an ancient artifact"
}</code></pre>
    <h3>Response Example:</h3>
    <pre><code>{
  "outline": "Chapter 1: Discovery in the Kuiper Belt...",
  "status": "success"
}</code></pre>
  </div>

  <div class="endpoint">
    <h2><span class="method get">GET</span> /v1/models</h2>
    <p><strong>Purpose:</strong> OpenAI-compatible models listing endpoint.</p>
    <h3>Response Example:</h3>
    <pre><code>{
  "object": "list",
  "data": [
    { "id": "velo-default", "object": "model", "created": 1700000000, "owned_by": "velo" }
  ]
}</code></pre>
  </div>

  <div class="endpoint">
    <h2><span class="method post">POST</span> /v1/chat/completions</h2>
    <p><strong>Purpose:</strong> OpenAI-compatible chat completions endpoint. Supports proxying to a custom upstream OpenAI-compatible Base URL via <code>custom_url</code> / <code>base_url</code> parameter or header.</p>
    <h3>Request Example:</h3>
    <pre><code>{
  "model": "velo-default",
  "messages": [
    { "role": "user", "content": "Write a short scene about a wizard." }
  ],
  "custom_url": "https://api.openai.com/v1"
}</code></pre>
    <h3>Response Example:</h3>
    <pre><code>{
  "id": "chatcmpl-velo-1234567890",
  "object": "chat.completion",
  "created": 1700000000,
  "model": "velo-default",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The old wizard carefully opened the ancient spellbook..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 10, "completion_tokens": 15, "total_tokens": 25 }
}</code></pre>
  </div>
</body>
</html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Functional Endpoint: /predict
app.post('/predict', (req, res) => {
  const { prompt, maxLength = 100 } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'Missing required parameter: prompt' });
  }
  res.json({
    continuation: `[Velo Model Output for: "${prompt.slice(0, 30)}..."] A mysterious shadow glided across the floor, leaving behind glowing cyan runes.`,
    maxLength,
    status: 'success'
  });
});

// Functional Endpoint: /generate
app.post('/generate', (req, res) => {
  const { genre = 'General', topic = 'Unspecified' } = req.body || {};
  res.json({
    genre,
    topic,
    outline: `[Generated Outline for ${genre} - ${topic}]:\n1. Introduction of characters\n2. Inciting incident\n3. Climax & Resolution`,
    status: 'success'
  });
});

// OpenAI-Compatible Endpoint: /v1/models
app.get('/v1/models', (req, res) => {
  res.json({
    object: 'list',
    data: [
      { id: 'velo-default', object: 'model', created: Math.floor(Date.now() / 1000), owned_by: 'velo' },
      { id: 'gpt-4o', object: 'model', created: Math.floor(Date.now() / 1000), owned_by: 'velo' },
      { id: 'deepseek-chat', object: 'model', created: Math.floor(Date.now() / 1000), owned_by: 'velo' }
    ]
  });
});

// OpenAI-Compatible Endpoint: /v1/chat/completions with Custom URL Support
app.post('/v1/chat/completions', async (req, res) => {
  const { model = 'velo-default', messages = [], custom_url, base_url } = req.body || {};

  // Check if a custom upstream URL is specified in body, header, or query
  const targetUrl = custom_url || base_url || req.headers['x-custom-url'] || req.headers['x-base-url'];

  if (targetUrl) {
    try {
      // Normalize upstream URL to ensure /chat/completions path
      let cleanBase = String(targetUrl).replace(/\/+$/, '');
      if (!cleanBase.endsWith('/chat/completions')) {
        if (!cleanBase.endsWith('/v1')) cleanBase += '/v1';
        cleanBase += '/chat/completions';
      }

      const upstreamHeaders = {
        'Content-Type': 'application/json',
      };
      if (req.headers.authorization) {
        upstreamHeaders['Authorization'] = req.headers.authorization;
      }

      const upstreamBody = { ...req.body };
      delete upstreamBody.custom_url;
      delete upstreamBody.base_url;

      const response = await fetch(cleanBase, {
        method: 'POST',
        headers: upstreamHeaders,
        body: JSON.stringify(upstreamBody),
      });

      const responseData = await response.json();
      return res.status(response.status).json(responseData);
    } catch (err) {
      return res.status(502).json({
        error: {
          message: `Failed to proxy to custom URL: ${err.message}`,
          type: 'proxy_error',
          code: 502
        }
      });
    }
  }

  // Fallback response when no custom upstream URL is proxied
  const lastUserMsg = messages.slice().reverse().find((m) => m.role === 'user')?.content || 'Hello';
  const responseContent = `[Velo AI Response] Story continuation & creative suggestion for input: "${String(lastUserMsg).slice(0, 50)}"`;

  res.json({
    id: `chatcmpl-velo-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: responseContent
        },
        finish_reason: 'stop'
      }
    ],
    usage: {
      prompt_tokens: lastUserMsg.length,
      completion_tokens: responseContent.length,
      total_tokens: lastUserMsg.length + responseContent.length
    }
  });
});

// Serve static frontend build from dist folder
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Velo app listening on port ${PORT}`);
});
