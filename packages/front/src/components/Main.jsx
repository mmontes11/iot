import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Navbar from "containers/Navbar";
import Things from "containers/Things";
import Stats from "containers/Stats";
import Data from "containers/Data";
import RealTime from "containers/RealTime";
import { TYPE, OBSERVATION, GROUP_BY, THING } from "constants/params";

const Main = () => (
  <div className="has-navbar-fixed-top">
    <Navbar />
    <main>
      <Switch>
        <Route path="/things/:thing" component={Things} />
        <Route path="/things" component={Things} />
        <Route path={`/stats/:${TYPE}/:${OBSERVATION}`} component={Stats} />
        <Route path="/stats" component={Stats} />
        <Route path={`/data/:${TYPE}/:${OBSERVATION}/:${GROUP_BY}?`} component={Data} />
        <Route path="/data" component={Data} />
        <Route path={`/real-time/:${THING}/:${TYPE}`} component={RealTime} />
        <Route path="/real-time" component={RealTime} />
        <Route render={() => <Redirect to="/things" />} />
      </Switch>
    </main>
  </div>
);

export default Main;
