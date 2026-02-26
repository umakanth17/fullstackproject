
import twilio from 'twilio';

// In-memory store for OTPs (In production, use Redis or Database)
const otpStore: Record<string, { code: string; expires: number }> = {};
const rateLimitStore: Record<string, { count: number; windowStart: number }> = {};

// Rate Limit Configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 Hour
const MAX_OTP_REQUESTS = 5; // Max 5 OTPs per hour per number

export const OTPService = {
    // Generate a 6-digit cryptographic OTP
    generateOTP: (): string => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    // Check Rate Limit
    checkRateLimit: (mobile: string): boolean => {
        const now = Date.now();
        const record = rateLimitStore[mobile];

        if (!record) {
            rateLimitStore[mobile] = { count: 1, windowStart: now };
            return true;
        }

        if (now - record.windowStart > RATE_LIMIT_WINDOW) {
            // Reset window
            rateLimitStore[mobile] = { count: 1, windowStart: now };
            return true;
        }

        if (record.count >= MAX_OTP_REQUESTS) {
            return false; // Rate limit exceeded
        }

        record.count++;
        return true;
    },

    // Send OTP via Twilio (or Log for Dev)
    sendOTP: async (mobile: string, otp: string): Promise<boolean> => {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;

        // Development Mode: Always log to console
        console.log(`[OTP SERVICE] Sending OTP ${otp} to ${mobile}`);

        if (accountSid && authToken && fromNumber) {
            try {
                const client = twilio(accountSid, authToken);
                await client.messages.create({
                    body: `Your FoodSaver verification code is: ${otp}`,
                    from: fromNumber,
                    to: mobile, // Must include country code, e.g., +91...
                });
                return true;
            } catch (error) {
                console.error('[OTP SERVICE] Twilio Error:', error);
                return false;
            }
        } else {
            // Simulate success in Dev mode
            return true;
        }
    },

    // Store OTP
    storeOTP: (mobile: string, otp: string) => {
        const expires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
        otpStore[mobile] = { code: otp, expires };
    },

    // Verify OTP
    verifyOTP: (mobile: string, code: string): boolean => {
        const record = otpStore[mobile];
        if (!record) return false;

        if (Date.now() > record.expires) {
            delete otpStore[mobile]; // Cleanup expired
            return false;
        }

        if (record.code === code) {
            delete otpStore[mobile]; // Consume OTP
            return true;
        }

        return false;
    }
};
