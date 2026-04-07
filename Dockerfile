# CHD mock API (OpenAPI + RAG + NGX + OpenAI). Build: docker build -t chd-api .
# Run (pass secrets at runtime, never bake into image):
#   docker run --env-file .env.local -p 8080:8080 chd-api
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY server ./server
COPY rag ./rag
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server/mock-api.mjs"]
