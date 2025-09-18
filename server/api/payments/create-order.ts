import Razorpay from "razorpay";
import { defineEventHandler, readBody, createError } from "h3";

const razorpay = new Razorpay({
  key_id: "rzp_test_RHofjnm5xuFy05",
  key_secret: "EYg9qRrApT7g1j5AL4CtVsIM",
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { amount, currency = "INR" } = body;

    console.log("Create order request:", { amount, currency });

    const options = {
      amount: Math.round(amount * 100), // Ensure amount is in paise and is an integer
      currency,
      receipt: `order_${Date.now()}`,
    };

    console.log("Razorpay order options:", options);

    const order = await razorpay.orders.create(options);

    console.log("Created Razorpay order:", order);

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Could not create order",
    });
  }
});
