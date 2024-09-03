import React from "react";
import * as Sentry from "@sentry/react";
import LazyLoad from "react-lazy-load";
import Button from "react-bootstrap/Button";
import image from "../../assets/img/error.jpg";

function FallbackComponent() {
    function refresh() {
        window.location.reload();
    }
    return (
        <div id="fallback-root">
            <LazyLoad debounce={false}>
                <img id="fallback-image" src={image} alt="" />
            </LazyLoad>
            <div id="fallback-action-container">
                <h2>
                    We'll get to the bottom of this!{" "}
                    <span role="img" aria-label="muscle">
                        💪
                    </span>
                </h2>
                <br />
                <Button style={{ width: 200 }} onClick={refresh}>
                    Refresh
                </Button>
            </div>
        </div>
    );
}

function SentryWrapper({ children }) {
    return (
        <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
            {children}
        </Sentry.ErrorBoundary>
    );
}

export default SentryWrapper;
