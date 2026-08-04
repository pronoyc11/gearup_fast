export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "https://gearup-backend-gold.vercel.app",
};
