import React, {Component, Fragment} from 'react';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import ListGroup from "react-bootstrap/ListGroup";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from "react-bootstrap/Form";
import Dropdown from 'react-bootstrap/Dropdown';
import { ButtonGroup } from 'reactstrap';
import { compose } from "redux";
import { connect } from 'react-redux';
import { withFirestore, isEmpty, isLoaded } from "react-redux-firebase";
import ProviderInfo from "./ProviderInfo";
import Modal from "react-bootstrap/Modal";
import options from "../utils/options";
import { Flipper, Flipped } from "react-flip-toolkit";

const API_KEY = "AIzaSyCS2-Xa70z_LHWyTMvyZmHqhrYNPsDprMQ";

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            isOpen: false,
            listView: true,
            isLoading: true,
            selectedIndex: 0,
            activeProviders: null,
            serviceType: [],
            specializations: [],
            ages: [],
            insurance: [],
            languages: [],
            therapyTypes: []
        };
        this.switchView = this.switchView.bind(this);
    }

    filterZipcode = async () => {
        let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=19153&key=${API_KEY}`);
        let responseJson = await response.json();

        // Handle illegal response
        let filterLat = responseJson['results'][0]['geometry']['location']['lat']
        let filterLong = responseJson['results'][0]['geometry']['location']['lng']
        var providerLat, providerLong;
        var filteredProviders = []

        this.props.providers.forEach(function(provider) {
            providerLat = provider['latitude']
            providerLong = provider['longitude']
            let distance = Math.pow(Math.abs(filterLat - providerLat), 2) + Math.pow(Math.abs(filterLong - providerLong), 2)
            filteredProviders.push({'provider': provider, 'distance': distance})
        })

        filteredProviders.sort(function(a, b) {
            return a.distance > b.distance ? 1 : -1
        })

        this.filterProviders.forEach(function () {

        })

    }
    handleInputChange = async (e) => {
        this.setState({
            activeProviders: this.props.providers
        })
        console.log(this.state.activeProviders)
        const filterName = e.target.name
        const filterVal = e.target.value

        if (e.target.type === "checkbox" && e.target.checked) {
            await this.setState({
                [filterName]: [...this.state[filterName], filterVal]
            })

        } else if(e.target.type === "checkbox" && !e.target.checked){

            await this.setState({
                [filterName]: this.state[filterName].filter(function(filter) {
                    return filter !== filterVal
                })
            })
        }

        this.filterActiveProviders(filterName)
    };

    filterActiveProviders = async (filterName) => {
      await this.setState({
        activeProviders: this.state.activeProviders.filter((filter) => {
          return filter[filterName].filter((elem) => {
            return this.state[filterName].indexOf(elem) > -1;
          }).length === this.state[filterName].length
        })
      })
    };

    // creates map and firebase
    async componentDidMount() {
        const { firestore, providers } = this.props;
        if (!isLoaded(providers)) {
            await firestore.get('providers');
        }
        this.filterZipcode()
        this.setState({ activeProviders: this.props.providers });
        this.setState({ isLoading: false });
        window.initMap = () => this.initMap(this.refs.map);
        // Asynchronously load the Google Maps script, passing in the callback reference
        // API from Penn team: AIzaSyCdmgfV3yrYNIJ8p77YEPCT8BbRQU82lJI
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCdmgfV3yrYNIJ8p77YEPCT8BbRQU82lJI&callback=initMap')
        this.setState({ isLoading: false });
    }

    initMap(mapDOMNode) {
      var mapOptions = {
        clickableIcons: false,
        zoom: 12,
        center: new google.maps.LatLng(39.9526, -75.1652),
        mapTypeId: 'roadmap',
        styles: [
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.attraction",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.medical",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "poi.medical",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "simplified"
              }
            ]
          },
          {
            "featureType": "poi.place_of_worship",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "poi.school",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "poi.school",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
      }; // styles from https://mapstyle.withgoogle.com

      // heres the svg for the point
      // <svg width="26" height="33" viewBox="0 0 26 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      // <path d="M1 12.5C1 7.5 5 1 13 1C21 1 25 7.5 25 12.5C25 21.5 17 26.3333 13 31C9 26.5 1 21.1115 1 12.5Z" fill="#F79845" stroke="white" stroke-width="2" />
      // <circle cx="13" cy="12.5" r="5" fill="white" />
      // </svg >

        var map = new google.maps.Map(mapDOMNode, mapOptions);
        var geocoder = new google.maps.Geocoder();
        // TODO: add locations from firebase: DS can obvs change but rn its [string, lat, long]
        let locations = []; //for each location ['string for onclick', num(lat), num(long)]
        let temp = [];
        const providers = this.props.providers;
        if (!isEmpty(providers)) {
          for (let i = 0; i < providers.length; i++) {
            temp = [providers[i].facilityName.toString(), providers[i].address.toString(), providers[i].latitude, providers[i].longitude];
            locations.push(temp);
          }
        }
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        // var iconMarker = {
        //   path: "M1 12.5C1 7.5 5 1 13 1C21 1 25 7.5 25 12.5C25 21.5 17 26.3333 13 31C9 26.5 1 21.1115 1 12.5Z",
        //   fill: '#F79845',
        //   fillOpacity: .6,
        //   stroke: "white",
        //   strokeWidth:"2",
        //   anchor: new google.maps.Point(0, 0),
        // }
        for (i = 0; i < locations.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][2], locations[i][3]),
            map: map,
          });

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              var contentStr = '<b>' + locations[i][0] + '</b>' + "\n <div>" + locations[i][1] + "</div>" ; //TODO more details button
              infowindow.setContent(contentStr);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
    }

    switchView() {
      this.setState({ listView: !this.state.listView });
    }

    renderDropdown(title, key) {
        return(
            <DropdownButton
                title={title}
                variant="light"
                alignLeft
                style ={{ marginRight: 5 }}>
                {options[key].map((item, index) =>
                    <Form.Check
                        as={Dropdown.Item}
                        name={key}
                        key={index}
                        onChange={this.handleInputChange}
                        type="checkbox"
                        value={item.value}
                        label={item.label} />
                )}
            </DropdownButton>
        )
    }

    render() {
    const { isLoading, data, selectedIndex, showModal, listView } = this.state;
    const providers = this.state.activeProviders;

    if (isLoading && !isLoaded(providers))
        return <div className="spinner" />;

    return (
        <Fragment>
            <NavBar/>
            <div>
                <div className="row-spaced">
                    <ButtonGroup className="ml-2">
                        {this.renderDropdown("Languages", "languages")}
                        {this.renderDropdown("Service Type", "serviceType")}
                        {this.renderDropdown("Specializations", "specializations")}
                        {this.renderDropdown("Ages", "ages")}
                        {this.renderDropdown("Insurance", "insurance")}
                        {this.renderDropdown("Therapy Types", "therapyTypes")}
                    </ButtonGroup>
                    <Button variant="primary" onClick={this.switchView} className="switch-view-button">
                        {this.state.listView ? "Hide Map" : "Show Map"}
                    </Button>
                </div>
                <Flipper flipKey={listView}>
                    <div className="row-nowrap">
                    <Flipped flipId="list">
                        <div style={{ width: listView ? '50%' : '100%' }}>
                            <ListGroup variant="flush">
                                {
                                    !isEmpty(providers) &&
                                    providers.map((item, index) =>
                                        <ListGroup.Item
                                            href={item.id}
                                            key={index}
                                            onClick={() => this.setState({ selectedIndex: index, showModal: true})}
                                            active={selectedIndex === index}>
                                            <Flipped key={index} inverseFlipId="list">
                                                <div>
                                                    <h5>{item.facilityName}</h5>
                                                    <p className="list-view-text-body">{item.address[0]}</p>
                                                </div>
                                            </Flipped>
                                        </ListGroup.Item>
                                    )
                                }
                            </ListGroup>
                            <div>
                            {
                                providers && providers[selectedIndex] &&
                                <Modal
                                    show={showModal}
                                    onHide={() => this.setState({showModal: false})}
                                    size="lg"
                                    scrollable>
                                    <Modal.Header className="modal-header" closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                            <h2><b>{providers[selectedIndex].facilityName}</b></h2>
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body className="modal-body">
                                        <ProviderInfo item={providers[selectedIndex]} />
                                    </Modal.Body>
                                </Modal>
                            }
                            </div>
                        </div>
                    </Flipped>
                    <Flipped flipId="map">
                        <div style={{ width: '50%', marginRight: listView ? 0 : -1000, }}>
                            <div
                                ref="map" id="map" className="map-view"
                                style={{ height: '85vh' }} />
                        </div>
                    </Flipped>
                    </div>
                </Flipper>
            </div>
        </Fragment>);
    }

}

export default compose(
  withFirestore,
  connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase
  })))(Index);
