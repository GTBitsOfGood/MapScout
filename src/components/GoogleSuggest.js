import PropTypes from "prop-types"
import React from "react"
import ReactGoogleMapLoader from "react-google-maps-loader"
import ReactGooglePlacesSuggest from "react-google-places-suggest"
import Form from "react-bootstrap/Form";

const API_KEY = "AIzaSyCS2-Xa70z_LHWyTMvyZmHqhrYNPsDprMQ";

class GoogleSuggest extends React.Component {
    state = {
        search: "",
        value: "",
    };

    handleInputChange(e) {
        this.setState({search: e.target.value, value: e.target.value})
    }

    handleSelectSuggest(suggest) {
        this.setState({search: "", value: suggest.description})
    }

    render() {
        const {search, value} = this.state;
        return (
            <ReactGoogleMapLoader
                params={{
                    key: API_KEY,
                    libraries: "places,geocode",
                }}
                render={googleMaps =>
                    googleMaps && (
                        <ReactGooglePlacesSuggest
                            autocompletionRequest={{input: search}}
                            googleMaps={googleMaps}
                            // onSelectSuggest={this.handleSelectSuggest.bind(this)}
                            customRender={prediction => {
                                return (
                                    <div onClick={() => this.handleSelectSuggest(prediction)}>
                                        {prediction
                                            ? prediction.description
                                            : "No results text"}
                                    </div>
                                )
                            }}
                        >
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control placeholder="123 Main St." value={value} onChange={this.handleInputChange.bind(this)}/>
                            </Form.Group>
                        </ReactGooglePlacesSuggest>
                    )
                }
            />
        )
    }
}

GoogleSuggest.propTypes = {
    googleMaps: PropTypes.object,
};

export default GoogleSuggest;
