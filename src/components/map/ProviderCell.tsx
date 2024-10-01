import Badge from "react-bootstrap/Badge";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaLocationArrow } from "react-icons/fa";
import LazyLoad from "react-lazy-load";
//import { GOOGLE_API_KEY } from '../../config/keys';

const classNames = require("classnames");

export default ({
    item,
    index,
    onMouseEnter,
    onClick,
    distances,
    primaryColor,
}) => {
    const [image, setImage] = useState("bog");
    const [myDistance, setMyDistance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (distances && distances.length > 0) {
            setMyDistance(
                distances.find((x) => Object.keys(x)[0] === item.facilityName)[
                    item.facilityName
                ]
            );
        } else if (myDistance) {
            setMyDistance(null);
        }
    }, [distances, item.facilityName, myDistance]);

    useEffect(() => {
        async function fetchData() {
            try {
                await setImage(item.imageURL);
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [item.imageURL]);

    return (
        <div
            className="map-cell padder row-nowrap"
            key={index}
            style={{
                borderLeftColor: primaryColor,
                borderTopWidth: index === 0 ? 0 : 1,
                paddingTop: 18,
                width: "100%",
            }}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            <LazyLoad
                width={100}
                height={100}
                debounce={false}
                offsetVertical={500}
            >
                <img
                    src={image}
                    className={classNames("provider-cell-image", {
                        blur: isLoading,
                    })}
                    alt=""
                />
            </LazyLoad>
            <div style={{ marginLeft: 12, width: "100%" }}>
                <h5>
                    <b style={{ marginRight: 20 }}>{item.facilityName}</b>
                    {item.therapyTypes &&
                        item.therapyTypes.includes("Pri-CARE") && (
                            <Badge
                                style={{
                                    marginRight: 20,
                                    backgroundColor: primaryColor,
                                }}
                                variant="primary"
                            >
                                Pri-CARE
                            </Badge>
                        )}
                    {item.therapyTypes &&
                        item.therapyTypes.includes("TF-CBT") && (
                            <Badge
                                style={{ backgroundColor: primaryColor }}
                                variant="primary"
                            >
                                TF-CBT
                            </Badge>
                        )}
                </h5>
                <div style={{ color: "gray" }}>
                    {item.address[0]}
                    <div className="row-spaced">
                        <div>
                            {item.phoneNum.join(", ")}
                        </div>
                        {myDistance && (
                            <small>
                                <FaLocationArrow style={{ marginRight: 8 }} />
                                {`${myDistance} mi`}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
