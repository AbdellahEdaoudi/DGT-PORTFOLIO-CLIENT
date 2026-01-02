import axios from "axios";
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;
const BASE = process.env.BASE;

// دالة لجلب access token من PayPal
async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString("base64");
  const response = await axios.post(
    `${BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
}

export async function GET(req) {
  try {
    const token = await getAccessToken();

    // Use the active PRODUCT ID
    // Old logic was taking the first product, which might be a DELETED one.
    // We now hardcode the new active product ID or filter for it.
    const productId = "PROD-35N04952TH6572948";

    // جلب الخطط الخاصة بالمنتج
    const plansRes = await axios.get(`${BASE}/v1/billing/plans`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        product_id: productId,
        page_size: 20, // ensure we get all plans
        status: "ACTIVE" // Only get active plans
      },
    });

    const plans = plansRes.data.plans || [];
    return new Response(JSON.stringify({ plans }), { status: 200 });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return new Response(JSON.stringify({ plans: [] }), { status: 500 });
  }
}
