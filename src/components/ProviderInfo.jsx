import React, { Component } from 'react';
import { FaCheck, FaMapPin, FaPhone, FaGlobe } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const ProviderInfo = (props) =>
  <div>
    <Container>
      <Row>
            <Col lg={6} className="modal-col-flex-center">

            <Card>
              <Card.Img  src={'https://maps.googleapis.com/maps/api/staticmap?center='+props.item.latitude+","+props.item.longitude+'&zoom=13&scale=3&size=335x167&maptype=roadmap&key=AIzaSyCS2-Xa70z_LHWyTMvyZmHqhrYNPsDprMQ&format=png&visual_refresh=true' +
              "&markers="+props.item.latitude+","+props.item.longitude}
            alt="Google Map of bethanna">
              </Card.Img>
              <Card.Body style={{paddingTop: "10px", paddingBottom:"10px"}}>
                <Card.Text>

                  <div className="modal-card-text">
                  <FaMapPin style={{ paddingTop: "5px" }} /> &nbsp;
                    <div>
                    {props.item.address.toString().split(',').map(function (value, index) {
                      if (index === 0) {
                        return <div>{value}</div>;
                      } else if (index === props.item.address.toString().split(',').length - 1) {
                        return <div style={{ "display": "inline" }}>{value}<div><a href={"https://maps.google.com/?q=" + props.item.address.toString()} target="_blank">View on Maps</a></div></div>;
                      } else {
                        if (index === 1) {
                          return <div style={{ "display": "inline" }}>{value + ','}</div>;
                        }
                        return value + ',';
                      }

                    })}
                    </div>
                  </div>

                  <div className="modal-card-text">
                    <FaPhone style={{ paddingTop: "5px" }} /> &nbsp;
                    <div>
                      {props.item.phoneNum.join(', ')}
                    </div>
                  </div>

                  <div className="modal-card-text">
                    {props.item.website[0] ? <FaGlobe style={{ paddingTop: "5px" }} /> : <div />}
                    {props.item.website[0] ? <div> &nbsp;<a href={props.item.website[0]} target="_blank">Website</a></div> : <div />}
                  </div>

                </Card.Text>
              </Card.Body>
            </Card>


          </Col>

          <Col lg={6} className="modal-hours-backdrop">
            <Container>
              <h5 className="modal-center-text"><b>Hours</b></h5>
              <hr className="modal-hr" />
              <Row>
                <Col className="modal-col-flex-end">
                  <div>
                    Monday:
                  </div>
                </Col>
                <Col className="modal-col-flex-start">
                  <div> {props.item.hours.Monday ? props.item.hours.Monday.map(function (time, index) {
                    return formatTime(props.item.hours.Monday, time, index);
                  }) : 'CLOSED'
                  }</div>
                </Col>
              </Row>
              <Row>
                <Col className="modal-col-flex-end">
                  <div>
                    Tuesday:
                  </div>
                </Col>
                <Col className="modal-col-flex-start">
                  <div>{props.item.hours.Tuesday ? props.item.hours.Tuesday.map(function (time, index) {
                    return formatTime(props.item.hours.Tuesday, time, index);
                  }) : 'CLOSED'
                  }</div>
                </Col>
              </Row>

              <Row>
                <Col className="modal-col-flex-end">
                  <div>
                  Wednesday:
                  </div>
                </Col>
                <Col className="modal-col-flex-start">
                  <div> {props.item.hours.Wednesday ? props.item.hours.Wednesday.map(function (time, index) {
                    return formatTime(props.item.hours.Wednesday, time, index);
                  }) : 'CLOSED'
                  } </div>
                </Col>
              </Row>

              <Row>
                <Col className="modal-col-flex-end">
                  <div>
                   Thursday:
                  </div>
                </Col>
                <Col className="modal-col-flex-start">
                  <div>{props.item.hours.Thursday ? props.item.hours.Thursday.map(function (time, index) {
                    return formatTime(props.item.hours.Thursday, time, index);
                  }) : 'CLOSED'
                  }</div>
                </Col>
              </Row>

              <Row>
                <Col className="modal-col-flex-end">
                  <div>
                    Friday:
                  </div>
                </Col>
                <Col className="modal-col-flex-start">
                  <div> {props.item.hours.Friday ? props.item.hours.Friday.map(function (time, index) {
                    return formatTime(props.item.hours.Friday, time, index);
                  }) : 'CLOSED'
                  } </div>
                </Col>
              </Row>

              <Row>
                <Col className="modal-col-flex-end">
                  <div>
                    Saturday:
                  </div>
                </Col>
                <Col className="modal-col-flex-start">
                  <div>  {props.item.hours.Saturday ? props.item.hours.Saturday.map(function (time, index) {
                    return formatTime(props.item.hours.Saturday, time, index);
                  }) : 'CLOSED'
                  } </div>
                </Col>
              </Row>

              <Row>
                <Col className="modal-col-flex-end">
                  <div>
                    Sunday:
                  </div>
                </Col>
                <Col className="modal-col-flex-start">
                  <div>{props.item.hours.Sunday ? props.item.hours.Sunday.map(function (time, index) {
                    return formatTime(props.item.hours.Sunday, time, index);
                  }) : 'CLOSED'
                  }   </div>
                </Col>
              </Row>
            </Container>

          </Col>
        </Row>

        </Container>
        <br/>

        <div>
          <h5><b>Languages Spoken</b></h5>
          <hr className="modal-hr"/>
          <div>
          {props.item.languages.map(function(location, index) {
            if(index !== props.item.languages.length - 1){
              return <div className="modal-text">{location}, </div>;
            } else {
              return <div className="modal-text">{location}</div>;
            }
          })}
          </div>
        </div>
        <br/>

        <div>
          <h5><b>Ages</b></h5>
          <hr className="modal-hr" />
          {props.item.ages.map(function (age, index) {
            if (index !== props.item.ages.length - 1) {
              return <div className="modal-text">{age}, </div>;
            } else {
              return <div className="modal-text">{age}</div>;
            }
          })}
        </div>
        <br/>

        <div>
          <h5><b>Insurance Type Accepted</b></h5>
          <hr className="modal-hr" />
          {props.item.insurance.map(function (insur, index) {
            if (index !== props.item.insurance.length - 1) {
              return <div className="modal-text">{insur}, </div>;
            } else {
              return <div className="modal-text">{insur}</div>;
            }
          })}
        </div>
        <br/>

        <div>
          <h5><b>Service Types</b></h5>
          <hr className="modal-hr" />
          {props.item.serviceType.map(function (service, index) {
            if (index !== props.item.serviceType.length - 1) {
              return <div className="modal-text">{service}; </div>;
            } else {
              return <div className="modal-text">{service}</div>;
            }
          })}
        </div>
        <br />

        <div>
          <h5><b>Therapy Types</b></h5>
          <hr className="modal-hr" />
          {props.item.therapyTypes.map(function (therapy, index) {
            if (index !== props.item.therapyTypes.length - 1) {
              return <div className="modal-text">{therapy}; </div>;
            } else {
              return <div className="modal-text">{therapy}</div>;
            }
          })}
        </div>
        <br />

        <div>
          <h5><b>Specializations</b></h5>
          <hr className="modal-hr" />
          {props.item.specializations.map(function (special, index) {
            if (index !== props.item.specializations.length - 1) {
              return <div className="modal-text">{special}; </div>;
            } else {
              return <div className="modal-text">{special}</div>;
            }
          })}
        </div>
        <br />

        {/* TODO checkmarks for EPIC and Childcare change from alerts */}
        {props.item.childcare[0] ? <h5>ChildCare Available <FaCheck/><br /></h5> : <div />}
        {props.item.epic[0] ? <h5>EPIC Designation <FaCheck /><br /></h5> : <div />}
    </div>;


function formatTime(arr, time, index) {
  if (time == null) {
    if (index !== arr.length - 1) {
      return <div className="modal-text">CLOSED - </div>;
    } else {
      return <div className="modal-text">CLOSED</div>;
    }
  }
  let seconds = time
  let hours = Math.floor(seconds / 3600)
  let mins = seconds / 60 % 60
  let endtime_ending = hours < 12 ? "AM" : "PM"
  hours = hours % 12
  if(hours === 0) {
    hours = 12
  }
  if(mins < 10) {
    mins = "0" + mins
  }
  // time = Math.round(time/36);  //
  // if (time/100 > 12) { //check if hour
  //   time = time - 1200;
  //   endtime_ending = "PM";
  // }
  // let timestr = time.toString()
  // let timeformat = timestr.substring(0, timestr.length - 2) + ":" + timestr.substring(timestr.length - 2) + endtime_ending;
  let timeformat = `${hours}:${mins}${endtime_ending}`
  if (index !== arr.length - 1) {
    return <div className="modal-text">{timeformat} - </div>;
  } else {
    return <div className="modal-text">{timeformat}</div>;
  }
}



export default ProviderInfo;
