import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readFileSync, readdirSync, copyFileSync, mkdirSync, existsSync } from 'fs'
import { marked } from 'marked'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'README.md')
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
      mkdirSync('dist', { recursive: true })
      require('fs').writeFileSync('dist/index.html', content)
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