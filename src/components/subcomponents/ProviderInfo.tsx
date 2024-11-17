import React, { useState, useEffect, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { withFirestore } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import LazyLoad from "react-lazy-load";
import { GOOGLE_API_KEY } from "../../config/keys";
import Linkify from "react-linkify";
import ProviderGalleryCarousel from "components/dashboard/ProviderGalleryCarousel";
import Collapsible from "components/collapsible";
import Directory from "components/dashboard/Directory";
import EmbedComponent from "components/dashboard/embed-component/EmbedComponent";
import DonutChart from "./chartcomponents/DonutChart";
import ProgressBar from "./chartcomponents/ProgressBar";
import LineChart from "./chartcomponents/LineChart";
import GeneralInfo from "components/dashboard/GeneralInfo";
import ReadMoreAndLess from "react-read-more-less";
import EventInfoComponent from "components/dashboard/EventInfoComponent";

const ProviderInfo = (props) => {
    const [image, setImage] = useState("bog");
    const [streetView, setStreetView] = useState("bog");
    const [isLoading, setIsLoading] = useState(true);
    const sections = props.item.content?.sections ?? [];

    const components = useMemo(() => {
        return sections.flatMap((section) => section.components);
    }, [sections]);

    const renderComponent = (component) => {
        const { type, data } = component;
        // console.log(data);
        switch (type) {
            case "Chart":
                switch (data.type) {
                    case "donut":
                        return (
                            <Collapsible
                                label={type}
                                style={{
                                    maxWidth: "1000px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <DonutChart
                                    data={data.data.donutData}
                                    buttonLink={data.data.buttonLink}
                                    buttonLabel={data.data.buttonLabel}
                                ></DonutChart>
                            </Collapsible>
                        );
                    case "progress":
                        return (
                            <Collapsible
                                label={type}
                                style={{
                                    maxWidth: "1000px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <ProgressBar
                                    current={data.data.current}
                                    total={data.data.total}
                                    units={data.data.units}
                                    buttonLink={data.data.buttonLink}
                                    buttonLabel={data.data.buttonLabel}
                                ></ProgressBar>
                            </Collapsible>
                        );
                    case "line":
                        return (
                            <Collapsible
                                label={type}
                                style={{
                                    maxWidth: "1000px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <LineChart
                                    title={data.title}
                                    data={data.data.lineData}
                                ></LineChart>
                            </Collapsible>
                        );
                    default:
                        return <></>;
                }
            case "Gallery":
                return (
                    <Collapsible
                        label={type}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <ProviderGalleryCarousel
                            slidesArray={data.slidesArray}
                        ></ProviderGalleryCarousel>
                    </Collapsible>
                );
            case "Directory":
                return (
                    <Collapsible
                        label={type}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <Directory directoryItems={data.items}></Directory>
                    </Collapsible>
                );
            case "Embed":
                const eventInfo = {
                    title: data.title,
                    videoUrl: data.embedLink,
                }
                return (
                    <Collapsible
                        label={eventInfo.title}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <EmbedComponent eventInfo={eventInfo}></EmbedComponent>
                    </Collapsible>
                );
            case "Text":
                return (
                    <Collapsible
                        label={data.title}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <EventInfoComponent description={data.description}></EventInfoComponent>
                    </Collapsible>
                );
            default:
                return <></>;
        }
    };

    useEffect(() => {
        // console.log(props.item.content);
        async function fetchData() {
            setIsLoading(true);
            try {
                const res2 = await fetch(
                    `https://maps.googleapis.com/maps/api/staticmap?center=${props.item.latitude},${props.item.longitude}&zoom=16&scale=2&size=335x250&maptype=roadmap&key=${GOOGLE_API_KEY}&format=png&visual_refresh=true` +
                    `&markers=${props.item.latitude},${props.item.longitude}`
                );
                setStreetView(res2.url);
                setImage(props.item.imageURL);
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [props.item]);

    if (isLoading) {
        return (
            <div className="spinner-wrap">
                <div className="spinner"></div>
            </div>
        );
    }

    const categoriesToUse = props.categories || [];



    return (
        <Container fluid className="provider-info-container">
            <Row className="mb-3">
                <Card style={{ width: "100%" }}>
                    <LazyLoad debounce={false} offsetVertical={500}>
                        <Card.Img style={{ maxHeight: "60vh", objectFit: "cover" }} src={image} />
                    </LazyLoad>
                </Card>
            </Row>
            <Row className="info-rows">
                <Col md={12}>
                    <Collapsible
                        label={"General Info"}
                        style={{
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                        containerStyle={{ placeItems: "flex-start", }}
                    >
                        <GeneralInfo item={props.item} />
                    </Collapsible>
                </Col>
            </Row>
            {components.map((component) => {
                // console.log(component);
                return (
                    <Row className="info-rows">
                        <Col md={12}>
                            {renderComponent(component)}
                        </Col>
                    </Row>
                );
            })}
            <div className="modalHeader">
                {categoriesToUse
                    .filter(
                        (category) =>
                            props.item[category.id] &&
                            props.item[category.id].length
                    )
                    .map((category) => (
                        <div>
                            <h5>{category.name}</h5>
                            <hr className="modal-hr" />
                            <div>
                                {category.select_type !== 0 ? (
                                    props.item[category.id].map(
                                        (selected, index) => {
                                            if (
                                                index !==
                                                props.item[category.id].length -
                                                    1
                                            ) {
                                                return (
                                                    <div className="modal-text">
                                                        {`${selected}, `}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div className="modal-text">
                                                    {selected}
                                                </div>
                                            );
                                        }
                                    )
                                ) : (
                                    <Linkify>
                                        <p>{props.item[category.id]}</p>
                                    </Linkify>
                                )}
                            </div>
                            <br />
                        </div>
                    ))}
            </div>
        </Container >
    );
};

export default compose<any>(
    withFirestore,
    connect((state: Storage) => ({
        providers: state.firestore.ordered.providers,
        firebase: state.firebase,
    }))
)(ProviderInfo);
