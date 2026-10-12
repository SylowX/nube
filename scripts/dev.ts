// Cross-platform runner for Apophasis (Bun backend + Vite frontend)
import { spawn } from 'node:child_process'

console.log('\x1b[36m%s\x1b[0m', '────────────────────────────────────────────────────')
console.log('\x1b[1m\x1b[32m%s\x1b[0m', '  🚀 Apophasis Dev Runner')
console.log('\x1b[36m%s\x1b[0m', '────────────────────────────────────────────────────')
console.log('  ➜ Backend:  http://localhost:8787')
console.log('  ➜ Frontend: http://localhost:5758')
console.log('\x1b[36m%s\x1b[0m', '────────────────────────────────────────────────────\n')

const isWin = process.platform === 'win32'

// Launch Bun server
const server = spawn(isWin ? 'cmd.exe' : 'bun', isWin ? ['/c', 'bun', 'run', 'server/index.ts'] : ['run', 'server/index.ts'], {
  stdio: 'inherit',
  env: process.env,
})

// Launch Vite dev server
const vite = spawn(isWin ? 'cmd.exe' : 'bun', isWin ? ['/c', 'bun', 'run', 'dev'] : ['run', 'dev'], {
  stdio: 'inherit',
  env: process.env,
})

function shutdown() {
  console.log('\n\x1b[33m[dev-runner] Deteniendo servicios...\x1b[0m')
  try {
    if (isWin) {
      if (server.pid) spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'])
      if (vite.pid) spawn('taskkill', ['/pid', String(vite.pid), '/f', '/t'])
    } else {
      server.kill('SIGTERM')
      vite.kill('SIGTERM')
    }
  } catch {}
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

server.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`\x1b[31m[backend] Servidor finalizó con código ${code}\x1b[0m`)
  }
})

vite.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`\x1b[31m[frontend] Vite finalizó con código ${code}\x1b[0m`)
  }
})
