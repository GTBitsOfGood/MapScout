import React, {Component, Fragment} from 'react';
import NavBar from './NavBar';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from "react-bootstrap/Badge";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from "react-bootstrap/Form";
import Dropdown from 'react-bootstrap/Dropdown';
import { compose } from "redux";
import { connect } from 'react-redux';
import { withFirestore, isEmpty, isLoaded } from "react-redux-firebase";
import ProviderInfo from "./ProviderInfo";
import Modal from "react-bootstrap/Modal";
import options from "../utils/options";
import { Flipper, Flipped } from "react-flip-toolkit";
import { FaMapPin, FaPhone, FaTimesCircle } from "react-icons/fa";
import localizationStrings from '../utils/Localization';


const API_KEY = "AIzaSyCS2-Xa70z_LHWyTMvyZmHqhrYNPsDprMQ";

const colors = {
    serviceType: '#DC8665',
    specializations: '#138086',
    ages: '#534666',
    insurance: '#CD7672',
    languages: '#240E8B',
    therapyTypes: '#787FF6'
};

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
            moreFilter: false,
            listView: true,
            isLoading: true,
            selectedIndex: 0,
            activeProviders: null,
            tempProviders: null,
            serviceType: [],
            specializations: [],
            ages: [],
            insurance: [],
            languages: [],
            therapyTypes: [],
            filters: ['serviceType', 'specializations', 'ages', 'insurance', 'languages', 'therapyTypes'],
            searchName: null,
            // searchZip: 19123,
            searchZip: null,
            name: null,
            markers: null, 
        };
        this.switchView = this.switchView.bind(this);
        this.renderCell = this.renderCell.bind(this);
        this.renderDropdown = this.renderDropdown.bind(this);
        this.renderTag = this.renderTag.bind(this);
        this.filterZipcode = this.filterZipcode.bind(this);
        this.filterSearch = this.filterSearch.bind(this);
        this.filterActiveProviders = this.filterActiveProviders.bind(this);
    }

    filterZipcode = async (filterVal) => {
        let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${filterVal}&key=${API_KEY}`);
        let responseJson = await response.json();

        // Handle illegal response
        let filterLat = responseJson['results'][0]['geometry']['location']['lat'];
        let filterLong = responseJson['results'][0]['geometry']['location']['lng'];
        var providerLat, providerLong;
        var filteredProviders = [];


        var R = 6371e3;
        const pi = Math.PI;
        const metersPerMile = 1609.344;
        var φ1 = filterLat * (pi/180);

        this.state.tempProviders.forEach(function(provider) {
            providerLat = provider['latitude'];
            providerLong = provider['longitude'];
            let distance = Math.pow(Math.abs(filterLat - providerLat), 2) + Math.pow(Math.abs(filterLong - providerLong), 2);

            let φ2 = providerLat * (pi/180)
            let Δφ = (providerLat-filterLat) * (pi/180)
            let Δλ = (providerLong-filterLong) * (pi/180)
            let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2)
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
            let miDistance = (R * c) / metersPerMile

            filteredProviders.push({'provider': provider, 'latLongdistance': distance, 'miDistance': Math.round(miDistance) + 1});
        });

        filteredProviders.sort(function(a, b) {
            return a.latLongdistance > b.latLongdistance ? 1 : -1
        });

        var outThis = this;
        var filterActiveProviders = [];
        filteredProviders.forEach(function (provider) {
            filterActiveProviders.push(provider['provider'])
            let distKey = provider['provider']['facilityName'] + 'Dist'
            outThis.setState({
                [distKey]: provider['miDistance']
            })
        });

        await this.setState({
            tempProviders: filterActiveProviders,
        })

    };

    filterNormalFilters = async (e) => {
        const filterName = e.target.name;
        const filterVal = e.target.value;

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
    };

    filterActiveProviders = async () => {
      await this.state.filters.forEach(filterName => {
        this.setState({
            tempProviders: this.state.tempProviders.filter((provider) => {
            return provider[filterName].some(r => this.state[filterName].includes(r)) || this.state[filterName].length === 0
            })
        })
      })
      this.greyOutMarkers()
    };

    filterSearch = async (filterVal) => {
      await this.setState({
        tempProviders: this.state.tempProviders.filter((filter) => {
          return filter.facilityName.toLowerCase().includes(filterVal.toLowerCase())
        })
      })
    };

    filterProviders = async (e) => {
      this.setState({
        tempProviders: this.props.providers,
      });
      if (typeof e !== 'undefined') {
        const filtertype = e.target.getAttribute('filtertype')
        const filterVal = e.target.value;

        if(filtertype === 'normalfilter') {
          await this.filterNormalFilters(e)
        } else if(filtertype === 'search') {
          await this.setState({searchName: filterVal});
        } else if(filtertype === 'zipcode') {
          await this.setState({searchZip: filterVal.length === 5 ? filterVal : null});
        }
      }

      await this.filterActiveProviders()

      if(this.state.searchName != null) {
          await this.filterSearch(this.state.searchName)
      }

      if(this.state.searchZip != null) {
          await this.filterZipcode(this.state.searchZip)
      }

      this.setState({activeProviders: this.state.tempProviders})
    }

    // creates map and firebase
    async componentDidMount() {
        const { firestore, providers } = this.props;
        if (!isLoaded(providers)) {
            await firestore.get('providers');
        }
        await this.setState({ 
          activeProviders: this.props.providers, 
          tempProviders: this.props.providers
        });

        this.setState({ isLoading: false });
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
        var map = new google.maps.Map(mapDOMNode, mapOptions);
        var geocoder = new google.maps.Geocoder();
        // TODO: add locations from firebase: DS can obvs change but rn its [string, lat, long]
        var locations = []; //for each location ['string for onclick', num(lat), num(long)]
        let temp = [];
        const providers = this.props.providers;
        if (!isEmpty(providers)) {
          for (let i = 0; i < providers.length; i++) {
            temp = [providers[i].facilityName.toString(), providers[i].address.toString(), providers[i].latitude, providers[i].longitude];
            locations.push(temp);
          }
        }
        var markers = [];
        // for each location create a marker 
       this.setMarkers(map, markers, locations)
    }

    setMarkers(map, markers, locations) {
      var self = this; //needed to access other self stuuff before this gets changed
      var i;
      var iconMarker = {
        path: "M1,9a8,8 0 1,0 16,0a8,8 0 1,0 -16,0",
        fillColor: "#5EB63B",
        fillOpacity: 1,
        strokeColor: "white",
        strokeWeight: 2,
        anchor: new google.maps.Point(0, 0),
      }

      for (i = 0; i < locations.length; i++) {
        var contentStr = '<b>' + locations[i][0] + '</b>' + "\n <div>" + locations[i][1] + "</div>"; //TODO more details button? yep so self.state.
        var infoWindow = new google.maps.InfoWindow({
          content: contentStr,
        });

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i][2], locations[i][3]),
          map: map,
          icon: iconMarker,
          infowindow: infoWindow,
        });
        markers.push(marker);

        google.maps.event.addListener(marker, 'click', function (marker, i) {
          // this makes sure that only one info window is open 
          markers.forEach(function (marker) {
            marker.infowindow.close(map, marker);
            marker.setIcon(iconMarker)
          });
          self.greyOutMarkers(); 
          var pressedIcon = {
            path: 'M1 12.5C1 7.5 5 1 13 1C21 1 25 7.5 25 12.5C25 21.5 17 26.3333 13 31C9 26.5 1 21.1115 1 12.5Z,M8,12.5a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
            fillColor: '#FFB930',
            fillOpacity: 1.0,
            strokeColor: "white",
            strokeWeight: 2,
            anchor: new google.maps.Point(0, 0),
          }
          this.infowindow.open(map, this);
          this.setIcon(pressedIcon);
          map.panTo(this.getPosition());
        })

        google.maps.event.addListener(infoWindow, 'closeclick', function () {
          markers.forEach(function (marker) {
            marker.infowindow.close(map, marker);
            marker.setIcon(iconMarker)
          });
          self.greyOutMarkers(); 
        })
      };
      this.setState({markers: markers}); 
    }

    hoverEnter(item) { 
      var markers = this.state.markers; 
      var hover_lat = Math.ceil(item.latitude * 100000) / 100000; 
      var hover_lng = Math.ceil(item.longitude * 100000) / 100000; 
      var marker_lat; 
      var marker_lng; 
      var pressedIcon = {
        path: 'M1 12.5C1 7.5 5 1 13 1C21 1 25 7.5 25 12.5C25 21.5 17 26.3333 13 31C9 26.5 1 21.1115 1 12.5Z,M8,12.5a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
        fillColor: '#FFB930',
        fillOpacity: 1.0,
        strokeColor: "white",
        strokeWeight: 2,
        anchor: new google.maps.Point(0, 0),
      }
      markers.forEach(function(marker) { 
        marker_lat = Math.ceil(marker.getPosition().lat() * 100000) / 100000;
        marker_lng = Math.ceil(marker.getPosition().lng() * 100000) / 100000;
        if((marker_lng == hover_lng) && (marker_lat == hover_lat)) { 
          marker.setIcon(pressedIcon)
        }
      });       
    }

    hoverLeave(item) { 
      var markers = this.state.markers; 
      var iconMarker = {
        path: "M1,9a8,8 0 1,0 16,0a8,8 0 1,0 -16,0",
        fillColor: "#5EB63B",
        fillOpacity: 1,
        strokeColor: "white",
        strokeWeight: 2,
        anchor: new google.maps.Point(0, 0),
      }
      markers.forEach(function(marker) { 
        marker.setIcon(iconMarker)
      });
      this.greyOutMarkers(); 
    }


    greyOutMarkers() {
      var markers = this.state.markers;
      var listOfProviders = this.state.tempProviders;
      var iconMarker = {
        path: "M1,9a8,8 0 1,0 16,0a8,8 0 1,0 -16,0",
        fillColor: "#5EB63B",
        fillOpacity: 1,
        strokeColor: "white",
        strokeWeight: 2,
        anchor: new google.maps.Point(0, 0),
      }
      var iconMarkerGreyOut = {
        path: "M1,9a8,8 0 1,0 16,0a8,8 0 1,0 -16,0",
        fillColor: "#C4C4C4",
        fillOpacity: 1,
        strokeColor: "white",
        strokeWeight: 2,
        anchor: new google.maps.Point(0, 0),
      }
      // redraw green for QA
      // markers.forEach(function(marker) { 
      //   marker.setIcon()
      // });
      // convert appropriate ones to grey 
      var match = false;
      markers.forEach(function (marker) {
        match = false;
        listOfProviders.forEach(function (provider) {
          var provider_lat = Math.ceil(provider.latitude * 100000) / 100000;
          var provider_lng = Math.ceil(provider.longitude * 100000) / 100000;
          var marker_lat = Math.ceil(marker.getPosition().lat() * 100000) / 100000;
          var marker_lng = Math.ceil(marker.getPosition().lng() * 100000) / 100000;
          if ((marker_lng == provider_lng) && (marker_lat == provider_lat)) {
            match = true;
            marker.setIcon(iconMarker)
          }
        });
        if (!match) {
          marker.setIcon(iconMarkerGreyOut)
        }
      });
    }

    switchView() {
      this.setState({ listView: !this.state.listView });
    }

    renderTag(item, index) {
        return this.state[item].map((title, key) =>
            <div
                className="tag"
                style={{ borderColor: colors[item], color: colors[item] }}
                key={`${index}${key}`}>
                {title}
                <span
                    className="remove-tag"
                    onClick={async ()=>{
                        this.setState({
                          [item]: this.state[item].filter((i) => i !== title)
                        })
                        setTimeout(() => this.filterProviders(), 100);
                    }}>
                    <FaTimesCircle />
                </span>
            </div>
        )
    }

    renderCell(item, index) {
        return (
            <div
                className="map-cell"
                key={index}
                onClick={() => this.setState({ selectedIndex: index, showModal: true})}
                onMouseEnter={() => this.hoverEnter(item)}
                onMouseLeave={() => this.hoverLeave(item)}>
                <Flipped key={index} inverseFlipId="list">
                    <div>
                        <h5>
                            <b>{item.facilityName}</b>
                            {
                                item.therapyTypes.includes('Pri-CARE') &&
                                <Badge
                                    style={{ marginLeft: 20 }}
                                    variant="primary">Pri-CARE</Badge>
                            }
                            {
                                item.therapyTypes.includes('TF-CBT') &&
                                <Badge
                                    style={{ marginLeft: 20 }}
                                    variant="primary">TF-CBT</Badge>
                            }
                        </h5>
                        <div style={{ color: 'gray' }}>
                            <FaMapPin/> {item.address[0]}
                            <div className="row-spaced">
                                <div><FaPhone/> {item.phoneNum.join(', ')}</div>
                                <small>{this.state[item.facilityName + 'Dist']  && this.state['searchZip'] ? this.state[item.facilityName + 'Dist'] + ' mi' : ''}</small>
                            </div>
                        </div>
                    </div>
                </Flipped>
            </div>
        );
    }

    renderDropdown(title, key) {
        return(
            <Dropdown>
                <Dropdown.Toggle
                    variant="light"
                    alignLeft
                    style={{ marginRight: 5, marginBottom: 5 }}
                >{title}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {options[key].map((item, index) =>
                        <Form.Check
                            name={key}
                            key={index}
                            onChange={this.filterProviders}
                            className="dropdown-item"
                            type="checkbox"
                            checked={this.state[key].includes(item.value)}
                            value={item.value}
                            label={item.label} 
                            filtertype="normalfilter"/>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    render() {
        let { searchProviderName, searchZipcode, hideLabel, showLabel, languagesLabel, agesLabel, insuranceLabel,
            serviceTypeLabel, specializationsLabel, therapyTypeLabel} = localizationStrings;
        const { isLoading, data, selectedIndex, showModal, listView } = this.state;
        const providers = this.state.activeProviders;

    if (isLoading || !isLoaded(providers))
        return <div className="spinner" />;

    return (
        <div className="bg-white">
            <NavBar/>
            <div>
                <div className="row-spaced ml-2">
                    <div className="w-75">
                        <Form.Row>
                            <Col>
                                <Form.Control placeholder={searchProviderName} filtertype='search' onChange={this.filterProviders} />
                            </Col>
                            <Col>
                                <Form.Control placeholder={searchZipcode} filtertype='zipcode' onChange={this.filterProviders} />
                            </Col>
                        </Form.Row>
                    </div>
                    <Button variant="primary" onClick={this.switchView} className="switch-view-button">
                        {this.state.listView ? hideLabel : showLabel}
                    </Button>
                </div>
                <Flipper flipKey={listView}>
                    <div className="row-nowrap">
                    <Flipped flipId="list">
                        <div className="map-list" style={{
                            width: listView ? '50%' : '100%'
                        }}>
                            <Flipped inverseFlipId="list">
                                <div className="filter-row">
                                    {this.renderDropdown(languagesLabel, "languages")}
                                    {this.renderDropdown(agesLabel, "ages")}
                                    {this.renderDropdown(insuranceLabel, "insurance")}
                                    {
                                        this.state.moreFilter ?
                                            <Fragment>
                                                {this.renderDropdown(serviceTypeLabel, "serviceType")}
                                                {this.renderDropdown(specializationsLabel, "specializations")}
                                                {this.renderDropdown(therapyTypeLabel, "therapyTypes")}
                                                <Button
                                                    variant="link"
                                                    style={{ color: 'red' }}
                                                    onClick={() => this.setState({moreFilter: false})}>
                                                    - Less Filters
                                                </Button>
                                            </Fragment>
                                            :
                                            <Button
                                                variant="link"
                                                onClick={() => this.setState({moreFilter: true})}>
                                                + More Filters
                                            </Button>
                                    }
                                </div>
                            </Flipped>
                            <Flipped inverseFlipId="list">
                                <div className="tag-row">
                                    {
                                        this.state.filters.map(this.renderTag)
                                    }
                                </div>
                            </Flipped>
                                <div className="count">
                                    <Flipped inverseFlipId="list">
                                        <span>{isEmpty(providers) ?
                                                'No' : providers.length} providers found</span>
                                    </Flipped>
                                </div>
                            {
                                !isEmpty(providers) &&
                                providers.map(this.renderCell)
                            }
                            <div>
                            {
                                providers && providers[selectedIndex] &&
                                <Modal
                                    show={showModal}
                                    onHide={() => this.setState({showModal: false})}
                                    size="lg"
                                    scrollable>
                                    <Modal.Header className="modal-header" style = {{ backgroundImage: `url(${providers[selectedIndex].imageURL})` }} closeButton>
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
                                style={{ height: 'calc(100vh - 130px)' }} />
                        </div>
                    </Flipped>
                    </div>
                </Flipper>
            </div>
        </div>);
    }

}

export default compose(
  withFirestore,
  connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase
  })))(Index);
