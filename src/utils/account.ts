import * as OTPAuth from "otpauth";

export const getAccountPassword = (secret: string, userId: string) => {
  return `${secret}_${userId}`
}

export const generateTOTP = (secret: string, userId: string) => {
  return new OTPAuth.TOTP({
    issuer: "Harmony One Wallet",
    label: userId,
    algorithm: "SHA1",
    digits: 6,
    period: 60 * 5,
    secret,
  });
}
