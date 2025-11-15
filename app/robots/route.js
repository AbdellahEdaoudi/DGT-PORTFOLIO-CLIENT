// app/robots/route.js
export async function GET() {
  const robots = `
User-agent: *
Allow: /

Sitemap: https://dgtportfolio.com/sitemap
  `;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
