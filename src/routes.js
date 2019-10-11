import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppWrapper from './components/AppWrapper';
import App from './components/App';
import ProviderRoutes, { providerRoute } from './components/ProviderRoutes';

const routes = (
    <AppWrapper>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path="/providers" component={ProviderRoutes} />
        </Switch>
    </AppWrapper>
);

export { routes };
