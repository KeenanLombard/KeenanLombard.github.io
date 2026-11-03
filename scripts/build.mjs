import { mkdir, copyFile, cp, rm } from 'node:fs/promises';
const pages = ['index.html', 'work.html', 'about.html', 'contact.html', 'project.html', '404.html', 'styles.css', 'script.js', 'site.config.js'];
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const page of pages) await copyFile(page, `dist/${page}`);
await cp('assets', 'dist/assets', { recursive: true });
console.log('Built portfolio in dist/');
