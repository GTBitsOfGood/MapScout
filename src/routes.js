import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';
import AppWrapper from './components/AppWrapper';
import App from './components/App';
import ProviderRoutes, { providerRoute } from './components/ProviderRoutes';

const routes = (
    <AppWrapper>
        <HashRouter basename='/'>
            <Switch>
                <Route exact path='/' component={App} />
                <Route path="/providers" component={ProviderRoutes} />
            </Switch>
        </HashRouter>
    </AppWrapper>
);

export { routes };
