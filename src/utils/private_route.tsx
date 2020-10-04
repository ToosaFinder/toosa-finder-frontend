import * as React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { isLogged } from "./auth";

/**
 * Роут, на который можно перейти, только если пользователь авторизован.
 */
export default function PrivateRoute(props: RouteProps): JSX.Element {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={(routeProps): React.ReactNode =>
        isLogged() ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: routeProps.location },
            }}
          />
        )
      }
    />
  );
}
