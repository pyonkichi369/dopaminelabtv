#!/usr/bin/env node
/**
 * Usage: npm run new-post "Your Post Title"
 * Creates a new markdown post stub in src/content/posts/
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const title = process.argv[2];
if (!title) {
  console.error('Usage: npm run new-post "Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');

const date = new Date().toISOString().split('T')[0];

const content = `---
title: "${title}"
date: "${date}"
excerpt: ""
tags: ["dopamine", "neuroscience"]
readTime: 5
---

## The Paper



## The Japanese Lens



## The Lab Note


`;

const filePath = join(__dirname, '..', 'src', 'content', 'posts', `${slug}.md`);
writeFileSync(filePath, content);
console.log(`✅ Created: src/content/posts/${slug}.md`);
console.log(`   Edit: ${filePath}`);
