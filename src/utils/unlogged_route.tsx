import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { isLogged } from "./auth";

/**
 * Роут, на который можно перейти, только если пользователь не авторизован.
 */
export default function UnloggedRoute(props: RouteProps): JSX.Element {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={(routeProps): React.ReactNode =>
        !isLogged() ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: "/home",
              state: { from: routeProps.location },
            }}
          />
        )
      }
    />
  );
}
