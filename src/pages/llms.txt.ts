import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { LLMS_HEAD, LLMS_TAIL } from '../data/llms-static';

// /llms.txt used to be a hand-written file in public/. It drifted: by 2026-07-19 it
// listed 21 of 26 articles, so ~19% of the site was invisible to AI crawlers on the
// one surface built for them. The article index is now generated at build time.

export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? 'https://dopaminelabtv.com';
  const posts = await getCollection('posts');

  const byLang = (lang: 'en' | 'ja') =>
    posts
      .filter((p) => p.id.startsWith(`${lang}/`))
      .sort((a, b) => +new Date(b.data.date) - +new Date(a.data.date));

  const line = (p: any, lang: 'en' | 'ja') => {
    const slug = p.id.replace(/^(en|ja)\//, '').replace(/\.mdx?$/, '');
    const url = lang === 'en' ? `${base}/posts/${slug}/` : `${base}/ja/posts/${slug}/`;
    const summary = (p.data.excerpt ?? '').replace(/\s+/g, ' ').trim();
    return `- [${p.data.title}](${url}): ${summary}`;
  };

  const section = (title: string, lang: 'en' | 'ja') =>
    `## ${title}\n\n${byLang(lang).map((p) => line(p, lang)).join('\n')}\n`;

  const body = [
    LLMS_HEAD.trimEnd(),
    '',
    section('Articles (English)', 'en'),
    section('Articles (Japanese / 日本語)', 'ja'),
    LLMS_TAIL.trimStart(),
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
