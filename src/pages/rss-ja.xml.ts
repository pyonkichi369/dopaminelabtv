import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') ?? 'https://dopaminelabtv.com';

  const posts = Object.entries(
    import.meta.glob('../content/posts/ja/*.md', { eager: true }) as Record<string, any>
  )
    .map(([path, mod]) => ({
      slug: path.split('/').pop()!.replace('.md', ''),
      title: mod.frontmatter?.title ?? '',
      excerpt: mod.frontmatter?.excerpt ?? '',
      date: mod.frontmatter?.date ?? '2026-01-01',
      tags: (mod.frontmatter?.tags ?? []) as string[],
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = posts
    .map(({ slug, title, excerpt, date, tags }) => `
  <item>
    <title><![CDATA[${title}]]></title>
    <link>${siteUrl}/ja/posts/${slug}/</link>
    <guid isPermaLink="true">${siteUrl}/ja/posts/${slug}/</guid>
    <pubDate>${new Date(date).toUTCString()}</pubDate>
    <description><![CDATA[${excerpt}]]></description>
    ${tags.map(t => `<category>${t}</category>`).join('\n    ')}
  </item>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Dopamine Lab TV（日本語）</title>
    <link>${siteUrl}/ja/</link>
    <description>神経科学と日本哲学の交差点から、AI時代を生き抜くための信号を発信。ドーパミン・注意力・集中力の研究。</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss-ja.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/og-default.png</url>
      <title>Dopamine Lab TV</title>
      <link>${siteUrl}/ja/</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
