import express from 'express'
import next from 'next'
import { createProxyMiddleware } from 'http-proxy-middleware'

const port = parseInt(process.env.PORT ?? '3000', 10)
const inDevelopment = process.env.NODE_ENV !== 'production'
const app = next({ dev: inDevelopment })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  if (inDevelopment) {
    server.use('/api', createProxyMiddleware({
      target: 'http://localhost:3080',
      changeOrigin: true
    }))
  }

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
