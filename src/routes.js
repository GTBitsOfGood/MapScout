import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppWrapper from './components/AppWrapper';
import App from './components/App';
import About from './components/About';

const routes = (
    <AppWrapper>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/about' component={About} />
        </Switch>
    </AppWrapper>
);

export { routes };
