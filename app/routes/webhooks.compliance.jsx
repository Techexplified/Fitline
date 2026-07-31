import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop } = await authenticate.webhook(request);

  console.log(`Received compliance webhook: ${topic} for shop: ${shop}`);

  // Shopify requires that webhook endpoints validate the HMAC digest (automatically
  // handled by authenticate.webhook) and return an HTTP 200 (Response) upon success.
  return new Response();
};
