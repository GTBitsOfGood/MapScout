import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { store, history } from "./store";
import { routes } from "./routes";
import "./assets/styles/style";

const getRoutes = async () => {
    const strRoutes = await store.firestore
        .collection("teams")
        .get()
        .then((doc) => {
            const arr = [];
            doc.forEach((team) => {
                arr.push("/" + team.id);
            });
            return arr;
        });

    // render the main component
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                {routes(strRoutes)}
            </ConnectedRouter>
        </Provider>,
        document.getElementById("app")
    );
};

getRoutes();
