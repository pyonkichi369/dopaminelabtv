import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') ?? 'https://dopaminelabtv.com';
  return new Response(
    `User-agent: *
Allow: /

# AI crawlers — explicitly welcome (AIO optimization)
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Googlebot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
    { headers: { 'Content-Type': 'text/plain' } }
  );
};
