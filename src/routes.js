import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppWrapper from './components/app';
import App from './components/index';

const routes = (
    <AppWrapper>
        <Switch>
            <Route exact path='/' component={App} />
        </Switch>
    </AppWrapper>
);

export { routes };
