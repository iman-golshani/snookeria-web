import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Webhook } from "npm:standardwebhooks@^1";

type SendSmsHookPayload = {
  user: {
    phone?: string | null;
  };
  sms: {
    otp?: string | null;
  };
};

const KAVENEGAR_TEMPLATE = "snookeria-otp";
const normalizeIranianPhone = (value: string): string | null => {
  const digits = value.replace(/[\s-]/g, "");
  if (/^\+989\d{9}$/.test(digits)) return digits.slice(1);
  if (/^989\d{9}$/.test(digits)) return digits;
  if (/^09\d{9}$/.test(digits)) return "98" + digits.slice(1);
  return null;
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

Deno.serve(async (request) => {
  try {
    if (request.method !== "POST") {
      return jsonResponse(
        {
          error: {
            http_code: 405,
            message: "Method not allowed",
          },
        },
        405
      );
    }

    const apiKey = Deno.env.get("KAVENEGAR_API_KEY");
    const rawHookSecret = Deno.env.get("SEND_SMS_HOOK_SECRET");

    if (!apiKey || !rawHookSecret) {
      console.error("Required secrets are not configured");

      return jsonResponse(
        {
          error: {
            http_code: 500,
            message: "SMS service is not configured",
          },
        },
        500
      );
    }

    // Supabase provides the secret as:
    // v1,whsec_<base64-secret>
    const hookSecret = rawHookSecret.replace("v1,whsec_", "");

    // IMPORTANT:
    // Verify the raw request body before parsing it.
    const rawPayload = await request.text();
    const headers = Object.fromEntries(request.headers);

    let payload: SendSmsHookPayload;

    try {
      const webhook = new Webhook(hookSecret);

      payload = webhook.verify(
        rawPayload,
        headers
      ) as SendSmsHookPayload;
    } catch (error) {
      console.error("Invalid Send SMS Hook signature", error);

      return jsonResponse(
        {
          error: {
            http_code: 401,
            message: "Invalid webhook signature",
          },
        },
        401
      );
    }

    const phone = payload.user?.phone;
    const otp = payload.sms?.otp;

    if (!phone || !otp) {
      console.error("Invalid Send SMS Hook payload");

      return jsonResponse(
        {
          error: {
            http_code: 400,
            message: "Invalid SMS payload",
          },
        },
        400
      );
    }

    // Test mode: only the allowlisted mobile can receive OTP.
    const authorizedPhone = normalizeIranianPhone(Deno.env.get("KAVENEGAR_TEST_PHONE") ?? "");
    const receptor = normalizeIranianPhone(phone);
    if (!authorizedPhone || !receptor || receptor !== authorizedPhone) {
      console.warn("SMS rejected: unauthorized test phone");
      return jsonResponse({ error: { http_code: 403, message: "SMS restricted to test phone" } }, 403);
    }

    const kavenegarUrl = new URL(
      `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`
    );

    kavenegarUrl.searchParams.set("receptor", receptor);
    kavenegarUrl.searchParams.set("token", otp);
    kavenegarUrl.searchParams.set("template", KAVENEGAR_TEMPLATE);

    const kavenegarResponse = await fetch(kavenegarUrl.toString(), {
      method: "GET",
    });

    const kavenegarResult = await kavenegarResponse.json();

    if (!kavenegarResponse.ok || Number(kavenegarResult?.return?.status) !== 200) {
      console.error("Kavenegar request failed", { httpStatus: kavenegarResponse.status, providerStatus: kavenegarResult?.return?.status });

      return jsonResponse(
        {
          error: {
            http_code: 502,
            message: "SMS delivery failed",
          },
        },
        502
      );
    }

    console.log("OTP SMS accepted by Kavenegar");

    // Send SMS Hook requires no output.
    return jsonResponse({});
  } catch (error) {
    console.error("Unexpected Send SMS Hook error", error);

    return jsonResponse(
      {
        error: {
          http_code: 500,
          message: "Unexpected SMS delivery error",
        },
      },
      500
    );
  }
});