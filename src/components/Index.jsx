import React, { Component } from 'react';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import ListGroup from "react-bootstrap/ListGroup";
import Alert from 'react-bootstrap/Alert';
import { compose } from "redux";
import { connect } from 'react-redux';
import { withFirestore, isEmpty, isLoaded } from "react-redux-firebase";
import Modal from 'react-bootstrap/Modal';
import { FaCheck, FaMapPin, FaPhone, FaGlobe } from "react-icons/fa";

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
          for (var i = 0; i < providers.length; i++) {
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

    render() {
      const { isLoading, selectedIndex } = this.state;
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
                <Col md={6}>
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
                <Col md={6}>
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

//TODO eventually change this to a working component
function ModalPopup(props) {
  // TODO change the boolean to alerts on True
  return (
    <div>

    <Modal {...props} size="lg" scrollable="True">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h3>{props.item.facilityName}</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Container>
        <Row>
          <Col md={6} style={{display:"flex", flexDirection:"Column", justifyContent:"center"}}>
            <div>
              <FaMapPin/> &nbsp;
              {props.item.address}
            </div>
            <div>
              <FaPhone/> &nbsp;
              {props.item.phoneNum}
            </div>
              {props.item.website[0] ? <div><FaGlobe /> &nbsp; {props.item.website[0]}</div> : <div></div>}
          </Col>

          <Col md={6} style={{background: "#F2F2F2", borderRadius:"17px", paddingTop: "15px", paddingBottom:"15px"}}>
            <h6 style={{ textAlign: "center" }}><b>Hours</b></h6>
            <Container>
              <Row>
                <Col style={{ display: "flex", justifyContent: "flex-end"}}>
                  <div>
                    Monday:
                  </div>
                </Col>
                <Col style={{ display: "flex", justifyContent:"flex-start"}}>
                  <div> {props.item.hours.Monday ? props.item.hours.Monday.map(function (time, index) {
                    return formatTime(props.item.hours.Monday, time, index);
                  }) : 'CLOSED'
                  }</div>
                </Col>
              </Row>

              <Row>
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div>
                    Tuesday:
                  </div>
                </Col>
                <Col style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div>{props.item.hours.Tuesday ? props.item.hours.Tuesday.map(function (time, index) {
                    return formatTime(props.item.hours.Tuesday, time, index);
                  }) : 'CLOSED'
                  }</div>
                </Col>
              </Row>

              <Row>
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div>
                  Wednesday:
                  </div>
                </Col>
                <Col style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div> {props.item.hours.Wednesday ? props.item.hours.Wednesday.map(function (time, index) {
                    return formatTime(props.item.hours.Wednesday, time, index);
                  }) : 'CLOSED'
                  } </div>
                </Col>
              </Row>

              <Row>
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div>
                   Thursday:
                  </div>
                </Col>
                <Col style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div>{props.item.hours.Thursday ? props.item.hours.Thursday.map(function (time, index) {
                    return formatTime(props.item.hours.Thursday, time, index);
                  }) : 'CLOSED'
                  }</div>
                </Col>
              </Row>

              <Row>
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div>
                    Friday:
                  </div>
                </Col>
                <Col style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div> {props.item.hours.Friday ? props.item.hours.Friday.map(function (time, index) {
                    return formatTime(props.item.hours.Friday, time, index);
                  }) : 'CLOSED'
                  } </div>
                </Col>
              </Row>

              <Row>
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div>
                    Saturday:
                  </div>
                </Col>
                <Col style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div>  {props.item.hours.Saturday ? props.item.hours.Saturday.map(function (time, index) {
                    return formatTime(props.item.hours.Saturday, time, index);
                  }) : 'CLOSED'
                  } </div>
                </Col>
              </Row>

              <Row>
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div>
                    Sunday:
                  </div>
                </Col>
                <Col style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div>{props.item.hours.Sunday ? props.item.hours.Sunday.map(function (time, index) {
                    return formatTime(props.item.hours.Sunday, time, index);
                  }) : 'CLOSED'
                  }   </div>
                </Col>
              </Row>
            </Container>

          </Col>
        </Row>

        </Container>
        <br/>

        <div>
          <h5><b>Languages Spoken</b></h5>
          <hr style={{marginTop: "0.5rem", marginBottom:"0.5rem",}}/>
          <div>
          {props.item.languages.map(function(location, index) {
            if(index != props.item.languages.length - 1){
              return <div style={{display:"inline",}}>{location}, </div>;
            } else {
              return <div style={{ display: "inline",}}>{location}</div>;
            }
          })}
          </div>
        </div>
        <br/>

        <div>
          <h5><b>Ages</b></h5>
          <hr style={{ marginTop: "0.5rem", marginBottom: "0.5rem", }}/>
          {props.item.ages.map(function (age, index) {
            if (index != props.item.ages.length - 1) {
              return <div style={{ display: "inline", }}>{age}, </div>;
            } else {
              return <div style={{ display: "inline", }}>{age}</div>;
            }
          })}
        </div>
        <br/>

        <div>
          <h5><b>Insurance Type Accepted</b></h5>
          <hr style={{ marginTop: "0.5rem", marginBottom: "0.5rem", }}/>
          {props.item.insurance.map(function (insur, index) {
            if (index != props.item.insurance.length - 1) {
              return <div style={{ display: "inline", }}>{insur}, </div>;
            } else {
              return <div style={{ display: "inline", }}>{insur}</div>;
            }
          })}
        </div>
        <br/>

        <div>
          <h5><b>Service Types</b></h5>
          <hr style={{ marginTop: "0.5rem", marginBottom: "0.5rem", }} />
          {props.item.serviceType.map(function (service, index) {
            if (index != props.item.serviceType.length - 1) {
              return <div style={{ display: "inline", }}>{service}; </div>;
            } else {
              return <div style={{ display: "inline", }}>{service}</div>;
            }
          })}
        </div>
        <br />

        <div>
          <h5><b>Therapy Types</b></h5>
          <hr style={{ marginTop: "0.5rem", marginBottom: "0.5rem", }} />
          {props.item.therapyTypes.map(function (therapy, index) {
            if (index != props.item.therapyTypes.length - 1) {
              return <div style={{ display: "inline", }}>{therapy}; </div>;
            } else {
              return <div style={{ display: "inline", }}>{therapy}</div>;
            }
          })}
        </div>
        <br />

        <div>
          <h5><b>Specializations</b></h5>
          <hr style={{ marginTop: "0.5rem", marginBottom: "0.5rem", }} />
          {props.item.specializations.map(function (special, index) {
            if (index != props.item.specializations.length - 1) {
              return <div style={{ display: "inline", }}>{special}; </div>;
            } else {
              return <div style={{ display: "inline", }}>{special}</div>;
            }
          })}
        </div>
        <br />

        {/* TODO checkmarks for EPIC and Childcare change from alerts */}
        {props.item.childcare[0] ? <h5>ChildCare Available <FaCheck/><br /></h5> : <div></div>}
        {props.item.epic[0] ? <h5>EPIC Designation <FaCheck /><br /></h5> : <div></div>}

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

function formatTime(arr, time, index) {
  if (time == null) {
    if (index != arr.length - 1) {
      return <div style={{ display: "inline", }}>CLOSED - </div>;
    } else {
      return <div style={{ display: "inline", }}>CLOSED</div>;
    }
  }
  let endtime_ending = "AM";
  time = Math.round(time/36);  //
  if (time/100 > 12) { //check if hour
    time = time - 1200;
    endtime_ending = "PM";
  }
  let timestr = time.toString()
  let timeformat = timestr.substring(0, timestr.length - 2) + ":" + timestr.substring(timestr.length - 2) + endtime_ending;
  if (index != arr.length - 1) {
    return <div style={{ display: "inline", }}>{timeformat} - </div>;
  } else {
    return <div style={{ display: "inline", }}>{timeformat}</div>;
  }
}

export default compose(
  withFirestore,
  connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase
  })))(Index)
