import api, { Credentials } from "./api";
import Cookies from "js-cookie";

const ACCESS_TOKEN_COOKIE = "token";
const REFRESH_TOKEN_COOKIE = "rtoken";

export async function login(credentials: Credentials): Promise<boolean> {
  const { response, code } = await api().login(credentials);
  if (code === 200) {
    const { accessToken, refreshToken } = response;
    console.log(`JWT ${accessToken} Refresh ${refreshToken}`);
    api().accessToken = accessToken;
    api().refreshToken = refreshToken;
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, { expires: 3600 });
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, { expires: 3600 });
    return true;
  }
  return false;
}

export function isLogged(): boolean {
  const jwt = Cookies.get(ACCESS_TOKEN_COOKIE);
  const rtoken = Cookies.get(REFRESH_TOKEN_COOKIE);
  return typeof jwt != "undefined" && typeof rtoken != "undefined";
}

export async function forgotPassword(email: string): Promise<boolean> {
  const { code } = await api().forgotPassword(email);
  if (code === 200) {
    console.log(`forgot password for email ${email}`);
    return true;
  }
  return false;
}

export async function createNewPassword(
  password: string,
  token: string
): Promise<boolean> {
  const { code } = await api().createNewPassword(password, token);
  if (code === 200) {
    console.log(`new password for ${password}`);
    return true;
  }
  return false;
}

export async function confirmEmail(emailToken: string): Promise<boolean> {
  const { code } = await api().confirmEmail(emailToken);
  if (code === 200) {
    console.log(`successful email confirmation`);
    return true;
  }
  console.log(`228 email confirmation`);
  return false;
}

export function logout(): void {
  Cookies.remove(ACCESS_TOKEN_COOKIE);
  Cookies.remove(REFRESH_TOKEN_COOKIE);
}
