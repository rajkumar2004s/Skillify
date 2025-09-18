export default defineEventHandler(async (event) => {
  const body = await readBody<{ message: string }>(event);

  const GEMINI_API_KEY =
    process.env.GEMINI_API_KEY || "AIzaSyB2tfLyWE8etEnpxVM82Wb8D1-yPxesBJU";

  try {
    interface GeminiResponse {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
    }

    const response: GeminiResponse = await $fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: {
          contents: [
            {
              parts: [{ text: body.message }],
            },
          ],
        },
      }
    );

    // Extract response text
    // @ts-ignore
    const botReply =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn’t understand.";

    return { reply: botReply };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
    });
  }
});
