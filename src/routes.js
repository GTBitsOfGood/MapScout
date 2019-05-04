import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppWrapper from './components/app';
import App from './components/App.jsx';
import About from './components/About.jsx';

const routes = (
    <AppWrapper>
        <Switch>
            // <Route exact path='/' component={About} />
            // <Route path='/about' component={App} />
        </Switch>
    </AppWrapper>
);

export { routes };
