import fetch from "node-fetch";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 3001 } = process.env;
const base = "https://api-m.sandbox.paypal.com";

 export async function createOrder(data){
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: data.product.cost,
                    },
                },
            ],
        }),
    });
    
    return handleResponse(response);
 }

 export async function capturePayment(orderId){
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        },
    });
    return handleResponse(response);
 }

 export async function generateAccessToken(){
    const auth = Buffer.from(
        PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
      ).toString("base64");
      const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
  
      const jsonData = await handleResponse(response);
      return jsonDatad.access_token;
 }
 
 async function handleResponse(response) {
    if(response.status === 200 || response.status === 201){
        return response.json();
    }
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}  