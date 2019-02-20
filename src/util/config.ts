import { CryptoService } from "../lib/crypto_service";

const requireENV = (name: string, deflt?: string): string => {
  let env = process.env[name] || "";
  if (env === "") {
    if (deflt) {
      env = deflt;
    } else {
      throw new Error(`Environment ${name} must be set`);
    }
  }
  return env;
};

const port = parseInt(requireENV("PORT", "3000"), 10);
const ssoAPI = requireENV("SSO_API");
const ssoName = requireENV("SSO_NAME");
const production = "production" === requireENV("NODE_ENV", "development");

const crypto = CryptoService.create(
  requireENV("PRIVATE_KEY"),
  requireENV("SSO_PUBLIC_KEY"),
);

export const config = {
  port,
  ssoAPI,
  ssoName,
  production,
  crypto,
};
