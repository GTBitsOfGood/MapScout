import React, { Component } from 'react';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import ListGroup from "react-bootstrap/ListGroup";
import { compose } from "redux";
import { connect } from 'react-redux';
import { withFirestore, isEmpty, isLoaded } from "react-redux-firebase";
import Modal from 'react-bootstrap/Modal';
// import ModalPopup from './ModalPopup'

class Index extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: false,
      listView: true,
      isLoading: true,
      selectedIndex: 0,
      showModal: false,
    };
    this.switchView = this.switchView.bind(this);
  }

    // creates map and firebase
    async componentDidMount() {
        const { firestore, providers } = this.props;
        if (!isLoaded(providers)) {
          await firestore.get('providers');
        }
        window.initMap = () => this.initMap(this.refs.map);
        // Asynchronously load the Google Maps script, passing in the callback reference
        // API from Penn team: AIzaSyCdmgfV3yrYNIJ8p77YEPCT8BbRQU82lJI
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCdmgfV3yrYNIJ8p77YEPCT8BbRQU82lJI&callback=initMap')
        this.setState({ isLoading: false });
    }

    initMap(mapDOMNode) {
      var mapOptions = {
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
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
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
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
      }; // styles from https://mapstyle.withgoogle.com
        var map = new google.maps.Map(mapDOMNode, mapOptions);
        var geocoder = new google.maps.Geocoder();
        // TODO: add locations from firebase: DS can obvs change but rn its [string, lat, long]
        let locations = []; //for each location ['string for onclick', num(lat), num(long)]
        let temp = [];
        const providers = this.props.providers;
        if (!isEmpty(providers)) {
          for (var i = 0; i < providers.length; i++) {
            console.log([providers[i].id, providers[i].latitude, providers[i].longitude]);
            temp = [providers[i].facilityName.toString(), providers[i].latitude, providers[i].longitude];
            locations.push(temp);
          }
        }
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        for (i = 0; i < locations.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
          });

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(locations[i][0]);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
    }

    switchView() {
      this.setState({ listView: !this.state.listView });
    }

    render() {
      const { isLoading, data, selectedIndex } = this.state;
      const providers = this.props.providers;
      const { showModal } = this.state;

      if (isLoading && !isLoaded(providers))
        return <div style={{ width: '100%' }}>
          <div className="spinner" />
      </div>;
      return (
        <div>
          <NavBar/>
            <style>
            {`
              .container-fluid {
                overflow: hidden;
                width: 95%;
                height:calc(100vh - 56px);
                height:-moz-calc(100vh - 56px);
                height:-webkit-calc(100vh - 56px);
                padding-left: 15px;
                padding-right: 15px;
              }
            `}
            </style>
            <Container fluid="True">
            {/* toggle switch button */}
            <Button variant="primary" onClick={this.switchView} style={{
              marginTop:"15px",
              marginLeft:"15px",
              marginRight:"15px",
              marginBottom:"15px",
            }}>
                {this.state.listView ? "Hide Map" : "Show Map"}
            </Button>
              <Row className="mh-100" style = {{
                height: "85%",
                marginLeft: "0px",
                marginRight: "0px",
              }}>
                {/* List View*/}
                <Col>
                <ListGroup variant="flush">
                  {
                    !isEmpty(providers) &&
                    providers.map((item, index) =>
                      <ListGroup.Item
                        href={item.id}
                        onClick={() => this.setState({ selectedIndex: index, showModal: true})}
                        active={selectedIndex === index}>
                        <h5>{item.facilityName}</h5>
                        <p style={{marginBottom:"0"}}>{item.address}</p>
                      </ListGroup.Item>
                    )
                  }
                </ListGroup>
                  <div>
                    {
                      providers[selectedIndex] && providers &&
                      <ModalPopup show={showModal} onHide={() => this.setState({showModal: false})} item={providers[selectedIndex]} />
                    }
                  </div>
                </Col>

                {/* Map View */}
                <Collapse appear={true} in={this.state.listView}>
                <Col>
                  <div ref="map" id="map" style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}></div>
                </Col>
                </Collapse>
              </Row>
            </Container>
        </div>
      )
    }

}

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}

function ModalPopup(props) {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.item.facilityName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default compose(
  withFirestore,
  connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase
  })))(Index)
