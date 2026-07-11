FROM python:3.14-slim
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN apt-get update \
  && apt-get install -y --no-install-recommends gcc build-essential \
  && pip install --no-cache-dir -r /app/requirements.txt \
  && apt-get remove -y gcc build-essential \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*
COPY app.py /app/app.py
ENV LANGGRAPH_URL=http://langgraph:8080
EXPOSE 8001
CMD ["chainlit", "run", "app.py", "--host", "0.0.0.0", "--port", "8001"]
