import { defineNuxtPlugin } from "#app";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // Load Razorpay SDK
  if (process.client) {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }

  return {
    provide: {
      razorpay: {
        createPayment: async (options: {
          amount: number;
          currency: string;
          orderId: string;
          courseId: string;
          courseName: string;
          email?: string;
          name?: string;
        }) => {
          return new Promise((resolve, reject) => {
            const rzp = new window.Razorpay({
              key: "rzp_test_RHofjnm5xuFy05", // Your Razorpay Key ID
              amount: options.amount,
              currency: options.currency,
              order_id: options.orderId,
              name: "Skillify",
              description: `Payment for ${options.courseName}`,
              handler: function (response: any) {
                resolve({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                });
              },
              prefill: {
                email: options.email || "", // Pass from caller if available
                name: options.name || "", // Pass from caller if available
              },
              theme: {
                color: "#2f76e8",
              },
              modal: {
                ondismiss: function () {
                  reject(new Error("Payment cancelled"));
                },
              },
            });
            // Ensure Razorpay SDK is loaded before opening
            if (typeof window.Razorpay === "undefined") {
              const sdkScript = document.querySelector(
                'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
              );
              if (!sdkScript) {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.async = true;
                script.onload = () => rzp.open();
                document.body.appendChild(script);
              } else {
                sdkScript.addEventListener("load", () => rzp.open());
              }
            } else {
              rzp.open();
            }
          });
        },
      },
    },
  };
});
