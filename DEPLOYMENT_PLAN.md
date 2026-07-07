# Deployment Plan — costcenter.allcognix.com

## Architecture

```
:80 ──> nginx ──> / ──> Next.js frontend (:3000)
             └──> /api/* ──> FastAPI backend (:8000)
             └──> /chat/ ──> Chainlit deployment (:8001)
```

## Files to Create (3)

### 1. ai-cost-center-frontend/Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./ 2>/dev/null || true
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. nginx.conf (project root)

```nginx
server {
    listen 80;
    server_name costcenter.allcognix.com;

    location /api/ {
        proxy_pass http://ai-cost-center-backend:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_cache off;
    }

    location /chat/ {
        proxy_pass http://ai-cost-center-deployment:8001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://ai-cost-center-frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. docker-compose.yml (project root)

```yaml
services:
  ai-cost-center-backend:
    build: ./ai-cost-center-backend
    ports:
      - "8000"
    env_file: .env

  ai-cost-center-deployment:
    build: ./ai-cost-center-deployment
    ports:
      - "8001"
    environment:
      - LANGGRAPH_URL=http://ai-cost-center-backend:8000
    command:
      [
        "chainlit",
        "run",
        "app.py",
        "--host",
        "0.0.0.0",
        "--port",
        "8001",
        "--root-path",
        "/chat",
      ]

  ai-cost-center-frontend:
    build: ./ai-cost-center-frontend
    ports:
      - "3000"
    environment:
      - BACKEND_URL=http://ai-cost-center-backend:8000

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - ai-cost-center-backend
      - ai-cost-center-frontend
      - ai-cost-center-deployment
```

## File to Create on EC2

### .env (project root)

```
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-...
OPENAI_API_KEY=sk-...
```

## Deployment Steps

| # | Action | Command |
|---|--------|---------|
| 1 | SCP new files to EC2 | `scp -i key.pem -P <port> docker-compose.yml nginx.conf ubuntu@51.20.121.34:~/FinOps/` |
| 2 | SCP Dockerfile to EC2 | `scp -i key.pem -P <port> ai-cost-center-frontend/Dockerfile ubuntu@51.20.121.34:~/FinOps/ai-cost-center-frontend/` |
| 3 | SSH into EC2 | `ssh -i key.pem -P <port> ubuntu@51.20.121.34` |
| 4 | Create .env | `nano ~/FinOps/.env` (paste API keys) |
| 5 | Deploy | `cd ~/FinOps && docker-compose up -d --build` |
| 6 | Verify | `docker-compose ps` |
| 7 | Security group | Open inbound port 80 from 0.0.0.0/0 |

## DNS (Cloudflare)

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | costcenter | 51.20.121.34 | Proxied (orange cloud) |

## Final URLs

| URL | Service |
|-----|---------|
| https://costcenter.allcognix.com | Next.js Frontend |
| https://costcenter.allcognix.com/api/docs | FastAPI Swagger |
| https://costcenter.allcognix.com/chat/ | Chainlit UI |
