import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Modal} from 'react-bootstrap';
import { useFormFields } from "../Components/customHooks/formFields";
import db from '../firebase';
import {FcAcceptDatabase} from 'react-icons/fc';
import '../styles/Registration.css';
import ShortUniqueId from "short-unique-id";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    TeamName:"",
    teamLeaderName:"",
    teamLeaderCollege:"",
    teamLeaderEmail:"",
    teamLeaderPhNo:"",
    participant1Name:"",
    participant1College:"",
    participant1Email:"",
    participant1PhNo:"",
    participant2Name:"",
    participant2College:"",
    participant2Email:"",
    participant2PhNo:"",
  });
  const [errors, setErrors]= useState([]);
  const [showModal, setShowModal]= useState(false);
  const [uuid, setUuid]=useState("");
  const handleClose = () => setShowModal(false);
  const handleShow =() => setShowModal(true);
  async function validateTeamName(teamName){
    console.log('Validating Team Name '+ teamName);
    const teamNameRef= db.collection('people');
    const query = teamNameRef.where("TeamName","==", String(teamName))
    var res = false;
    query.get().then((querySnapShot)=>{
      console.log('team name validity')
      console.log(querySnapShot.size)
      if(querySnapShot.size>0){
        console.log('invalid')
        setErrors([...errors,'Team Name Already Exists']);
        res =false;
      }
      else{
        console.log('valid')
        res= true;
      }
    })
    console.log('Validated Team Name  = '+teamName+ " "+"result = "+res);
    return res;
  }
  async function validateEmail(emailID, errorMsg){
    const emailRef= db.collection('emails')
    console.log('validating email '+ emailID);
    var res = false;
    if(emailID!="")
    { 
      const query = emailRef.where("email","==", emailID)
      query.get().then((querySnapShot) =>{
        console.log(querySnapShot.size);
        if(querySnapShot.size>0){
          setErrors([...errors,errorMsg]);
          res = false;
        } else{
          res = true;
        }
      })
    }
    console.log('Validated email='+ emailID+ " "+"result = "+res);
    return res;
  }
  async function validatePhNo(PhNo, errorMsg){
    console.log('Validating Phone Number '+PhNo);
    const PhoneNumRef= db.collection('phone_numbers');
    var res = false;
    if(PhNo!=""){
      const query = PhoneNumRef.where("PhoneNumber","==", PhNo)
      query.get().then((querySnapShot) =>{
        if(querySnapShot.size>0){
          setErrors([...errors,errorMsg]);
          console.log('false');
          res = false;
        } else{
          res = true;
        }
      })
    } 
    console.log("Validated Phone Number ="+ PhNo+ " "+"result = "+res);
    return res;
  }
  async function validateForm() {
    /*
    return (
      await validateTeamName(fields.TeamName)
        & await validateEmail(fields.teamLeaderEmail,"Team Leader Email Registered") & await validateEmail(fields.participant1Email,"Participant 1 Email Registered") & await validateEmail(fields.participant2Email,"Participant 2 Email Registered")
      & await validatePhNo(fields.teamLeaderPhNo,"Team Leader Phone Number Registered") & await validatePhNo(fields.participant1PhNo,"Participant 1 Phone Number Registered") & await validatePhNo(fields.participant2PhNo,"Participant 2 Phone Number Registered")
    );
    */
   return true;
  }
  const genId= () =>{
    const uid= new ShortUniqueId();
    var str = "par-"+String(uid.stamp(10));
    return str
}
  async function handleSubmit(event) {
    event.preventDefault();
    var temp= genId();
    setUuid(temp);
    var res= true;
    const promiseN= new Promise((myResolve, myReject) =>{
      res= validateForm();
      myResolve(res);
      myReject("Error Occured")
    }).then((res)=>{
      console.log('promise entered = '+ res);
      if(res){
        const dataEntered={
          uuid: uuid,
          TeamName: fields.TeamName,
          teamLeaderName:fields.teamLeaderName,
          teamLeaderCollege:fields.teamLeaderCollege,
          teamLeaderEmail:fields.teamLeaderEmail,
          teamLeaderPhNo:fields.teamLeaderPhNo,
          participant1Name:fields.participant1Name,
          participant1College:fields.participant1College,
          participant1Email:fields.participant1Email,
          participant1PhNo:fields.participant1PhNo,
          participant2Name:fields.participant2Name,
          participant2College:fields.participant2College,
          participant2Email:fields.participant2Email,
          participant2PhNo:fields.participant2PhNo,
          currentQuestionNumber: 0,
          points: 0, 
        }
        db.collection('people')
        .doc(uuid)
        .set(dataEntered)
        
        db.collection('emails')
        .doc(fields.teamLeaderEmail)
        .set({
          "email":fields.teamLeaderEmail
        })
    
        db.collection('phone_numbers')
        .doc(fields.teamLeaderPhNo)
        .set({
          "PhoneNumber":fields.teamLeaderPhNo
        })
    
        if(fields.participant1Email!="")
        {
          db.collection('emails')
          .doc(fields.participant1Email)
          .set({
            "email":fields.participant1Email
          })
        }
        if(fields.participant2Email!="")
        {
          db.collection('emails')
          .doc(fields.participant2Email)
          .set({
            "email":fields.participant2Email
          })
        }
    
        if(fields.participant1PhNo!="")
        {
          db.collection('phone_numbers')
          .doc(fields.participant1PhNo)
          .set({
            "PhoneNumber":fields.participant1PhNo
          })
        }
        if(fields.participant2PhNo!="")
        {
          db.collection('phone_numbers')
          .doc(fields.participant2PhNo)
          .set({
            "PhoneNumber":fields.participant2PhNo
          })
        }
        setShowModal(true);
        console.log('Registration Succesfull');
      }
        else{
          console.log("registration unsuccesful");
          console.log(errors)
          setErrors([]);
          //alert('Registration Unsuccesful');
        }      
    },(error)=>{
      console.log(error);
    })
    
  }

  function renderForm() {
    return (
      <>
      <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
              <Modal.Title><FcAcceptDatabase size={52} />Your Response has been Recorded</Modal.Title>
          </Modal.Header>

          {/* Modal for accepting form inputs */}
          <Modal.Body>
            <div>
              <h1>Form Filled Up as Follows: </h1>
              <div>
                  <h3>uuid : </h3>
                  <h3>Team Name : {fields.TeamName}</h3>
                  <h3>Team Leader Name : {fields.teamLeaderName} </h3>
                  <h3>Team Leader Email : {fields.teamLeaderEmail}</h3>
                  <h3>Team Leader PhoneNumber : {fields.teamLeaderPhNo} </h3>
                  <h3>Team Leader College : {fields.teamLeaderCollege}</h3>
              </div>
              <h3>Please note the Following Points : </h3>
              <p>Please note the uuid assigned to you as it would be used for signing in during the event</p>
              <p>If you have registered from multiple teams note that only your first registration would be considered</p>
              <p>Please note that your final acceptance would be revealed before the event.</p>
            </div>
          </Modal.Body>

          <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                  Close
              </Button>
          </Modal.Footer>
      </Modal>
      <Form onSubmit={handleSubmit}>
      <h1 className ="Text-info">Registration</h1>
        <Form.Group controlId="TeamName" size="lg">
          <Form.Label>Team Name*</Form.Label>
          <Form.Control
            required
            type="text"
            value={fields.TeamName}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="teamLeaderName" size="lg">
          <Form.Label>Team Leader Name*</Form.Label>
          <Form.Control
            required
            type="text"
            value={fields.teamLeaderName}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="teamLeaderCollege" size="lg">
          <Form.Label>Team Leader College*</Form.Label>
          <Form.Control
            required
            type="text"
            value={fields.teamLeaderCollege}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="teamLeaderEmail" size="lg">
          <Form.Label>Team Leader Email*</Form.Label>
          <Form.Control
            required
            type="email"
            value={fields.teamLeaderEmail}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="teamLeaderPhNo" size="lg">
          <Form.Label>Team Leader WhatsApp Number*</Form.Label>
          <Form.Control
            required
            type="text"
            value={fields.teamLeaderPhNo}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant1Name" size="lg">
          <Form.Label>Name of Participant 1</Form.Label>
          <Form.Control
            type="text"
            value={fields.participant1Name}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant1College" size="lg">
          <Form.Label>College of Participant 1</Form.Label>
          <Form.Control
            
            type="text"
            value={fields.participant1College}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant1Email" size="lg">
          <Form.Label>Email of Participant 1</Form.Label>
          <Form.Control
            
            type="email"
            value={fields.participant1Email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant1PhNo" size="lg">
          <Form.Label>Phone Number of Participant 1</Form.Label>
          <Form.Control
            
            type="text"
            value={fields.participant1PhNo}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant2Name" size="lg">
          <Form.Label>Name of Participant 2</Form.Label>
          <Form.Control
            
            type="text"
            value={fields.participant2Name}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant2College" size="lg">
          <Form.Label>College of Participant 2</Form.Label>
          <Form.Control
            
            type="text"
            value={fields.participant2College}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant2Email" size="lg">
          <Form.Label>Email of Participant 2</Form.Label>
          <Form.Control
            
            type="email"
            value={fields.participant2Email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant2PhNo" size="lg">
          <Form.Label>Phone Number of Participant 2</Form.Label>
          <Form.Control
            
            type="text"
            value={fields.participant2PhNo}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <br/>
        <Button
          block
          size="lg"
          type="submit"
          variant="success"
        >
          Register
        </Button>
        
      </Form>
    </>
    );
  }

  return (
    <div className="Signup">
      {renderForm()}
    </div>
  );
}