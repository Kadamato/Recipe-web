import { Google } from "arctic";
// import { Facebook } from "arctic";

const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const googleRedirectURI = process.env.GOOGLE_REDIRECT_URI || "";

const clientId = process.env.FACEBOOK_CLIENT_ID || "";
const clientSecret = process.env.FACEBOOK_CLIENT_SECRET || "";
const redirectURI = process.env.FACEBOOK_REDIRECT_URI || "";

export const google = new Google(
  googleClientId,
  googleClientSecret,
  googleRedirectURI
);

// export const facebook = new Facebook(clientId, clientSecret, redirectURI);
