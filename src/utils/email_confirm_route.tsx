import * as React from "react";
import { Redirect, RouteProps } from "react-router-dom";
import { confirmEmail } from "./auth";
import usePromise from "react-promise";

/**
 * Роут для подтверждения почты.
 */
export default function EmailConfirmRoute(props: RouteProps): JSX.Element {
  console.log(props.location.pathname);

  const pathname = props.location.pathname.toString();
  const splittedPathname = pathname.split("/");
  const emailToken = splittedPathname[splittedPathname.length - 1];
  console.log(emailToken);

  const { value, loading } = usePromise<boolean>(confirmEmail(emailToken));
  if (loading) {
    return null;
  }

  return value ? <Redirect to="/sign-in" /> : <Redirect to="/error-page" />;
}
