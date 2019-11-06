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

    handleFilterChange = (event) => {
        this.setState({filterValue: event.target.value});
    };

    handleInputChange = async (e) => {
        this.setState({
            activeProviders: this.props.providers
        });
        console.log(this.state.activeProviders);
        const filterName = e.target.name;
        const filterVal = e.target.value;

        if (e.target.type === "checkbox" && e.target.checked) {
            this.setState({[filterName]: [...this.state[filterName], filterVal]})
        } else if (e.target.type === "checkbox" && !e.target.checked) {
            this.setState({[filterName]:
                    this.state[filterName].filter(function(filter) {
                        return filter !== filterVal
                    })
            })
        }
        this.filterActiveProviders(filterName)
    };

    filterActiveProviders = async (filterName) => {
      this.setState({
        activeProviders: this.state.activeProviders.filter((filter) => {
          return filter[filterName].filter((elem) => {
            return this.state[filterName].indexOf(elem) > -1;
          }).length === this.state[filterName].length
        })
      })
    };


    filterFirestore = async () => {
        console.log(this.props.providers);
        let firestore = this.props.firestore;
        await firestore.get({collection: 'providers', where: ['languages', 'array-contains', this.state.filterValue]}
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(doc.id)
                });
            }));
        this.setState({ activeProviders: this.props.providers })
    };

    // creates map and firebase
    async componentDidMount() {
        const { firestore, providers } = this.props;
        if (!isLoaded(providers)) {
            await firestore.get('providers');
        }
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

    render() {
    const { isLoading, data, selectedIndex, showModal } = this.state;
    const providers = this.state.activeProviders;

    if (isLoading && !isLoaded(providers))
        return <div className="spinner" />;

    return (
        <Fragment>
            <NavBar/>
            <Container className="view-container" fluid>
                <Button variant="primary" onClick={this.switchView} className="switch-view-button">
                    {this.state.listView ? "Hide Map" : "Show Map"}
                </Button>
                <Row>
                    <div>
                        <ButtonGroup style ={{
                            marginLeft:"15px",
                            marginBottom:"10px"
                        }}>
                            <DropdownButton id="dropdown-basic-button" title="Languages" style ={{
                                marginRight:"5px"
                            }}>
                                <Form.Check
                                    name="languages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="English"
                                    label="English" />
                                <Form.Check
                                    name="languages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Spanish"
                                    label="Spanish" />
                                <Form.Check
                                    name="languages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Portugese"
                                    label="Portugese" />
                                <Form.Check
                                    name="languages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Kurdish"
                                    label="Kurdish" />
                                <Form.Check
                                    name="languages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Mandarin"
                                    label="Mandarin" />
                                <Form.Check
                                    name="languages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Russian"
                                    label="Russian" />
                                <Form.Check
                                    name="languages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="ASL"
                                    label="ASL" />
                                <Form.Check
                                    name="languages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Creole"
                                    label="Creole" />
                                <Form.Check
                                    name="languages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Other"
                                    label="Other" />
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" title="Service Type" style ={{
                                marginRight:"5px"
                            }}>
                                <Form.Check
                                    name="serviceType"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Outpatient Services"
                                    label="Outpatient Services" />
                                <Form.Check
                                    name="serviceType"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Residential Programs"
                                    label="Residential Programs" />
                                <Form.Check
                                    name="serviceType"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Parent/Caregiver Services"
                                    label="Parent/Caregiver Services" />
                                <Form.Check
                                    name="serviceType"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="School-Based Services"
                                    label="School-Based Services" />
                                <Form.Check
                                    name="serviceType"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Foster & Kinship Care"
                                    label="Foster & Kinship Care" />
                                <Form.Check
                                    name="serviceType"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="In-Home Services"
                                    label="In-Home Services" />
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" title="Specializations" style ={{
                                marginRight:"5px"
                            }}>
                                <Form.Check
                                    name="specializations"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Autism Spectrum Disorder"
                                    label="Autism Spectrum Disorder" />
                                <Form.Check
                                    name="specializations"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Young Children"
                                    label="Young Children" />
                                <Form.Check
                                    name="specializations"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="LGBTQ+ Competent"
                                    label="LGBTQ+ Competent" />
                                <Form.Check
                                    name="specializations"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Experience working with immigrant and refugees"
                                    label="Experience working with immigrant and refugees" />
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" title="Ages" style ={{
                                marginRight:"5px"
                            }}>
                                <Form.Check
                                    name="ages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Toddler/preschoolers"
                                    label="Toddler/preschoolers (0-6)" />
                                <Form.Check
                                    name="ages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Children"
                                    label="Children (6-10)" />
                                <Form.Check
                                    name="ages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Preteens"
                                    label="Preteens (11-13)" />
                                <Form.Check
                                    name="ages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Adolescents"
                                    label="Adolescents (14-21)" />
                                <Form.Check
                                    name="ages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Adults"
                                    label="Adults (21-65)" />
                                <Form.Check
                                    name="ages"
                                    onChange={this.handleInputChange}
                                    type="checkbox"
                                    value="Seniors"
                                    label="Seniors (65+)" />
                            </DropdownButton>
                        </ButtonGroup>
                    </div>
                    <ButtonGroup style ={{
                        marginLeft:"15px",
                        marginBottom:"10px"
                    }}>
                        <DropdownButton id="dropdown-basic-button" title="Insurance" style ={{
                            marginRight:"5px"
                        }}>
                            <Form.Check
                                name="insurance"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="Medicaid"
                                label="Medicaid" />
                            <Form.Check
                                name="insurance"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="Private"
                                label="Private" />
                            <Form.Check
                                name="insurance"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="Uninsured/Underinsured"
                                label="Uninsured/Underinsured" />
                            <Form.Check
                                name="insurance"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="Sliding Scale"
                                label="Sliding Scale" />
                        </DropdownButton>
                        <DropdownButton id="dropdown-basic-button" title="Therapy Types" style ={{
                            marginRight:"5px"
                        }}>
                            <Form.Check
                                name="therapyTypes"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="TF-CBT (Trauma-Focused Cognitive Behavioral Therapy)"
                                label="TF-CBT (Trauma-Focused Cognitive Behavioral Therapy)" />
                            <Form.Check
                                name="therapyTypes"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="Pri-CARE (Child Adult Relationship Enhancement)"
                                label="Pri-CARE (Child Adult Relationship Enhancement)" />
                            <Form.Check
                                name="therapyTypes"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="CFTSI (Child Family Traumatic Stress Intervention)"
                                label="CFTSI (Child Family Traumatic Stress Intervention)" />
                            <Form.Check
                                name="therapyTypes"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="Adolescent Dialectical Behavioral Therapy (DBT)"
                                label="Adolescent Dialectical Behavioral Therapy (DBT)" />
                            <Form.Check
                                name="therapyTypes"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="Family Therapy"
                                label="Family Therapy" />
                            <Form.Check
                                name="therapyTypes"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="EMDR"
                                label="EMDR" />
                            <Form.Check
                                name="therapyTypes"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="Other Evidence-Based Practices (EBPs)"
                                label="Other Evidence-Based Practices (EBPs)" />
                            <Form.Check
                                name="therapyTypes"
                                onChange={this.handleInputChange}
                                type="checkbox"
                                value="Support Groups"
                                label="Support Groups" />
                        </DropdownButton>
                    </ButtonGroup>
                </Row>
                <Row className="mh-100" style = {{
                    height: "85%",
                    marginLeft: "0px",
                    marginRight: "0px",
                    marginTop: "10px"
                }}>
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
                                    <p className="list-view-text-body">{item.address}</p>
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
                        <input
                            type="text"
                            name="name"
                            value={this.state.value}
                            onChange={this.handleFilterChange} />
                        <Button block onClick={this.filterFirestore}>Test Filter Provider</Button>
                    </Col>
                    <Collapse appear={true} in={this.state.listView}>
                        <Col md={6}>
                            <div ref="map" id="map" className="map-view" />
                        </Col>
                    </Collapse>
                </Row>
            </Container>
        </Fragment>);
    }

}

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}

export default compose(
  withFirestore,
  connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase
  })))(Index);
