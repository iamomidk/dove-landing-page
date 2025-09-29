# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# install deps (including dev for tsc)
COPY package*.json tsconfig.json ./
RUN npm ci

# compile TS
COPY src ./src
RUN npm run build

# prune dev dependencies for lean runtime
RUN npm prune --omit=dev

# --- runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# copy production node_modules, dist, and package files
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

EXPOSE 4000
CMD ["node", "dist/index.js"]
