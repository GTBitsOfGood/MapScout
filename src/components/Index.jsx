import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
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
import { FaMapPin, FaPhone, FaTimesCircle, FaLocationArrow, FaMap } from "react-icons/fa";
import { AiOutlineFileSearch } from "react-icons/ai";
import localizationStrings from '../utils/Localization';
import API_KEY from '../config/keys';

var debounce = require("lodash/debounce");
var classNames = require('classnames');

const colors = {
    serviceType: '#DC8665',
    specializations: '#138086',
    ages: '#534666',
    insurance: '#CD7672',
    languages: '#240E8B',
    therapyTypes: '#787FF6'
};

const getWidth = () => window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

const Index = (props) => {

    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [moreFilter, setMoreFilter] = useState(false);
    const [listView, setListView] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeProviders, setActiveProviders] = useState(null); //What shows up on search
    const [tempProviders, setTempProviders] = useState(null); //Memory (last search)
    const [serviceType, setServiceType] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [ages, setAges] = useState([]);
    const [insurance, setInsurance] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [therapyTypes, setTherapyTypes] = useState([]);
    const [filters, setFilters] = useState(['serviceType', 'specializations', 'ages', 'insurance', 'languages', 'therapyTypes']);
    const [searchName, setSearchName] = useState(null);
    const [searchZip, setSearchZip] = useState(null);
    const [name, setName] = useState(null);
    const [markers, setMarkers] = useState(null);
    const [currmarker, setCurrmarker] = useState(-1);
    const [point, setPoint] = useState(true);
    const [distances, setDistances] = useState({});

    const state = {
        serviceType, specializations, ages, insurance, languages, therapyTypes
    };

    let [width, setWidth] = useState(getWidth());

    useEffect(() => {
        const resizeListener = () => {
            if (width > 768 && getWidth() <= 768) {
                setSticky(false)
            }
            setWidth(getWidth());
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        }
    }, []);

    const [isSticky, setSticky] = useState(false);
    const ref = useRef(null);
    const cellScrollRef = useRef(null);
    const listScrollRef = useRef(null);
    const handleScroll = (flip) => {
        if (flip || width <= 768) {
            if (ref.current.getBoundingClientRect().top <= 70) {
                setSticky(true);
            } else if (isSticky) {
                setSticky(false);
            }
        }
    };

    const resetSticky = () => {
        setSticky(false);
        setTimeout(() => {
            listScrollRef.current.scrollTop = -1;
            cellScrollRef.current.scrollTop = 0;
        }, 100);
    };

    function setState(index, value) {
        const setMap = {
            serviceType: setServiceType,
            specializations: setSpecializations,
            ages: setAges,
            insurance: setInsurance,
            languages: setLanguages,
            therapyTypes: setTherapyTypes,
        };

        setMap[index](value);
    }

    const filterByTags = () => {
        if (!isEmpty(props.providers)) {
            let temp = searchName && searchName.length > 0 ? tempProviders : props.providers; //If there is a search term, use tempProviders, otherwise use all providers
            filters.forEach(filterName => {
                temp = temp.filter((provider) => {
                    return provider[filterName].some(r => state[filterName].includes(r)) || state[filterName].length === 0 //Actual filtering stuff
                });
            });
            if (searchName && searchName.length > 0) {
                setTempProviders(temp);
            }
            setActiveProviders(temp);
        }
    };

    const filterZipcode = async (filterVal) => {
        let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${filterVal}&key=${API_KEY}`);
        let responseJson = await response.json();
        console.log(responseJson);

        // Handle illegal response
        let filterLat = responseJson['results'][0]['geometry']['location']['lat'];
        let filterLong = responseJson['results'][0]['geometry']['location']['lng'];
        var providerLat, providerLong;
        var filteredProviders = [];


        var R = 6371e3;
        const pi = Math.PI;
        const metersPerMile = 1609.344;
        var theta1 = filterLat * (pi / 180);

        tempProviders.forEach(function(provider) {
            providerLat = provider['latitude'];
            providerLong = provider['longitude'];
            let distance = Math.pow(Math.abs(filterLat - providerLat), 2) + Math.pow(Math.abs(filterLong - providerLong), 2);

            let theta2 = providerLat * (pi / 180);
            let deltaTheta = (providerLat - filterLat) * (pi / 180);
            let deltaLambda = (providerLong - filterLong) * (pi / 180);
            let a = Math.sin(deltaTheta / 2) * Math.sin(deltaTheta / 2) +
                Math.cos(theta1) * Math.cos(theta2) *
                Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let miDistance = (R * c) / metersPerMile;

            filteredProviders.push({ 'provider': provider, 'latLongdistance': distance, 'miDistance': Math.round(miDistance) + 1 });
        });

        filteredProviders.sort(function(a, b) {
            return a.latLongdistance > b.latLongdistance ? 1 : -1
        });

        const filterActiveProviders = [];
        const filterDistances = [];
        filteredProviders.forEach(function(provider) {
            filterActiveProviders.push(provider['provider']);
            let distKey = provider['provider']['facilityName'];
            filterDistances.push({[distKey]: provider['miDistance']}) //TODO: Figure out if we are keying this wrong cause we can't access it
        });
        setDistances(filterDistances);
        setTempProviders(filterActiveProviders);
    };

    const filterNormalFilters = async(e) => { //Change the filters, but not the providers
        const filterName = e.target.name;
        const filterVal = e.target.value;
        if (e.target.type === "checkbox" && e.target.checked) { //If checked
            await setState(filterName, [...state[filterName], filterVal]); //Apply filter to state
        } else if (e.target.type === "checkbox" && !e.target.checked) { //If it is not checked
            await setState(filterName, state[filterName].filter(function(filter) {
                    return filter !== filterVal //Removes from state
                })
            )
        }
    };

    const filterSearch = (filterVal) => {
        const regex = new RegExp(`${ filterVal.toLowerCase() }`, "gi"); //if facilityName includes search term
        //TODO: Find out why tempProviders is not what it is supposed to be
        const temp = tempProviders || props.providers; //available set of providers
        setActiveProviders(temp.filter((item) => regex.test(item.facilityName))) //set active providers to regex
    };

    const filterProviders = async(e) => { //Step 1
        if (!evaluateFilters()) {
            setTempProviders(props.providers);
        }
        if (typeof e !== 'undefined') {
            const filtertype = e.target.getAttribute('filtertype');
            const filterVal = e.target.value;
            if (filtertype === 'search') { //if searching provider name
                setSearchName(filterVal); //setting the state
                await filterSearch(filterVal)
            } else if (filtertype === 'zipcode') { //if searching zip
                setSearchZip(filterVal); //setting the state
                if (filterVal.length === 5)
                    await filterZipcode(filterVal)
            } else { //if tags
                await filterNormalFilters(e);
            }
        }
    };

    useEffect(() => {
        const { firestore, providers } = props;
        if (!isLoaded(providers)) {
            firestore.get('providers').then(
                () => {
                    setActiveProviders(providers);
                    setTempProviders(providers);
                    setIsLoading(false)
                }
            )
        } else if (isEmpty(activeProviders) && isEmpty(tempProviders) && isLoading) {
            setActiveProviders(providers);
            setTempProviders(providers);
            setIsLoading(false)
        }
    }, [props.providers]);

    useEffect(() => {
        filterByTags(); //Whenever the filter changes, this function is called
    }, [serviceType, specializations, ages, insurance, languages, therapyTypes]);

    function switchView() {
        setListView(!listView);
    }

    function evaluateFilters() {
        let isFiltersEmpty = true;
        filters.map(item => {
            if (state[item].length > 0) {
                isFiltersEmpty = false;
            }
        });
        return !isFiltersEmpty;
    }

    function clearFilters() {
        filters.map(item =>
            setState(item, [])
        );
    }

    function renderTag(item, index) {
        return state[item].map((title, key) =>
            <div
                className = "tag"
                style = {{ borderColor: colors[item], color: colors[item] } }
                key = { `${index}${key}` }>
                { title } <span className = "remove-tag"
                                onClick = {
                                    async () => {
                                        setState(item, state[item].filter((i) => i !== title));
                                        setTimeout(() => filterProviders(), 100);
                                    }}> <FaTimesCircle />
                </span>
            </div>
        )
    }

    function handleCellClick(index) {
        setSelectedIndex(index);
        setShowModal(true);
    }

    function renderCell(item, index) {
        return (
            <div
                className = "map-cell padder"
                key = { index }
                style = {{
                    borderTopWidth: index === 0 ? 0 : 1,
                    paddingTop: index === 0 ? 0 : 18,
                }}
                onMouseEnter={debounce(() => {
                    if (listView && width > 768)
                        setCurrmarker(index);
                }, 300)}
                onClick = {() => handleCellClick(index)} >
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
                                distances[item.facilityName] && //Not getting detected
                                <small>
                                    <FaLocationArrow style = {{ marginRight: 8 }}/>
                                    { distances[item.facilityName] + ' mi' }
                                </small>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderTagControl = () => {
        return <Fragment>
            {
                !condition && !isSticky &&
                <div ref={ref} className = "scroll-indicator"/>
            }
            <div className = {classNames("filter-row", "padder")}>

                { renderDropdown(languagesLabel, "languages") }
                { renderDropdown(agesLabel, "ages") }
                { renderDropdown(insuranceLabel, "insurance") }
                { moreFilter
                    ? <Fragment >
                        { renderDropdown(serviceTypeLabel, "serviceType") }
                        { renderDropdown(specializationsLabel, "specializations") }
                        { renderDropdown(therapyTypeLabel, "therapyTypes") }
                        <Button
                            variant = "link"
                            style = {{ color: 'red' }}
                            onClick = {() => setMoreFilter(false) } >- {lessFilters}
                        </Button>
                    </Fragment>
                    : <Button
                        variant = "link"
                        onClick = {() => setMoreFilter(true) }>
                        + {moreFilters}
                    </Button>
                }
            </div>
        </Fragment>
    };

    function renderDropdown(title, key) {
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
                                    () => filterProviders({
                                        target: {
                                            name: key,
                                            value: item.value,
                                            type: "checkbox",
                                            checked: !state[key].includes(item.value),
                                            getAttribute: (param) => "normalfilter"
                                        }
                                    })
                                }>
                                <Form.Check
                                    className="dropdown-item"
                                    name = { key }
                                    key = { index }
                                    type = "checkbox"
                                    checked = { state[key].includes(item.value) }
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

    const condition = width > 768;

    if (isLoading || !isLoaded(activeProviders))
        return <div className = "spinner" />;

    return (
        <div className = {classNames("bg-white", {"overflow-scroll": !condition})} >
            {/*<NavBar />*/}
            <div >
                <div>
                    <div
                        className = {classNames("row-spaced", "ml-2", "mb-3", "pt-3", {"mr-2": !condition})} >
                        <div className = "w-75" >
                            <Row noGutters={!condition}>
                                <Col >
                                    <Form.Control
                                        placeholder = { searchZipcode }
                                        filtertype = 'zipcode'
                                        onChange = { filterProviders } />
                                </Col>
                                <Col >
                                    <Form.Control
                                        placeholder = { searchProviderName }
                                        filtertype = 'search'
                                        onChange = { filterProviders } />
                                </Col>
                            </Row>
                        </div>
                        {
                            condition ?
                            <Button
                                variant = "primary"
                                onClick = { switchView }
                                className = "switch-view-button" >
                                { listView ? hideLabel : showLabel }
                            </Button>
                                :
                                isSticky &&
                                <Button
                                    variant = "outline-primary"
                                    onClick = {resetSticky}>
                                    <FaMap/>
                                </Button>
                        }
                    </div>
                    {isSticky && renderTagControl()}
                </div>
                <div className = {classNames({"row-nowrap": condition})} >
                    <div
                        ref={listScrollRef}
                        onScroll={handleScroll}
                        style={{ pointerEvents: point || condition || isSticky ? "all" : "none" }}
                        className = {classNames("map-list", { "expand": !listView, "sticky": isSticky && !condition })}>
                        {
                            !isSticky && !condition &&
                            <div
                                className="map-overlay"
                                onMouseEnter={() => setPoint(false)}
                            />
                        }
                        <div
                            className="map-container">
                            {!isSticky && renderTagControl()}
                            <div ref={cellScrollRef} className = {classNames("cell-container", {"sticky": isSticky && !condition})}>
                                <div className = "tag-row padder" >
                                    {filters.map(renderTag)}
                                    {
                                        evaluateFilters() &&
                                        <div
                                            onClick = {() => clearFilters()}
                                            className = "tag clear-all"
                                            style = {{ borderColor: 'red', color: 'red' }}>
                                            Clear All
                                        </div>
                                    }
                                </div>
                                <div className = "count" >
                                <span>
                                    {
                                        isEmpty(activeProviders) ?
                                            'No' : activeProviders.length
                                    } providers found
                                </span>
                                </div>
                                {
                                    !isEmpty(activeProviders) &&
                                    activeProviders.map(renderCell)
                                }
                                {
                                        evaluateFilters() && isEmpty(activeProviders) && (
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "flex-end",
                                                color: "gray",
                                                paddingTop: "50px"
                                            }}>
                                                <div>
                                                    <AiOutlineFileSearch size={128}/>
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: 700, fontSize: "20px" }}>Whoops!</span>
                                                    <div>
                                                        Sorry that we don't have providers that match your search.
                                                    </div>
                                                    <div>
                                                        Adjust the filters or try different keywords to see more results.
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                            </div>
                            <div >
                                {
                                    activeProviders && activeProviders[selectedIndex] &&
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
                    </div>
                    {
                        !(isSticky && !condition) &&
                        <div id="map"
                             className={classNames({'map-hide': condition && !listView})}>
                            <div
                                onMouseLeave={() => setPoint(true)}
                                style={{ height: condition ? 'calc(100vh - 70px)' : '60vh', width: '100%' }}>
                                <GoogleMap
                                    providers={activeProviders}
                                    defaultZoom={12}
                                    defaultCenter={{
                                        lat: 39.9526,
                                        lng: -75.1652
                                    }}
                                    selectedMarker={currmarker}
                                    onShowMoreClick={handleCellClick}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>);
}

export default compose(withFirestore, connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase
})))(Index);
