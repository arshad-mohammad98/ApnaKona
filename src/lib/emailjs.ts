import emailjs from "@emailjs/browser";

/**
 * SECURITY NOTE:
 * In this client-side hackathon implementation, OTP generation and validation
 * occur in the frontend for rapid prototyping with EmailJS.
 *
 * In a production environment, OTP generation, rate-limiting, and verification
 * must be strictly handled server-side (e.g., via a Supabase Edge Function or a
 * protected backend API route) to prevent client-side inspection or network tampering.
 */

export const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
export const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "otp_verification_template";
export const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

/**
 * Generate a cryptographically strong 6-digit numeric OTP code (100000 - 999999)
 */
export function generateOtp(): string {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const code = 100000 + (array[0] % 900000);
    return code.toString();
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export interface SendOtpParams {
  to_email: string;
  user_name: string;
  otp_code: string;
}

export interface SendOtpResult {
  success: boolean;
  message?: string;
  isMock?: boolean;
}

/**
 * Sends a 6-digit OTP verification email to the user via EmailJS
 */
export async function sendOtpEmail({
  to_email,
  user_name,
  otp_code,
}: SendOtpParams): Promise<SendOtpResult> {
  // Check if EmailJS credentials are configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn(
      `[EmailJS] Missing NEXT_PUBLIC_EMAILJS_SERVICE_ID or NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in environment variables.`
    );
    console.info(
      `[EmailJS - Development / Demo Mode] Generated OTP for ${to_email}: ${otp_code}`
    );
    return {
      success: true,
      isMock: true,
      message: `Demo Mode: Verification OTP is ${otp_code}. (Configure EmailJS keys in .env.local to send real emails).`,
    };
  }

  try {
    const templateParams = {
      to_email,
      user_name,
      otp_code,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (response.status === 200) {
      return { success: true };
    } else {
      return {
        success: false,
        message: `Email delivery failed with status ${response.status}: ${response.text}`,
      };
    }
  } catch (error: unknown) {
    console.error("[EmailJS Error]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send verification email.";
    return {
      success: false,
      message: errorMessage,
    };
  }
}
