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

    // جلب المنتجات
    const productsRes = await axios.get(`${BASE}/v1/catalogs/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const products = productsRes.data;
    if (!products.products || products.products.length === 0) {
      return new Response(JSON.stringify({ plans: [] }), { status: 200 });
    }

    const productId = products.products[0].id;

    // جلب الخطط الخاصة بالمنتج
    const plansRes = await axios.get(`${BASE}/v1/billing/plans`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { product_id: productId },
    });

    const plans = plansRes.data.plans || [];
    return new Response(JSON.stringify({ plans }), { status: 200 });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return new Response(JSON.stringify({ plans: [] }), { status: 500 });
  }
}
