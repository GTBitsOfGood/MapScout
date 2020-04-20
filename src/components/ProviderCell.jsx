import Badge from "react-bootstrap/Badge";
import React, {useEffect, useState} from "react";
import { FaMapMarkerAlt, FaPhone, FaTimesCircle, FaLocationArrow, FaMap } from "react-icons/fa";
import LazyLoad from 'react-lazy-load';
import API_KEY from "../config/keys";

var classNames = require('classnames');

export default ({item, index, onMouseEnter, onClick, distances}) => {
    let myDistance = null;
    if (distances && distances.length > 0) {
        myDistance = distances.find((x) => Object.keys(x)[0] === item.facilityName)[item.facilityName];
    }

    const [image, setImage] = useState("bog");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function fetchData() {
            try {
                if (typeof item.imageURL === 'string') {
                    await setImage(item.imageURL);
                } else {
                    const res = await fetch(`https://maps.googleapis.com/maps/api/streetview?size=100x100&location=${item.latitude},${item.longitude}&fov=80&heading=70&pitch=0&key=${API_KEY}`);
                    setImage(res.url);
                }
                setIsLoading(false);
            } catch (e) {
                console.log(e);
                setIsLoading(false);
            }
        }
        fetchData();
    },[]);

    return (
        <div
            className = "map-cell padder row-nowrap"
            key = { index }
            style = {{
                borderTopWidth: index === 0 ? 0 : 1,
                paddingTop: index === 0 ? 0 : 18,
            }}
            onMouseEnter={onMouseEnter}
            onClick = {onClick} >
            <LazyLoad
                width={100}
                height={100}
                debounce={false}
                offsetVertical={500}>
                <img
                    src={image}
                    className={classNames("provider-cell-image", {"blur": isLoading})}
                    alt=""/>
            </LazyLoad>
            <div style={{ marginLeft: 12 }}>
                <h5>
                    <b style={{ marginRight: 20 }}>{ item.facilityName }</b>
                    {props.item.therapyTypes && item.therapyTypes.includes('Pri-CARE') &&
                    <Badge
                        style={{ marginRight: 20 }}
                        variant = "primary" >Pri-CARE</Badge>
                    }
                    {props.item.therapyTypes && item.therapyTypes.includes('TF-CBT') &&
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
