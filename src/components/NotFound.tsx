import React from "react";

const NotFound = () => (
    <div className="bg-white" style={{ height: "100vh" }}>
        <div className="text-center">
            <div className="not-found-oops">Oops!</div>
            <div className="mb-4" style={{ fontSize: "36px" }}>
                We can&#39;t seem to find the page you&#39;re looking for
            </div>
            <div style={{ fontSize: "20px" }}>Error Code: 404</div>
        </div>
    </div>
);

export default NotFound;
