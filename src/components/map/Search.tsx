import classNames from "classnames";
import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import localizationStrings from "utils/Localization";

const getWidth = () =>
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

const Search = ({ filterProviders, primaryColor }) => {
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [width, setWidth] = useState(getWidth());
    const isDesktop = width > 768;

    let { searchZipcode, searchProviderName, hideLabel, showLabel } = localizationStrings;


    return (
        <div style={{ width: "80%" }}>
            <div
                className={classNames("row-spaced", "ml-2", "mb-3", "pt-3", {
                    "mr-2": !isDesktop,
                })}
            >
                <div className="w-75">
                    <Row noGutters={!isDesktop}>
                        <Col>
                            <Form.Control
                                placeholder={searchZipcode}
                                itemType="zipcode"
                                value={searchZip}
                                onChange={filterProviders}
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                placeholder={searchProviderName}
                                itemType="search"
                                onChange={filterProviders}
                                value={searchName}
                            />
                        </Col>
                    </Row>
                </div>
                {/* <Button */}
                {/*     variant="primary" */}
                {/*     style={{ */}
                {/*         borderColor: primaryColor, */}
                {/*         backgroundColor: primaryColor, */}
                {/*     }} */}
                {/*     onClick={switchView} */}
                {/*     className="switch-view-button" */}
                {/* > */}
                {/*     {isDesktop */}
                {/*         ? defaultView */}
                {/*             ? hideLabel */}
                {/*             : showLabel */}
                {/*         : defaultView */}
                {/*         ? showLabel */}
                {/*         : hideLabel} */}
                {/* </Button> */}
            </div>
        </div>
    );
};

export default Search;
