import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const uniCli = require.resolve('@dcloudio/vite-plugin-uni/bin/uni.js')
const child = spawn(process.execPath, [uniCli, ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    UNI_INPUT_DIR: process.cwd()
  },
  stdio: 'inherit'
})

child.on('exit', (code) => {
  process.exit(code ?? 1)
})
