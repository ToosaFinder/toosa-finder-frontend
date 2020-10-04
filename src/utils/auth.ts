import api, { Credentials } from "./api";
import Cookies from "js-cookie";

const ACCESS_TOKEN_COOKIE = "token";
const REFRESH_TOKEN_COOKIE = "rtoken";

export async function login(credentials: Credentials): Promise<void> {
  const { response, code } = await api().login(credentials);
  if (code === 200) {
    const { accessToken, refreshToken } = response;
    console.log(`JWT ${accessToken} Refresh ${refreshToken}`);
    api().accessToken = accessToken;
    api().refreshToken = refreshToken;
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, { expires: 3600 });
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, { expires: 3600 });
  }
}

export function isLogged(): boolean {
  const jwt = Cookies.get(ACCESS_TOKEN_COOKIE);
  const rtoken = Cookies.get(REFRESH_TOKEN_COOKIE);
  return typeof jwt != "undefined" && typeof rtoken != "undefined";
}

export function logout(): void {
  Cookies.remove(ACCESS_TOKEN_COOKIE);
  Cookies.remove(REFRESH_TOKEN_COOKIE);
}
