import React from "react";
import {
  Route,
  Switch,
  Redirect,
  useHistory
} from "react-router-dom";
import "./App.css";
import SignIn from "./login";
import Dima from "./devs/dima";
import Grisha from "./devs/olya";
import Olya from "./devs/olya";
import Registration from "./registration/registration";

function App(): JSX.Element {
  const history = useHistory();
  return (
    <div className="App">
      <Switch>
        <Route history={history} path='/sign-in' component={SignIn}/>
        <Route history={history} path='/sign-up' component={Registration}/>
        <Route history={history} path='/dima' component={Dima}/>
        <Route history={history} path='/olya' component={Olya}/>
        <Route history={history} path='/grisha' component={Grisha}/>
        <Redirect from='/' to='/sign-in'/>
      </Switch>
    </div>
  );
}

export default App;
