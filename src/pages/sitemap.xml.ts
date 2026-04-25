import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') ?? 'https://dopaminelabtv.com';

  const postMods = Object.entries(
    import.meta.glob('../content/posts/**/*.md', { eager: true }) as Record<string, any>
  ).map(([path, mod]) => {
    const parts = path.split('/');
    const lang = parts[parts.length - 2];
    const slug = parts[parts.length - 1].replace('.md', '');
    return { slug, lang, date: mod.frontmatter?.date ?? '2026-01-01', tags: mod.frontmatter?.tags ?? [] };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const postUrls = postMods
    .map(({ slug, lang, date }) => {
      const lastmod = new Date(date).toISOString().split('T')[0];
      const loc = lang === 'ja' ? `${siteUrl}/ja/posts/${slug}/` : `${siteUrl}/posts/${slug}/`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    }).join('\n');

  // Unique tags per language
  const enTags = [...new Set(postMods.filter(p => p.lang === 'en').flatMap(p => p.tags))];
  const jaTags = [...new Set(postMods.filter(p => p.lang === 'ja').flatMap(p => p.tags))];

  const tagUrls = [
    ...enTags.map(t => `  <url>\n    <loc>${siteUrl}/tags/${(t as string).toLowerCase().replace(/\s+/g, '-')}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`),
    ...jaTags.map(t => `  <url>\n    <loc>${siteUrl}/ja/tags/${encodeURIComponent(t as string)}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`),
  ].join('\n');

  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${siteUrl}/ja/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${siteUrl}/posts/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${siteUrl}/ja/posts/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${siteUrl}/challenge/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${siteUrl}/ja/challenge/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${siteUrl}/tags/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>${siteUrl}/ja/tags/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>${siteUrl}/about/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${siteUrl}/ja/about/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
${postUrls}
${tagUrls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
