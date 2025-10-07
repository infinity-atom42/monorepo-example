import { Elysia } from 'elysia'

const port = parseInt(process.env['PORT']!)


const app = new Elysia().get('/', () => 'Hello Elysia').listen(port)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
