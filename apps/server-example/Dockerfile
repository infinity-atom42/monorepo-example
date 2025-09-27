FROM oven/bun:1 AS build

WORKDIR /app

# Cache packages
COPY package.json package.json
COPY bun.lock bun.lock

COPY /apps/server-example/package.json ./apps/server-example/package.json
# COPY /packages/<package>/package.json ./packages/<package>/package.json

RUN bun install

COPY /apps/server-example ./apps/server-example
# COPY /packages/<package> ./packages/<package>

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3101