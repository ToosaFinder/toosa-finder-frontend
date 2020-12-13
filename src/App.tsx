import React from "react";
import { Redirect, Switch } from "react-router-dom";
import SignIn from "./open_pages/login/login";
import Registration from "./open_pages/registration/registration";
import PrivateRoute from "./utils/private_route";
import UnloggedRoute from "./utils/unlogged_route";
import Home from "./open_pages/home";
import ForgotPassword from "./open_pages/forgot_password/forgot_password";
import CreatePassword from "./open_pages/forgot_password/create_password";
import ErrorPage from "./open_pages/confirm_email/error_page";
import ConfirmEmail from "./open_pages/confirm_email/confirm_email";
import EventCreation from "./open_pages/event_creation/event_creation";
import ManagedEventsForAdmin from "./open_pages/managed_events_admin/managed_events_admin";
import ParticipatedEvents from "./open_pages/participated_events/participated_events";

function App(): JSX.Element {
  return (
    <div>
      <Switch>
        <UnloggedRoute path="/sign-in" component={SignIn} exact />
        <UnloggedRoute path="/restore" component={ForgotPassword} exact />
        <UnloggedRoute
          path="/user/restore-password/:restoreToken"
          component={CreatePassword}
        />
        <UnloggedRoute path="/sign-up" component={Registration} exact />
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/event-creation" component={EventCreation} />
        <PrivateRoute
          path="/administrated-events"
          component={ManagedEventsForAdmin}
        />
        <PrivateRoute
          path="/participated-events"
          component={ParticipatedEvents}
        />
        <Redirect from="/" to="/sign-in" exact />
        <UnloggedRoute
          path="/user/confirm-email/:emailToken"
          component={ConfirmEmail}
        />
        <UnloggedRoute path="/error-page" component={ErrorPage} />
      </Switch>
    </div>
  );
}

export default App;
