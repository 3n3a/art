import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readFileSync, readdirSync, copyFileSync, mkdirSync, writeFileSync } from 'fs'
import { marked } from 'marked'
import { fileURLToPath, URL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

export default defineConfig({
build: {
outDir: 'dist',
rollupOptions: {
input: {
index: resolve(__dirname, 'index.html')
}
},
emptyOutDir: true
},
plugins: [{
name: 'markdown-to-html',
buildStart() {
const md = readFileSync('README.md', 'utf-8')
const html = marked(md)
const content = `<!DOCTYPE html>

<html><head><meta charset="utf-8"><title>art</title></head><body>${html}</body></html>`


  // Create index.html in project root for Vite to use as entry point
  writeFileSync('index.html', content)
},
closeBundle() {
  // Copy all visible folders to `dist/`
  const visibleDirs = readdirSync('.', { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'dist' && entry.name !== 'node_modules')
  
  for (const dir of visibleDirs) {
    const src = dir.name
    const dest = `dist/${src}`
    mkdirSync(dest, { recursive: true })
    // naïve flat copy
    const files = readdirSync(src)
    for (const file of files) {
      const from = `${src}/${file}`
      const to = `${dest}/${file}`
      copyFileSync(from, to)
    }
  }
}


}]
})