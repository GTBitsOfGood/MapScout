import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppWrapper from './components/app';
import App from './components/index';
import About from './components/about';

const routes = (
    <AppWrapper>
        <Switch>
            <Route exact path='/' component={App} />
            <Route exact path='/about' component={About} />
        </Switch>
    </AppWrapper>
);

export { routes };
