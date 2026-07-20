# Setup

## Local Development

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Docker

```bash
docker-compose -f stagging/docker-compose.yml up --build
```

## Vault Seeding

```bash
export VAULT_ADDR=http://localhost:8200 VAULT_TOKEN=root
python vault/consul_stagging.py
```
