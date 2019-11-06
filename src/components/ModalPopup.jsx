import React, { Component } from 'react';
import { FaCheck, FaMapPin, FaPhone, FaGlobe } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


const ModalPopup = (props) =>
    <div>
    <Modal {...props} size="lg" scrollable="True">
      <Modal.Header className="modal-header" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h3>{props.item.facilityName}</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">

        <Container>
        <Row> 
            <Col md={6} className="modal-col-flex-center"> 
            <div>
              <FaMapPin/> &nbsp; 
              {props.item.address}
            </div>  
            <div> 
              <FaPhone/> &nbsp; 
              {props.item.phoneNum}
            </div> 
              {props.item.website[0] ? <div><FaGlobe /> &nbsp; {props.item.website[0]}</div> : <div></div>}
          </Col> 

          <Col md={6} className="modal-hours-backdrop"> 
            <h6 className="modal-center-text"><b>Hours</b></h6>
            <Container> 
            
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
            if(index != props.item.languages.length - 1){
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
            if (index != props.item.ages.length - 1) {
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
            if (index != props.item.insurance.length - 1) {
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
            if (index != props.item.serviceType.length - 1) {
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
            if (index != props.item.therapyTypes.length - 1) {
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
            if (index != props.item.specializations.length - 1) {
              return <div className="modal-text">{special}; </div>;
            } else {
              return <div className="modal-text">{special}</div>;
            }
          })}
        </div>
        <br />
        
        {/* TODO checkmarks for EPIC and Childcare change from alerts */}
        {props.item.childcare[0] ? <h5>ChildCare Available <FaCheck/><br /></h5> : <div></div>}
        {props.item.epic[0] ? <h5>EPIC Designation <FaCheck /><br /></h5> : <div></div>}

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
    </div>;


function formatTime(arr, time, index) { 
  if (time == null) {
    if (index != arr.length - 1) {
      return <div className="modal-text">CLOSED - </div>;
    } else {
      return <div className="modal-text">CLOSED</div>;
    }
  }
  let endtime_ending = "AM"; 
  time = Math.round(time/36);  //
  if (time/100 > 12) { //check if hour 
    time = time - 1200; 
    endtime_ending = "PM"; 
  }
  let timestr = time.toString()
  let timeformat = timestr.substring(0, timestr.length - 2) + ":" + timestr.substring(timestr.length - 2) + endtime_ending;
  if (index != arr.length - 1) {
    return <div className="modal-text">{timeformat} - </div>;
  } else {
    return <div className="modal-text">{timeformat}</div>;
  }
}



export default ModalPopup; 