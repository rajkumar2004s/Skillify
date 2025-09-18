import { defineEventHandler, readBody } from "h3";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Received verification request:", body);
    console.log("Request body keys:", Object.keys(body));

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // More detailed validation
    if (!razorpay_order_id) {
      console.error("Missing razorpay_order_id");
      return {
        success: false,
        message: "Missing razorpay_order_id",
      };
    }

    if (!razorpay_payment_id) {
      console.error("Missing razorpay_payment_id");
      return {
        success: false,
        message: "Missing razorpay_payment_id",
      };
    }

    if (!razorpay_signature) {
      console.error("Missing razorpay_signature");
      return {
        success: false,
        message: "Missing razorpay_signature",
      };
    }

    // Verify payment signature
    const secret = "EYg9qRrApT7g1j5AL4CtVsIM";
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("Generated signature:", generated_signature);
    console.log("Received signature:", razorpay_signature);

    const isValid = generated_signature === razorpay_signature;

    if (isValid) {
      return {
        success: true,
        verified: true,
        message: "Payment verified successfully",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      };
    } else {
      return {
        success: false,
        verified: false,
        message: "Invalid payment signature",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      };
    }
  } catch (error: any) {
    console.error("Verification error:", error);
    return {
      success: false,
      message: error.message || "Payment verification failed",
    };
  }
});
