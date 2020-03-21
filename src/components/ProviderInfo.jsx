import React, { Component } from 'react';
import {
  FaMapMarkerAlt, FaCheck, FaRegClock
} from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import API_KEY from "../config/keys";
import modalimage from "../assets/img/modalimage.png";
import Badge from 'react-bootstrap/Badge';
import {FiGlobe, FiPhone} from 'react-icons/fi';

const ProviderInfo = (props) => (
  <div style = {{padding: "1vh 4vw"}}>
    <Row>
      <Row>
        <Col className = "modalImage">
          <Card>
            <Card.Img
              src={modalimage}
              alt="child therapy"
            >
            </Card.Img>
          </Card>
        </Col>

        <Col xs = {7}>
          <div className = "desc-Box">
            <h3 style = {{paddingBottom: "0px"}}>{props.item.facilityName}</h3>
              <div style = {{paddingBottom: "25px"}}>
                {props.item.therapyTypes.includes('Pri-CARE') &&
                    <Badge
                        className= "label"
                        variant = "primary" >Pri-CARE</Badge>
                }
                {props.item.therapyTypes.includes('TF-CBT') &&
                    <Badge
                        className = "label"
                        variant = "primary" >TF-CBT</Badge>
                }
              </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
        </Col>
      </Row>
      <Row style = {{paddingTop: "15px"}}>
        <Col xs = {7}>
        <div className="modal-card-text">
          <FaMapMarkerAlt size = '20px' style={{ paddingTop: '5px' }, {color: "#007bff"}} />
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
          <FiPhone size = '20px' style={{ paddingTop: '5px'}, {color: "#007bff"}} />
          <div style = {{paddingLeft: "15px"}}>
            {props.item.phoneNum.join(', ')}
          </div>
        </div>

        <div className="modal-card-text">
          {props.item.website[0] ? <FiGlobe size = '20px' style={{ paddingTop: '5px' }, {color: "#007bff"}} /> : <div />}
          {props.item.website[0] ? (
            <div style = {{paddingLeft: "15px"}}>
              <a href={props.item.website[0]} target="_blank">{props.item.website[0]}</a>
            </div>
          ) : <div />}
        </div>
        <Row>
        <div className = "modal-hours">
          <FaRegClock size = '20px'style = {{paddingTop: '5px'}, {color: "#007bff"}}/>
          <div className = 'modal-hours-container'>
          <Container>
            <h5>Hours</h5>
            <hr className="modal-hr" />
            {calculateHours(props)}
          </Container>
          </div>
          </div>
          </Row>
        </Col>
        <Col>
        <Card>
            <div>
            <a href = {`https://maps.google.com/?q=${props.item.address.toString()}`} target="_blank">
            <Card.Img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${props.item.latitude},${props.item.longitude}&zoom=16&scale=2&size=335x250&maptype=roadmap&key=${API_KEY}&format=png&visual_refresh=true`
              + `&markers=${props.item.latitude},${props.item.longitude}`}
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
    <div>
      <h5>Languages Spoken</h5>
      <hr className="modal-hr" />
      <div>
        {props.item.languages.map((location, index) => {
          if (index !== props.item.languages.length - 1) {
            return (
              <div className="modal-text">
                {location}
,
                {' '}
              </div>
            );
          }
          return <div className="modal-text">{location}</div>;
        })}
      </div>
    </div>
    <br />

    <div>
      <h5>Ages</h5>
      <hr className="modal-hr" />
      {props.item.ages.map((age, index) => {
        if (index !== props.item.ages.length - 1) {
          return (
            <div className="modal-text">
              {age}
,
              {' '}
            </div>
          );
        }
        return <div className="modal-text">{age}</div>;
      })}
    </div>
    <br />

    <div>
      <h5>Insurance Type Accepted</h5>
      <hr className="modal-hr" />
      {props.item.insurance.map((insur, index) => {
        if (index !== props.item.insurance.length - 1) {
          return (
            <div className="modal-text">
              {insur}
,
              {' '}
            </div>
          );
        }
        return <div className="modal-text">{insur}</div>;
      })}
    </div>
    <br />

    <div>
      <h5>Service Types</h5>
      <hr className="modal-hr" />
      {props.item.serviceType.map((service, index) => {
        if (index !== props.item.serviceType.length - 1) {
          return (
            <div className="modal-text">
              {service}
;
              {' '}
            </div>
          );
        }
        return <div className="modal-text">{service}</div>;
      })}
    </div>
    <br />

    <div>
      <h5>Therapy Types</h5>
      <hr className="modal-hr" />
      {props.item.therapyTypes.map((therapy, index) => {
        if (index !== props.item.therapyTypes.length - 1) {
          return (
            <div className="modal-text">
              {therapy}
;
              {' '}
            </div>
          );
        }
        return <div className="modal-text">{therapy}</div>;
      })}
    </div>
    <br />

    <div>
      <h5>Specializations</h5>
      <hr className="modal-hr" />
      {props.item.specializations.map((special, index) => {
        if (index !== props.item.specializations.length - 1) {
          return (
            <div className="modal-text">
              {special}
;
              {' '}
            </div>
          );
        }
        return <div className="modal-text">{special}</div>;
      })}
    </div>
    <br />

    {/* TODO checkmarks for EPIC and Childcare change from alerts */}
    {props.item.childcare[0] ? (
      <h5>
ChildCare Available 
        <FaCheck />
        <br />
      </h5>
    ) : <div />}
    {props.item.epic[0] ? (
      <h5>
EPIC Designation
        <FaCheck />
        <br />
      </h5>
    ) : <div />}
  </div>
  </div>
);

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
    children.push(<Col className="modal-col-flex-start">{props.item.hours[days[startandFinish[i]]] ? props.item.hours[days[startandFinish[i]]].map((time, index) => formatTime(props.item.hours[days[startandFinish[i]]], time, index)) : 'CLOSED'}</Col>)
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


export default ProviderInfo;
