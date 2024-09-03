import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import Form from "react-bootstrap/Form";
import { GOOGLE_API_KEY } from "../../config/keys";

type GoogleSuggestProps = {
    value: string;
    update: (arg0: string) => void;
};

const GoogleSuggest = ({ value, update }: GoogleSuggestProps) => {
    const [search, setSearch] = useState("");
    const [val, setVal] = useState(value);

    function handleInputChange(e) {
        setSearch(e.target.value);
        setVal(e.target.value);
        update(e.target.value);
    }

    function handleSelectSuggest(suggest) {
        setSearch("");
        setVal(suggest.description);
        update(suggest.description);
    }

    return (
        <ReactGoogleMapLoader
            params={{
                key: GOOGLE_API_KEY,
                libraries: "places,geocode",
            }}
            render={(googleMaps) =>
                googleMaps && (
                    <ReactGooglePlacesSuggest
                        autocompletionRequest={{ input: search }}
                        googleMaps={googleMaps}
                        // onSelectSuggest={handleSelectSuggest.bind(this)}
                        customRender={(prediction) => (
                            <div
                                onClick={() => handleSelectSuggest(prediction)}
                            >
                                {prediction
                                    ? prediction.description
                                    : "No results text"}
                            </div>
                        )}
                    >
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                placeholder="123 Main St."
                                value={val}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </ReactGooglePlacesSuggest>
                )
            }
        />
    );
};

GoogleSuggest.propTypes = {
    googleMaps: PropTypes.object,
    update: PropTypes.func,
};

export default GoogleSuggest;
