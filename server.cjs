const http = require('http')
const fs = require('fs')
const path = require('path')

const root = __dirname
const distPath = path.join(root, 'dist')

const PORT = Number(process.env.PORT) || 3000

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json'
}

const send = (res, status, body, headers) => {
  res.writeHead(status, headers)
  res.end(body)
}

const sendFile = (res, filePath) => {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' })
      return
    }
    const type = mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
    send(res, 200, data, { 'Content-Type': type })
  })
}

const serveDist = (req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])

  if (urlPath === '/api/salud') {
    send(res, 200, JSON.stringify({ ok: true, servicio: 'nonini-store-backend' }), {
      'Content-Type': 'application/json; charset=utf-8'
    })
    return
  }

  if (urlPath.startsWith('/api/')) {
    send(res, 503, JSON.stringify({ ok: false, starting: true }), {
      'Content-Type': 'application/json; charset=utf-8'
    })
    return
  }

  const relative = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '')
  const filePath = path.normalize(path.join(distPath, relative))
  if (!filePath.startsWith(distPath)) {
    send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' })
    return
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(res, filePath)
      return
    }
    sendFile(res, path.join(distPath, 'index.html'))
  })
}

let handler = serveDist

const server = http.createServer((req, res) => {
  handler(req, res)
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`dist existe: ${fs.existsSync(path.join(distPath, 'index.html'))}`)
})

setImmediate(() => {
  import('./server/server.js')
    .then(({ app, afterListen }) => {
      if (typeof app === 'function') {
        handler = app
        console.log('Express listo')
      }
      if (typeof afterListen === 'function') {
        return afterListen()
      }
    })
    .catch((error) => {
      console.error('Error al cargar Express:', error)
    })
})
