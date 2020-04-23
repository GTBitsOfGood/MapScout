import React, { Component, useState, useEffect } from 'react';
import {
  FaMapMarkerAlt, FaRegClock, FaPhone
} from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import API_KEY from "../config/keys";
import { withFirestore } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import Badge from 'react-bootstrap/Badge';
import {FiGlobe} from 'react-icons/fi';
import ReadMoreAndLess from 'react-read-more-less';
import LazyLoad from "react-lazy-load";

const ProviderInfo = (props) => {
  const [image, setImage] = useState("bog");
  const [streetView, setStreetView] = useState("bog");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
     try {
         const res2 = await fetch(`https://maps.googleapis.com/maps/api/staticmap?center=${props.item.latitude},${props.item.longitude}&zoom=16&scale=2&size=335x250&maptype=roadmap&key=${API_KEY}&format=png&visual_refresh=true`
             + `&markers=${props.item.latitude},${props.item.longitude}`);
         setStreetView(res2.url);
         if (typeof props.item.imageURL === 'string') {
             setImage(props.item.imageURL);
         } else {
             const res = await fetch(`https://maps.googleapis.com/maps/api/streetview?size=500x500&location=${props.item.latitude},${props.item.longitude}&fov=80&heading=70&pitch=0&key=${API_KEY}`);
             setImage(res.url);
         }
         setIsLoading(false);
     } catch (e) {
         console.log(e);
         setIsLoading(false);
     }
    }
    fetchData();
  },[props.item]);

  const categoriesToUse = props.categories || [];

  if (isLoading) {
      return <div className="spinner-wrap">
          <div className = "spinner" />
      </div>;
  }

  return (
  <div style = {{padding: "1vh 4vw"}}>
    <Row>
      <Row>
        <Col className = "modalImage">
          <Card>
              <LazyLoad
                  debounce={false}
                  offsetVertical={500}>
                <Card.Img
                    src={image} />
              </LazyLoad>
          </Card>
        </Col>
        <Col xs = {7}>
          <div className = "desc-Box">
            <h3 style = {{paddingBottom: "0px"}}>{props.item.facilityName}</h3>
              {props.item.description !== undefined && <ReadMoreAndLess
                  charLimit={250}
                  readMoreText="Read more"
                  readLessText="Read less"
              >
                  {props.item.description + " "}
              </ReadMoreAndLess>}
          </div>
        </Col>
      </Row>
      <Row style = {{paddingTop: "20px", paddingRight: "19px"}}>
        <Col xs = {7}>
        <div className="modal-card-text">
          <FaMapMarkerAlt size = '20px' style={{ paddingTop: '5px', color: "#007bff"}} />
          <div style = {{paddingLeft: "15px"}}>
            {props.item.address.toString().split(',').map((value, index) => {
              if (index === 0) {
                return <div style = {{display: 'inline'}}>{value},</div>;
              } if (index === props.item.address.toString().split(',').length - 1) {
                return (
                      <div style={{ display: 'inline' }}>
                        {value}
                      </div>
                );
              }
              if (index === 1) {
                return <div style={{ display: 'inline' }}>{`${value},`}</div>;
              }
              return `${value},`;
            })}
          </div>
        </div>

        <div className="modal-card-text">
          <FaPhone size = '20px' style={{ paddingTop: '5px', color: "#007bff"}} />
          <div style = {{paddingLeft: "15px"}}>
            {props.item.phoneNum && props.item.phoneNum.join(', ')}
          </div>
        </div>

        <div className="modal-card-text">
          {props.item.website && props.item.website[0] ? <FiGlobe size = '20px' style={{ paddingTop: '5px', color: "#007bff"}} /> : <div />}
          {props.item.website && props.item.website[0] ? (
            <div style = {{paddingLeft: "15px"}}>
              <a href={props.item.website[0]} target="_blank">{props.item.website[0]}</a>
            </div>
          ) : <div />}
        </div>
        <div className = "modal-card-text">
          <FaRegClock size = '20px'style = {{paddingTop: '5px', color: "#007bff"}}/>
          <div className = 'modal-hours-container'>
          <Container>
            <h5>Hours</h5>
            <hr className="modal-hr" />
            {props.item.hours && calculateHours(props)}
          </Container>
          </div>
          </div>
        </Col>
        <Col>
        <Card>
            <div>
            <a href = {`https://maps.google.com/?q=${props.item.address.toString()}`} target="_blank">
            <Card.Img
              src={streetView}
              alt="Google Map of bethanna"
            >
            </Card.Img>
            </a>
            </div>
          </Card>
        </Col>
      </Row>

    </Row>
    <br />

    <div className = "modalHeader">
      {
          categoriesToUse
          .filter((category) => props.item[category.id] && props.item[category.id].length && category.select_type !== 0)
          .map((category) => {
              console.log(props.item[category.id]);
          return (
            <div>
              <h5>{category.name}</h5>
              <hr className="modal-hr" />
              <div>
                {props.item[category.id].map((selected, index) => {
                  if (index !== props.item[category.id].length - 1) {
                    return (
                      <div className="modal-text">
                        {`${selected}, `}
                      </div>
                    );
                  }
                  return <div className="modal-text">{selected}</div>;
                })}
              </div>
              <br />
            </div>
          );
        })
      }

    {/* TODO checkmarks for EPIC and Childcare change from alerts */}

  </div>
  </div>
)};

