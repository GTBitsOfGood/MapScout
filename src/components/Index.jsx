import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import CsvUpload from './CsvUpload';

class Index extends Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = () => this.initMap(this.refs.map);
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCdmgfV3yrYNIJ8p77YEPCT8BbRQU82lJI&callback=initMap')
    }

    initMap(mapDOMNode) {
        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(39.9526, -75.1652),
            mapTypeId: 'roadmap'
        };
        var map = new google.maps.Map(mapDOMNode, mapOptions);
        var geocoder = new google.maps.Geocoder();
        // In this case it gets the address from an element on the page, but obviously you
        // could just pass it to the method instead
        geocoder.geocode( { 'address' : "2501 Reed St, Philadelphia, PA 19146" }, function( results, status ) {
            if( status == google.maps.GeocoderStatus.OK ) {
                // In this case it creates a marker, but you can get the lat and lng from the location.LatLng
                map.setCenter( results[0].geometry.location );
                var marker = new google.maps.Marker( {
                    map: map,
                    position: results[0].geometry.location,
                    label: "Bethanna"
                });
                var contentString = '<div id="content"><h1>Bethanna</h1><h3>Service Type</h3><p>Outpatient Services; Behavioral Health Rehabilitation Services (BHRS); Autism Spectrum Disorders (ASDs) Assessment and Services</p><h3>Types of Therapy</h3><p>"Trauma-Focused Cognitive Behavioral Therapy (TF-CBT); Individual and Family Therapy; Ecosystem Family Therapy (ESFT); Parent-Child Interaction (PCIT); Art, Play and other Creative Therapies; Group Therapy"<p><h3>Languages</h3><p>English; Spanish</p><h3>Specializations</h3><p>Autism Spectrum Disorder</p><h3>Insurance Type Accepted</h3><p>Medicaid</p><h3>EPIC Designation</h3><p>X</p><h3>Childcare Availability</h3><p>N/A</p><h3>Hours of Operation</h3><p>Monday-Friday 8AM-10PM <br>Weekend Hours: Saturday 8AM-7PM; Sunday Closed</p></div>';
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
            }
            else {
                alert( 'Geocode was not successful for the following reason: ' + status );
            }
        });
    }


    render() {
        const {
          testThing
        } = this.props;

        return (
            <div>
                <RB.Grid>
                    <RB.Row>
                        <RB.Col xs={4} md={2} />
                        <RB.Col xs={12} md={8}>
                            <RB.PageHeader>
                                PACTS
                                <br />
                                <small>
                                    by Hack4Impact
                                </small>
                            </RB.PageHeader>
                        </RB.Col>
                        <RB.Col xs={4} md={2} />
                    </RB.Row>
                    <RB.Row style={{
                        position: 'absolute',
                        top: "50%",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'flex-end',
                        alignItems: 'center',}}>
                        <div ref="map" id="map" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                       }}></div>
                    </RB.Row>
                </RB.Grid>
                <CsvUpload>
                </CsvUpload>
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

export default Index;
