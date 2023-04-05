import { TourProvider } from "@reactour/tour";
import * as Sentry from "@sentry/react";
import "babel-polyfill";
import { ConnectedRouter } from "connected-react-router";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import steps from "tutorial/steps";
import "./assets/styles/style";
import { SENTRY_API_KEY } from "./config/keys";
import routes from "./routes";
import { history, store } from "./store";
import { TeamDocProps } from "./types/firestore";

Sentry.init({
    dsn: SENTRY_API_KEY,
});

const getRoutes = async () => {
    const strRoutes = await store.firestore
        .collection("teams")
        .get()
        .then((doc: TeamDocProps[]) => {
            const arr = [];
            doc.forEach((team: TeamDocProps) => {
                arr.push(`/${team.id}`);
            });
            return arr;
        });

    // render the main component
    ReactDOM.render(
        <TourProvider steps={steps} showBadge={false} startAt={0}>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    {routes(strRoutes)}
                </ConnectedRouter>
            </Provider>
        </TourProvider>,
        document.getElementById("app")
    );
};

getRoutes();
