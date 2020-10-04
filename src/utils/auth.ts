import api, { Credentials } from "./api";
import Cookies from "js-cookie";

export async function login(credentials: Credentials): Promise<void> {
  const { response, code } = await api().login(credentials);
  if (code === 200) {
    const { jwt, refreshToken } = response;
    console.log(`JWT ${jwt} Refresh ${refreshToken}`);
    api().jwt = jwt;
    api().refreshToken = refreshToken;
    Cookies.set("token", jwt, { expires: 3600 });
    Cookies.set("rtoken", refreshToken, { expires: 3600 });
  }
}

export function isLogged(): boolean {
  const jwt = Cookies.get("token");
  const rtoken = Cookies.get("rtoken");
  return typeof jwt != "undefined" && typeof rtoken != "undefined";
}

export function logout(): void {
  Cookies.remove("token");
  Cookies.remove("rtoken");
}