function calculateHours(props) {
  var rows = []
  let startandFinish = [0] //In pairs, keep track of the starting and ending days with same time
  let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  let abbrevDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  for (var i = 1; i < 7; i++) {
    //not both undefined
    if (props.item.hours[days[i]] != props.item.hours[days[i-1]]) {
      if (!props.item.hours[days[i]] || !props.item.hours[days[i-1]] ||props.item.hours[days[i]][0] != props.item.hours[days[i-1]][0]
      || props.item.hours[days[i]][1] != props.item.hours[days[i-1]][1]) {
        startandFinish.push(i - 1)
        startandFinish.push(i)
      }
    }
    if (i == 6) {
        startandFinish.push(6)
      }
  }
  for (var i = 0; i < startandFinish.length; i = i + 2) {
    let children = []
    if (startandFinish[i] == startandFinish[i+1]) {
      children.push(<Col className="modal-col-flex-end" sm={5}>{days[startandFinish[i]]}</Col>)
    } else  {
      let subchild = [<div>{abbrevDays[startandFinish[i]]} - {abbrevDays[startandFinish[i + 1]]}</div>]
    children.push(<Col className="modal-col-flex-end" sm = {5}>{subchild}</Col>)
    }
    children.push(<Col className="modal-col-flex-start">{props.item.hours[days[startandFinish[i]]] ? props.item.hours[days[startandFinish[i]]].map((time, index) => formatTime(props.item.hours[days[startandFinish[i]]], time, index)) : 'CLOSED'}</Col>);
    rows.push(<Row>{children}</Row>)
  }
  return rows

//   <Row>
//   <Col className="modal-col-flex-end" sm={5}>
//     <div>
//         Monday
//     </div>
//   </Col>
//   <Col className="modal-col-flex-start">
//     <div>
//       {' '}
//       {props.item.hours.Monday ? props.item.hours.Monday.map((time, index) => formatTime(props.item.hours.Monday, time, index)) : 'CLOSED'}
//     </div>
//   </Col>
// </Row>
}

function formatTime(arr, time, index) {
  if (time == null) {
    if (index !== arr.length - 1) {
      return <div className="modal-text">CLOSED - </div>;
    }
    return <div className="modal-text">CLOSED</div>;
  }
  const seconds = time;
  let hours = Math.floor(seconds / 3600);
  let mins = seconds / 60 % 60;
  const endtime_ending = hours < 12 ? 'AM' : 'PM';
  hours %= 12;
  if (hours === 0) {
    hours = 12;
  }
  if (mins < 10) {
    mins = `0${mins}`;
  }
  // time = Math.round(time/36);  //
  // if (time/100 > 12) { //check if hour
  //   time = time - 1200;
  //   endtime_ending = "PM";
  // }
  // let timestr = time.toString()
  // let timeformat = timestr.substring(0, timestr.length - 2) + ":" + timestr.substring(timestr.length - 2) + endtime_ending;
  const timeformat = `${hours}:${mins}${endtime_ending}`;
  if (index !== arr.length - 1) {
    return (
      <div className="modal-text">
        {timeformat}
        {' '}
-
        {' '}
      </div>
    );
  }
  return <div className="modal-text">{timeformat}</div>;
}


export default compose(
    withFirestore,
    connect((state) => ({
        providers: state.firestore.ordered.providers,
        firebase: state.firebase,
    }))
)(ProviderInfo);
