import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') ?? 'https://dopaminelabtv.com';

  const allPosts = Object.entries(
    import.meta.glob('../content/posts/**/*.md', { eager: true }) as Record<string, any>
  )
    .map(([path, mod]) => {
      const parts = path.split('/');
      const lang = parts[parts.length - 2]; // 'en' or 'ja'
      const slug = parts[parts.length - 1].replace('.md', '');
      return {
        slug,
        lang,
        date: mod.frontmatter?.date ?? '2026-01-01',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const postUrls = allPosts
    .map(({ slug, lang, date }) => {
      const lastmod = new Date(date).toISOString().split('T')[0];
      const loc = lang === 'ja'
        ? `${siteUrl}/ja/posts/${slug}/`
        : `${siteUrl}/posts/${slug}/`;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/ja/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/posts/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/ja/posts/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/about/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteUrl}/ja/about/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
${postUrls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
