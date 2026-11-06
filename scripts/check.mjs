import { readdir, readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = process.cwd();
const pages = (await readdir(root)).filter(name => name.endsWith('.html'));
const errors = [];
let links = 0;
let images = 0;
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  if (!/<!doctype html>/i.test(html)) errors.push(`${page}: missing HTML doctype`);
  if (!/<html lang="en">/.test(html)) errors.push(`${page}: missing document language`);
  if (!/<meta name="viewport"/.test(html)) errors.push(`${page}: missing responsive viewport`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${page}: missing title`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${page}: missing description`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${page}: duplicate IDs`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(?:[a-z]+:|\/\/)/i.test(url)) continue;
    const [target, fragment] = url.split('#');
    if (!target) {
      if (fragment && !ids.includes(fragment)) errors.push(`${page}: missing anchor #${fragment}`);
      continue;
    }
    const file = target.split('?')[0].replace(/^\//, '');
    try { await access(resolve(root, file)); links++; }
    catch { errors.push(`${page}: missing local target ${file}`); }
    if (file === 'project.html') {
      const slug = new URL(url, 'https://example.com/').searchParams.get('project');
      if (slug && !['barber', 'guest-house', 'cape-tri', 'relay'].includes(slug)) errors.push(`${page}: unknown project ${slug}`);
    }
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    images++;
    if (!/\balt="[^"]*"/.test(match[0])) errors.push(`${page}: image missing alt attribute`);
    if (!/\bwidth="\d+"/.test(match[0]) || !/\bheight="\d+"/.test(match[0])) errors.push(`${page}: image missing dimensions`);
  }
  for (const match of html.matchAll(/<label\b[^>]*for="([^"]+)"/g)) {
    if (!ids.includes(match[1])) errors.push(`${page}: label does not match a form field`);
  }
}
for (const script of ['script.js', 'site.config.js', 'scripts/build.mjs', 'scripts/serve.mjs']) {
  const result = spawnSync(process.execPath, ['--check', script], { encoding: 'utf8' });
  if (result.status !== 0) errors.push(`${script}: ${result.stderr}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Verified ${pages.length} pages, ${links} local references, ${images} accessible images, form labels, and JavaScript syntax.`);
