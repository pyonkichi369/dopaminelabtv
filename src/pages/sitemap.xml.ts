import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') ?? 'https://dopaminelabtv.com';

  const posts = Object.entries(
    import.meta.glob('../content/posts/*.md', { eager: true }) as Record<string, any>
  )
    .map(([path, mod]) => ({
      slug: path.split('/').pop()!.replace('.md', ''),
      date: mod.frontmatter?.date ?? '2026-01-01',
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const postUrls = posts
    .map(({ slug, date }) => {
      const lastmod = new Date(date).toISOString().split('T')[0];
      return `  <url>
    <loc>${siteUrl}/posts/${slug}/</loc>
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
    <loc>${siteUrl}/posts/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/about/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
${postUrls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
