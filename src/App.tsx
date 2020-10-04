import React from "react";
import { Switch, Redirect } from "react-router-dom";
import SignIn from "./login";
import Registration from "./registration/registration";
import PrivateRoute from "./utils/private_route";
import UnloggedRoute from "./utils/unlogged_route";
import Home from "./home";

function App(): JSX.Element {
  return (
    <div>
      <Switch>
        <UnloggedRoute path="/sign-in" component={SignIn} exact />
        <UnloggedRoute path="/sign-up" component={Registration} exact />
        <PrivateRoute path="/home" component={Home} />
        <Redirect from="/" to="/sign-in" exact />
      </Switch>
    </div>
  );
}

export default App;
