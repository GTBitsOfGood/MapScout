import React, { Component, Fragment, useState } from 'react';
import NavBar from './NavBar';
import GoogleMap from './GoogleMap';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Dropdown from 'react-bootstrap/Dropdown';
import { compose } from "redux";
import { connect } from 'react-redux';
import { withFirestore, isEmpty, isLoaded } from "react-redux-firebase";
import ProviderInfo from "./ProviderInfo";
import Modal from "react-bootstrap/Modal";
import options from "../utils/options";
import { Flipper, Flipped } from "react-flip-toolkit";
import { FaMapPin, FaPhone, FaTimesCircle, FaLocationArrow } from "react-icons/fa";
import localizationStrings from '../utils/Localization';
import API_KEY from '../config/keys';

var debounce = require("lodash/debounce");

const colors = {
    serviceType: '#DC8665',
    specializations: '#138086',
    ages: '#534666',
    insurance: '#CD7672',
    languages: '#240E8B',
    therapyTypes: '#787FF6'
};

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
            currmarker: -1,
        };
        this.switchView = this.switchView.bind(this);
        this.renderCell = this.renderCell.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.renderDropdown = this.renderDropdown.bind(this);
        this.renderTag = this.renderTag.bind(this);
        this.filterZipcode = this.filterZipcode.bind(this);
        this.filterSearch = this.filterSearch.bind(this);
        this.filterActiveProviders = this.filterActiveProviders.bind(this);
    }

    filterZipcode = async(filterVal) => {
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
        var φ1 = filterLat * (pi / 180);

        this.state.tempProviders.forEach(function(provider) {
            providerLat = provider['latitude'];
            providerLong = provider['longitude'];
            let distance = Math.pow(Math.abs(filterLat - providerLat), 2) + Math.pow(Math.abs(filterLong - providerLong), 2);

            let φ2 = providerLat * (pi / 180)
            let Δφ = (providerLat - filterLat) * (pi / 180)
            let Δλ = (providerLong - filterLong) * (pi / 180)
            let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            let miDistance = (R * c) / metersPerMile

            filteredProviders.push({ 'provider': provider, 'latLongdistance': distance, 'miDistance': Math.round(miDistance) + 1 });
        });

        filteredProviders.sort(function(a, b) {
            return a.latLongdistance > b.latLongdistance ? 1 : -1
        });

        var outThis = this;
        var filterActiveProviders = [];
        filteredProviders.forEach(function(provider) {
            filterActiveProviders.push(provider['provider']);
            let distKey = provider['provider']['facilityName'] + 'Dist';
            outThis.setState({
                [distKey]: provider['miDistance']
            })
        });

        await this.setState({
            tempProviders: filterActiveProviders,
        })

    };

    filterNormalFilters = async(e) => {
        const filterName = e.target.name;
        const filterVal = e.target.value;
        if (e.target.type === "checkbox" && e.target.checked) {
            await this.setState({
                [filterName]: [...this.state[filterName], filterVal]
            })

        } else if (e.target.type === "checkbox" && !e.target.checked) {
            await this.setState({
                [filterName]: this.state[filterName].filter(function(filter) {
                    return filter !== filterVal
                })
            })
        }
    };

    filterActiveProviders = async() => {
        await this.state.filters.forEach(filterName => {
            this.setState({
                tempProviders: this.state.tempProviders.filter((provider) => {
                    return provider[filterName].some(r => this.state[filterName].includes(r)) || this.state[filterName].length === 0
                })
            })
        });
    };

    filterSearch = async(filterVal) => {
        await this.setState({
            tempProviders: this.state.tempProviders.filter((filter) => {
                return filter.facilityName.toLowerCase().includes(filterVal.toLowerCase())
            })
        })
    };

    filterProviders = async(e) => {
        this.setState({
            tempProviders: this.props.providers,
        });
        if (typeof e !== 'undefined') {
            const filtertype = e.target.getAttribute('filtertype');
            const filterVal = e.target.value;

            if (filtertype === 'normalfilter') {
                await this.filterNormalFilters(e)
            } else if (filtertype === 'search') {
                await this.setState({ searchName: filterVal });
            } else if (filtertype === 'zipcode') {
                await this.setState({ searchZip: filterVal.length === 5 ? filterVal : null });
            }
        }

        await this.filterActiveProviders();

        if (this.state.searchName != null) {
            await this.filterSearch(this.state.searchName)
        }

        if (this.state.searchZip != null) {
            await this.filterZipcode(this.state.searchZip)
        }

        this.setState({ activeProviders: this.state.tempProviders })
    };

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
    }

    switchView() {
        this.setState({ listView: !this.state.listView });
    }

    evaluateFilters() {
        let isFiltersEmpty = true;
        this.state.filters.map(item => {
            if (this.state[item].length > 0) {
                isFiltersEmpty = false;
            }
        });
        return !isFiltersEmpty;
    }

    clearFilters() {
        this.state.filters.map(item =>
            this.setState({
                [item]: [] })
        );
        setTimeout(() => this.filterProviders(), 100);
    }

    renderTag(item, index) {
        return this.state[item].map((title, key) =>
            <div
                className = "tag"
                style = {{ borderColor: colors[item], color: colors[item] } }
                key = { `${index}${key}` }>
                { title } <span className = "remove-tag"
                                onClick = {
                                    async () => {
                                        this.setState({
                                            [item]: this.state[item].filter((i) => i !== title)
                                        });
                                        setTimeout(() => this.filterProviders(), 100);
                                    }}> <FaTimesCircle />
                </span>
            </div>
        )
    }

    handleCellClick(index) {
        this.setState({ selectedIndex: index, showModal: true });
    }

    renderCell(item, index) {
        return (
            <div
                className = "map-cell padder"
                key = { index }
                style = {{
                    borderTopWidth: index === 0 ? 0 : 1,
                    paddingTop: index === 0 ? 0 : 18,
                }}
                onMouseEnter={debounce(() => {
                    this.setState({currmarker: index});
                }, 300)}
                onClick = {() => this.handleCellClick(index)} >
                    <Flipped key = { index }
                             inverseFlipId = "list" >
                        <div>
                            <h5>
                                <b style={{ marginRight: 20 }}>{ item.facilityName }</b>
                                {item.therapyTypes.includes('Pri-CARE') &&
                                    <Badge
                                        style={{ marginRight: 20 }}
                                        variant = "primary" >Pri-CARE</Badge>
                                }
                                {item.therapyTypes.includes('TF-CBT') &&
                                    <Badge
                                        variant = "primary" >TF-CBT</Badge>
                                }
                            </h5>
                            <div style = {{ color: 'gray' }}>
                                <FaMapPin /> { item.address[0] }
                                <div className = "row-spaced">
                                    <div>
                                        <FaPhone /> { item.phoneNum.join(', ') }
                                    </div>
                                    {
                                        this.state[item.facilityName + 'Dist'] && this.state['searchZip'] &&
                                        <small>
                                            <FaLocationArrow style = {{ marginRight: 8 }}/>
                                            { this.state[item.facilityName + 'Dist'] + ' mi' }
                                        </small>
                                    }
                            </div>
                        </div>
                    </div>
                </Flipped>
            </div>
        );
    }

    renderDropdown(title, key) {
        return (
            <Dropdown>
                <Dropdown.Toggle
                    variant = "light"
                    alignLeft
                    style = {{ marginRight: 5, marginBottom: 5 }}>
                    { title }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        options[key].map((item, index) =>
                            <div
                                onClick={
                                    () => this.filterProviders({
                                        target: {
                                            name: key,
                                            value: item.value,
                                            type: "checkbox",
                                            checked: !this.state[key].includes(item.value),
                                            getAttribute: (param) => "normalfilter"
                                        }
                                    })
                            }>
                                <Form.Check
                                    className="dropdown-item"
                                    name = { key }
                                    key = { index }
                                    type = "checkbox"
                                    checked = { this.state[key].includes(item.value) }
                                    value = { item.value }
                                    label = { item.label }
                                    filtertype = "normalfilter" />
                            </div>
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
        );
    }
    render() {
        let {
            searchProviderName,
            searchZipcode,
            hideLabel,
            showLabel,
            languagesLabel,
            agesLabel,
            insuranceLabel,
            serviceTypeLabel,
            specializationsLabel,
            therapyTypeLabel,
            lessFilters,
            moreFilters
        } = localizationStrings;
        const { isLoading, data, selectedIndex, showModal, listView } = this.state;
        const providers = this.state.activeProviders;
        if (isLoading || !isLoaded(providers))
            return <div className = "spinner" />;

        return (
            <div className = "bg-white" >
                <NavBar update={() => this.forceUpdate()}/>
                <div >
                    <div className = "row-spaced ml-2 mb-3" >
                        <div className = "w-75" >
                            <Row >
                                <Col >
                                    <Form.Control
                                        placeholder = { searchZipcode }
                                        filtertype = 'zipcode'
                                        onChange = { this.filterProviders } />
                                </Col>
                                <Col >
                                    <Form.Control
                                        placeholder = { searchProviderName }
                                        filtertype = 'search'
                                        onChange = { this.filterProviders } />
                                </Col>
                            </Row>
                        </div>
                        <Button
                            variant = "primary"
                            onClick = { this.switchView }
                            className = "switch-view-button" >
                            { this.state.listView ? hideLabel : showLabel }
                        </Button>
                    </div>
                    <Flipper flipKey = { listView } >
                        <div className = "row-nowrap" >
                            <Flipped flipId = "list" >
                                <div
                                    className = "map-list"
                                    style = {{width: listView ? '50%' : '100%'}}>
                                    <Flipped inverseFlipId = "list" >
                                        <div className = "filter-row padder" >
                                            { this.renderDropdown(languagesLabel, "languages") }
                                            { this.renderDropdown(agesLabel, "ages") }
                                            { this.renderDropdown(insuranceLabel, "insurance") }
                                            { this.state.moreFilter
                                                ? <Fragment >
                                                    { this.renderDropdown(serviceTypeLabel, "serviceType") }
                                                    { this.renderDropdown(specializationsLabel, "specializations") }
                                                    { this.renderDropdown(therapyTypeLabel, "therapyTypes") }
                                                    <Button
                                                        variant = "link"
                                                        style = {{ color: 'red' }}
                                                        onClick = {() => this.setState({ moreFilter: false }) } >- {lessFilters}
                                                    </Button>
                                                </Fragment>
                                                : <Button
                                                    variant = "link"
                                                    onClick = {() => this.setState({ moreFilter: true }) }>
                                                    + {moreFilters}
                                                </Button>
                                            }
                                        </div>
                                    </Flipped>
                                    <Flipped inverseFlipId = "list" >
                                        <div className = "tag-row padder" >
                                            {this.state.filters.map(this.renderTag)}
                                            {
                                                this.evaluateFilters() &&
                                                <div
                                                    onClick = {() => this.clearFilters()}
                                                    className = "tag clear-all"
                                                    style = {{ borderColor: 'red', color: 'red' }}>
                                                    Clear All
                                                </div>
                                            }
                                        </div>
                                    </Flipped>
                                    <div className = "count" >
                                        <Flipped inverseFlipId = "list" >
                                            <span>
                                                {
                                                    isEmpty(providers) ?
                                                        'No' : providers.length
                                                } providers found
                                            </span>
                                        </Flipped>
                                    </div>
                                    {
                                        !isEmpty(providers) &&
                                        providers.map(this.renderCell)
                                    }
                                    <div >
                                        {
                                            providers && providers[selectedIndex] &&
                                            <Modal
                                                show = { showModal }
                                                onHide = {() => this.setState({ showModal: false })}
                                                dialogClassName = "myModal"
                                                scrollable >
                                                <Modal.Header
                                                    className = "image-cover"
                                                    style = {{ backgroundColor: "#2F80ED" }}
                                                    closeButton >
                                                </Modal.Header>
                                                <Modal.Body
                                                    className = "modal-body" >
                                                    <ProviderInfo item = { providers[selectedIndex] }/>
                                                </Modal.Body>
                                            </Modal>
                                        }
                                    </div>
                                </div>
                            </Flipped>
                            <Flipped flipId = "map" >
                                <div style = {{ width: '50%', marginRight: listView ? 0 : -1000, }}>
                                    <GoogleMap
                                        providers={providers}
                                        defaultZoom={12}
                                        defaultCenter={{
                                            lat: 39.9526,
                                            lng: -75.1652
                                        }}
                                        selectedMarker={this.state.currmarker}
                                        onShowMoreClick={this.handleCellClick}
                                    />
                                </div>
                            </Flipped>
                        </div>
                    </Flipper>
                </div>
            </div>);
    }
}

export default compose(withFirestore, connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase
})))(Index);
