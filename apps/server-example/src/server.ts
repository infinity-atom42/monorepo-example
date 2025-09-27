import { Elysia } from "elysia";

const port = process.env['PORT'] ? parseInt(process.env['PORT']) : 3101;

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
