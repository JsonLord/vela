# Agent Deployment Guide & Best Practices for Hugging Face Space

This codebase is configured for deployment on **Hugging Face Spaces**.

## 1. Deployment Configuration

### Target Space
- **Profile:** `Leon4gr45`
- **Space:** `Velo`
- **Full Identifier:** `Leon4gr45/Velo`
- **Frontend Port:** `7860` (mandatory for Hugging Face Spaces)

### Deployment Method
- **Docker SDK** — The application is built using a multi-stage Dockerfile (`Dockerfile`), building Vite static assets and serving them via Node.js / Express (`server.js`) on port 7860.

### HF Token
- Always read the token from environment variable `HF_TOKEN`.
- Never hardcode secret tokens in tracked files.

### Required Files
- `Dockerfile`: Multi-stage build for web application assets and Express runner.
- `server.js`: Web server serving static assets and API routes.
- `README.md`: Includes Hugging Face Space YAML frontmatter:
  ```yaml
  ---
  title: Velo
  sdk: docker
  app_port: 7860
  ---
  ```
- `.hfignore`: Excludes `node_modules`, `.git`, build output artifacts, and logs from uploads.
- `Agent.md`: This deployment documentation.

---

## 2. API Exposure and Documentation

### Mandatory Endpoints

- **`/health`**
  - Method: `GET`
  - Purpose: Liveness & readiness check for Hugging Face Spaces.
  - Returns: `{ "status": "ok", "service": "Velo" }` with HTTP 200.

- **`/api-docs`**
  - Method: `GET`
  - Purpose: Documents all available API endpoints.
  - Reachable at: `https://Leon4gr45-Velo.hf.space/api-docs`

### Functional Endpoints

- **`/predict`**
  - Method: `POST`
  - Purpose: Story continuation and text prediction.
  - Request Example:
    ```json
    {
      "prompt": "The old clock struck midnight as Elena entered the library...",
      "maxLength": 100
    }
    ```
  - Response Example:
    ```json
    {
      "continuation": "A faint blue light gleamed from behind the bookshelf...",
      "status": "success"
    }
    ```

- **`/generate`**
  - Method: `POST`
  - Purpose: Generate narrative outlines and creative writing structures.
  - Request Example:
    ```json
    {
      "genre": "Sci-Fi",
      "topic": "First contact with an ancient artifact"
    }
    ```
  - Response Example:
    ```json
    {
      "genre": "Sci-Fi",
      "topic": "First contact with an ancient artifact",
      "outline": "Chapter 1: Discovery in the Kuiper Belt...",
      "status": "success"
    }
    ```

### OpenAI-Compatible Endpoints with Custom URL

- **`/v1/models`**
  - Method: `GET`
  - Purpose: List available models.

- **`/v1/chat/completions`**
  - Method: `POST`
  - Purpose: Chat completion interface matching the OpenAI API format.
  - Custom URL Support: Accepts `custom_url` or `base_url` parameter in body or `X-Custom-Url` header to forward requests to custom upstream OpenAI-compatible endpoints.
  - Request Example:
    ```json
    {
      "model": "velo-default",
      "messages": [
        { "role": "user", "content": "Write a short scene." }
      ],
      "custom_url": "https://api.openai.com/v1"
    }
    ```

---

## 3. Deployment Workflow & Tricks

1. **Clean Hugging Face Repo (Precondition):**
   ```python
   from huggingface_hub import HfApi
   api = HfApi(token=token)
   # Reset space repo if file limit exceeded
   ```

2. **Upload Codebase:**
   ```bash
   hf upload Leon4gr45/Velo . --repo-type=space --exclude "node_modules/*" --exclude "dist/*" --exclude ".git/*"
   ```

3. **Stream Build and Run Logs:**
   - Build logs (SSE):
     ```bash
     curl -N -H "Authorization: Bearer <TOKEN>" "https://huggingface.co/api/spaces/Leon4gr45/Velo/logs/build"
     ```
   - Run logs (SSE):
     ```bash
     curl -N -H "Authorization: Bearer <TOKEN>" "https://huggingface.co/api/spaces/Leon4gr45/Velo/logs/run"
     ```

4. **Verify Health & OpenAI Endpoints:**
   - Query `https://Leon4gr45-Velo.hf.space/health` and `https://Leon4gr45-Velo.hf.space/v1/chat/completions`.
