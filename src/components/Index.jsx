import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
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
import ProviderInfoMobile from "./ProviderInfoMobile";
import Modal from "react-bootstrap/Modal";
import { FaMapMarkerAlt, FaPhone, FaTimesCircle, FaLocationArrow, FaMap } from "react-icons/fa";
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
    therapyTypes: '#787FF6',
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
    const [activeProviders, setActiveProviders] = useState(props.providers);
    const [tempProviders, setTempProviders] = useState(props.providers);
    const [zipProviders, setZipProviders] = useState(props.providers);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState(null);
    const [name, setName] = useState(null);
    const [markers, setMarkers] = useState(null);
    const [currmarker, setCurrmarker] = useState(-1);
    const [point, setPoint] = useState(true);
    const [distances, setDistances] = useState({});
    const [prevSearchLen, setPrevSearchLen] = useState(0);

    const [filtersState, setFiltersState] = useState({});
    const [filtersData, setFiltersData] = useState({});
    const [categories, setCategories] = useState([]);

    // set filterIds from firestore in useeffect
    useEffect(() => {
        fetchData().then(r => {
            setTempProviders(props.providers);
        });
    }, []);

    useEffect(() => {
        if (isLoaded(props.providers)) {
            setTempProviders(props.providers);
        }
    }, [props.providers]);

    async function fetchData() {
        const {firestore} = props;
        const collections = firestore.collection("categories");
        const data = await collections
            .where('active', '==', true)
            .where('select_type', '==', 2)
            .get()
            .then((querySnapshot) => {
                const idToData = {};
                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    idToData[doc.id] = {
                        name: docData.name,
                        options: docData.options,
                        priority: docData.priority,
                    };
                });
                return idToData;
            });
        const filtersObj = {};

        const cat = await collections
            .where("active", "==", true)
            .where("select_type", "in", [1, 2])
            .get()
            .then((querySnapshot) => {
                const arr = [];
                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    arr.push({
                        name: docData.name,
                        options: docData.options,
                        priority: docData.priority,
                        id: doc.id,
                    });
                });
                return arr;
            });
        setCategories(cat);

        Object.keys(data).forEach((id) => {
            filtersObj[id] = [];
        });
        setFiltersState(filtersObj);
        setFiltersData(data);
    }

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

    const filterByTags = (temp) => {
        setTempProviders(temp);
        Object.keys(filtersState).forEach(filterName => {
            temp = temp.filter((provider) => {
                return provider[filterName]
                    ? provider[filterName].some(r => filtersState[filterName].includes(r)) || filtersState[filterName].length === 0
                    : false;
            });
        });
        setActiveProviders(temp);
    };

    const filterZipcode = async (filterVal) => {
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
            filterDistances.push({[distKey]: provider['miDistance']})
        });
        setDistances(filterDistances);
        setActiveProviders(filterActiveProviders);
        setZipProviders(filterActiveProviders);
    };

    const filterNormalFilters = (e) => {
        const filterName = e.target.name;
        const filterVal = e.target.value;
        if (e.target.type === "checkbox" && e.target.checked) {
            setFiltersState({
                ...filtersState,
                [filterName]: [...filtersState[filterName], filterVal],
            });
        } else if (e.target.type === "checkbox" && !e.target.checked) {
            setFiltersState({
                ...filtersState,
                [filterName]: filtersState[filterName].filter(function (
                    filter
                ) {
                    return filter !== filterVal;
                }),
            });
        }
    };

    const filterSearch = (filterVal) => {
        const regex = new RegExp(`${ filterVal.toLowerCase() }`, "gi");
        let temp = props.providers;
        if (searchZip != null && searchZip.length === 5) {
            temp = zipProviders;
        }
        temp = temp.filter((item) => regex.test(item.facilityName));
        filterByTags(temp);
    };

    const filterProviders = async(e) => {
        if (typeof e !== 'undefined') {
            const filtertype = e.target.getAttribute('filtertype');
            const filterVal = e.target.value;
            if (filtertype === 'search') {
                setSearchName(filterVal);
                filterSearch(filterVal)
            } else if (filtertype === 'zipcode') {
                setSearchZip(filterVal);
                if (filterVal.length === 5)
                    await filterZipcode(filterVal)
            } else {
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
                    setIsLoading(false)
                }
            )
        } else if (isEmpty(activeProviders) && isLoading) {
            setActiveProviders(providers);
            setIsLoading(false)
        }
    }, [props.providers]);

    useEffect(() => {
        if (activeProviders)
            filterSearch(searchName);
    }, [filtersState]);

    function switchView() {
        setListView(!listView);
    }

    function evaluateFilters() {
        let isFiltersEmpty = true;
        Object.keys(filtersState).map(item => {
            if (filtersState[item].length > 0) {
                isFiltersEmpty = false;
            }
        });
        return !isFiltersEmpty;
    }

    function clearFilters() {
        setFiltersState(Object.keys(filtersState).reduce((acc, cur) => {
            return {
                ...acc,
                [cur]: []
            }
        }, {}));
    }

    function renderTag(item, index) {
        return filtersState[item].map((title, key) =>
            <div
                className = "tag"
                style = {{ borderColor: colors[item], color: colors[item] } }
                key = { `${index}${key}` }>
                { title } <span className = "remove-tag"
                                onClick = {
                                    async () => {
                                        setFiltersState({
                                            ...filtersState,
                                            [item]: filtersState[item].filter(
                                                (i) => i !== title
                                            ),
                                        });
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
        let myDistance = null;
        if (distances && distances.length > 0) {
            myDistance = distances.find((x) => Object.keys(x)[0] === item.facilityName)[item.facilityName];
        }
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
                    <FaMapMarkerAlt size = "20px"/> { item.address[0] }
                        <div className = "row-spaced">
                            <div>
                                <FaPhone /> { item.phoneNum.join(', ') }
                            </div>
                            {
                                myDistance
                                &&
                                <small>
                                    <FaLocationArrow style = {{ marginRight: 8 }}/>
                                    { myDistance + ' mi' }
                                </small>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderTagControl = () => {
        return (
            <Fragment>
                {!condition && !isSticky && (
                    <div ref={ref} className="scroll-indicator" />
                )}
                <div className={classNames("filter-row", "padder")}>
                    {Object.entries(filtersData)
                        .filter(([key, value]) =>
                            Number.isInteger(value.priority)
                        )
                        .sort(
                            ([aKey, aValue], [bKey, bValue]) =>
                                aValue.priority - bValue.priority
                        )
                        .map(([key, value]) => renderDropdown(value.name, key))}

                    {moreFilter ? (
                        <Fragment>
                            {Object.entries(filtersData)
                                .filter(
                                    ([key, value]) =>
                                        !Number.isInteger(value.priority)
                                )
                                .sort(([aKey, aValue], [bKey, bValue]) =>
                                    aValue.name.localeCompare(bValue.name)
                                )
                                .map(([key, value]) =>
                                    renderDropdown(value.name, key)
                                )}
                            <Button
                                variant="link"
                                style={{ color: "red" }}
                                onClick={() => setMoreFilter(false)}
                            >
                                - {lessFilters}
                            </Button>
                        </Fragment>
                    ) : (
                        <Button
                            variant="link"
                            onClick={() => setMoreFilter(true)}
                        >
                            + {moreFilters}
                        </Button>
                    )}
                </div>
            </Fragment>
        );
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
                        filtersData[key].options.map((item, index) =>
                                <div
                                    onClick={
                                        () => filterProviders({
                                            target: {
                                                name: key,
                                                value: item.value,
                                                type: "checkbox",
                                                checked: !filtersState[key].includes(item.value),
                                                getAttribute: (param) => "normalfilter"
                                            }
                                        })
                                    }>
                                    <Form.Check
                                        className="dropdown-item"
                                        name = { key }
                                        key = { index }
                                        type = "checkbox"
                                        checked = { filtersState[key].includes(item.value) }
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

    // Localization is unused because it's hardcoded and doesn't fit with our dynamic model
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
        return <div className="spinner-wrap">
            <div className = "spinner" />
        </div>;

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
                                    {Object.keys(filtersState).map(renderTag)}
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
                            </div>
                            <div >
                                {
                                    width >= 768 && activeProviders && activeProviders[selectedIndex] &&
                                    <Modal
                                        show = { showModal }
                                        onHide = {() => setShowModal(false)}
                                        dialogClassName = "myModal"
                                        scrollable >
                                        <Modal.Header
                                            style = {{ backgroundColor: "#2F80ED" }}
                                            closeButton >
                                        </Modal.Header>
                                        <Modal.Body
                                            className = "modal-body" >
                                            <ProviderInfo item = { activeProviders[selectedIndex] } categories={categories}/>
                                        </Modal.Body>
                                    </Modal>
                                }
                                {
                                    width < 768 && activeProviders && activeProviders[selectedIndex] &&
                                    <Modal
                                        show = { showModal }
                                        onHide = {() => setShowModal(false)}
                                        dialogClassName = "modalMobile"
                                        scrollable >
                                            <Modal.Header
                                                className = "image-cover"
                                                style = {{ backgroundColor: "#2F80ED" }}
                                                closeButton >
                                            </Modal.Header>
                                            <Modal.Body
                                                className = "modal-body" >
                                                <ProviderInfoMobile item = { activeProviders[selectedIndex] } width={width} categories={categories}/>
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
};

export default compose(withFirestore, connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase
})))(Index);
