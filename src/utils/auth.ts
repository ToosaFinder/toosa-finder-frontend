import Cookies from "js-cookie";
import {
  Credentials,
  ErrorBody,
  LoginResponseBody,
  RegistrationCredentials,
  RestorePasswordCredentials,
  SetPasswordCredentials,
} from "./interfaces";
import api from "./api";

const ACCESS_TOKEN_COOKIE = "token";
const authUrls = [
  "user/login",
  "user/registration",
  "user/restore-password",
  "user/set-password",
  "user/email-confirmed",
];

export const isAuthUrl = (url: string) => {
  return authUrls.some((authUrl) => authUrl === url);
};

export async function login(credentials: Credentials): Promise<true | string> {
  return api()
    .login(credentials)
    .then((resp) => {
      const { response, code } = resp;
      if (code === 200) {
        const { accessToken } = response as LoginResponseBody;
        Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, { expires: 3600 });
        return true;
      } else {
        const { error } = response as ErrorBody;
        return error;
      }
    });
}

export async function registration(
  credentials: RegistrationCredentials
): Promise<true | string> {
  return api()
    .registration(credentials)
    .then((resp) => {
      const { response, code } = resp;
      if (code === 200) {
        return true;
      } else {
        const { error } = response as ErrorBody;
        return error;
      }
    });
}

export function isLogged(): boolean {
  const jwt = Cookies.get(ACCESS_TOKEN_COOKIE);
  return typeof jwt != "undefined";
}

export async function forgotPassword(
  email: RestorePasswordCredentials
): Promise<boolean> {
  const { code } = await api().forgotPassword(email);
  if (code === 200) {
    console.log(`forgot password for email ${email}`);
    return true;
  }
  return false;
}

export async function createNewPassword(
  credentials: SetPasswordCredentials
): Promise<boolean> {
  const { code } = await api().createNewPassword(credentials);
  if (code === 200) {
    console.log(`new password for ${credentials.password}`);
    return true;
  }
  return false;
}

export async function confirmEmail(emailToken: string): Promise<true | string> {
  return api()
    .confirmEmail(emailToken)
    .then((resp) => {
      const { response, code } = resp;
      if (code === 200) {
        return true;
      } else {
        const { error } = response as ErrorBody;
        return error;
      }
    });
}

export function logout(): void {
  Cookies.remove(ACCESS_TOKEN_COOKIE);
}
