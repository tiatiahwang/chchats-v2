export async function POST() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v1/direct_upload`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
    },
  );
  const { result } = await response.json();
  return new Response(JSON.stringify(result));
}
