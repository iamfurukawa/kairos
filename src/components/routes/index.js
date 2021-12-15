import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import HomePage from '../../pages/home';

const RouteComponent = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <HomePage />
                </Route>
            </Switch>
            <Redirect to="/" />
        </Router>
    );
}

export default RouteComponent