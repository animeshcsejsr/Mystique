import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Container, Modal} from 'react-bootstrap';
import { useFormFields } from "../Components/customHooks/formFields";
import db from '../firebase';
import {FcAcceptDatabase} from 'react-icons/fc';
import {VscError} from 'react-icons/vsc'
import '../styles/Registration.css';
import ShortUniqueId from "short-unique-id";

export default function Signup() {
  const uid= new ShortUniqueId();
  const [existingEmails, setExistingEmails] = useState([]);
  const [existingPhNo, setExistingPhNo] = useState([]);
  useEffect(() =>{
        const queryEmail= db.collection('emails');
        document.title= "Registration"
        var emails=[], phnos=[];
        queryEmail.onSnapshot((snapshot)=>{
          snapshot.forEach((doc)=>{
            emails.push(doc.data().email);
          })
          setExistingEmails(emails);
        })
        const queryPhone = db.collection('phone_numbers');
        queryPhone.onSnapshot((snapshot)=>{
          snapshot.forEach((doc)=>{
            phnos.push(doc.data().PhoneNumber);
          })
          setExistingPhNo(phnos);
        })
        
        setUuid("par-"+uid.stamp(10));
  },[])
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
  const [isRegistered, setIsRegistered]= useState(false);
  const [errors, setErrors]= useState([]);
  const [showSuccessModal, setShowSuccessModal]= useState(false);
  const [showErrModal, setShowErrModal]= useState(false);
  const [uuid, setUuid]=useState("");
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setIsRegistered(true);
  }
  const handleErrClose =() => {
    setErrors([]);
    setShowErrModal(false)
  };

  async function validateEmail(emailID, errorMsg){
      if(emailID==="")
        return true;
      if(existingEmails.includes(emailID)){
        var temp = errors;
        temp.push(errorMsg);
        setErrors(temp);
        return false;
      }else{
        return true;
      }
  }
  async function validatePhNo(PhNo, errorMsg){
    if(PhNo===""){
      return true;
    }
    if(PhNo.length!=10)
    {
      var temp=errors;
      temp.push(errorMsg+"Phone Number is not a valid number");
      setErrors(temp);
      return false;
    }

    if(!existingPhNo.includes(PhNo))
    {
        return true;
    }else{
      var temp= errors;
      temp.push(errorMsg+"Phone Number has already been registered");
      setErrors(temp);
      return false;
    }
  }
  async function formValidated() {
      return(
        await validateEmail(fields.teamLeaderEmail,"Team Leader's Email Already Registered") & await validateEmail(fields.participant1Email,"Participant 1's Email Already Registered") & await validateEmail(fields.participant2Email,"Participant 2's Email Already Registered")
      & await validatePhNo(fields.teamLeaderPhNo,"Team Leader's ") & await validatePhNo(fields.participant1PhNo,"Participant 1's ") & await validatePhNo(fields.participant2PhNo,"Participant 2's  ")
      );
  }
  const genId= () =>{
    const uid= new ShortUniqueId();
    var str = "par-"+uid.stamp(10);
    return str
}
  async function handleSubmit(event) {
    event.preventDefault();
    if(await formValidated()){
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
        setShowSuccessModal(true);
      }
        else{
          setShowErrModal(true);
        }      
  }
  function thankYouPage() {

    return(
      <Container fluid>
      <div className="thankYouPage">
        <h1 className="Text-info">Thank You For Registering</h1>
        <h4>Team Name  : <span className="uuid">{fields.TeamName}</span></h4>
        <h4>Your uuid  : <span className="uuid">{uuid}</span></h4>
        <h4>Team Leader Name  : <span className="uuid">{fields.teamLeaderName}</span></h4>
        <h4>Team Leader Email  : <span className="uuid">{fields.teamLeaderEmail}</span></h4>
        <h4>Team Leader Phone Number  : <span className="uuid">{fields.teamLeaderPhNo}</span></h4>
        <br/>
        <h5>Please Note the uuid, as it would be required during the Event </h5>
        <h5>We would be contacting you shortly, through the details that you have provided</h5>
      </div>
      </Container>
      );
  }
  function renderForm() {
    return (
      <>
      <Modal show={showSuccessModal} onHide={handleSuccessClose}>
          <Modal.Header closeButton>
              <Modal.Title><FcAcceptDatabase size={52} />Your Response has been Recorded</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <h1>Form Filled Up as Follows: </h1>
              <div>
                  <h3>uuid : <span className="uuid">{uuid}</span></h3>
                  <h3>Team Name : {fields.TeamName}</h3>
                  <h3>Team Leader Name : {fields.teamLeaderName} </h3>
                  <h3>Team Leader Email : {fields.teamLeaderEmail}</h3>
                  <h3>Team Leader PhoneNumber : {fields.teamLeaderPhNo} </h3>
                  <h3>Team Leader College : {fields.teamLeaderCollege}</h3>
              </div>
              <h3>Please note the Following Points : </h3>
              <p>Please note the uuid assigned to you as it would be used for signing in during the event</p>
              <p>If you have registered from multiple teams note that only your first registration would be considered</p>
              <p>Please note that the final acceptance would be revealed before the event.</p>
            </div>
          </Modal.Body>

          <Modal.Footer>
              <Button variant="secondary" onClick={handleSuccessClose}>
                  Close
              </Button>
          </Modal.Footer>
      </Modal>

      <Modal show={showErrModal} onHide={handleErrClose}>
          <Modal.Header closeButton>
              <Modal.Title><VscError size={52} color="red" />Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h3>Please Note the Following Points and try again: </h3>
              <ul>
                {errors.map((val)=>{
                  return(
                  <li>
                      {val}
                  </li>
                  )
                })}
              </ul>
            </div>
          </Modal.Body>

          <Modal.Footer>
              <Button variant="secondary" onClick={handleErrClose}>
                  Close
              </Button>
          </Modal.Footer>
      </Modal>
      <Form onSubmit={handleSubmit}>
        <Form.Label><h1 className="Text-info2">Registration</h1></Form.Label>
        <Form.Group controlId="TeamName" size="lg">
          <Form.Label>Team Name*</Form.Label>
          <Form.Control
            required
            placeholder="Team Name"
            type="text"
            value={fields.TeamName}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="teamLeaderName" size="lg">
          <Form.Label>Team Leader Name*</Form.Label>
          <Form.Control
            required
            placeholder="Team Leader Name"
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
            placeholder="Team Leader College"
            value={fields.teamLeaderCollege}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="teamLeaderEmail" size="lg">
          <Form.Label>Team Leader Email*</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Team Leader Email"
            value={fields.teamLeaderEmail}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="teamLeaderPhNo" size="lg">
          <Form.Label>Team Leader WhatsApp Number*</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Team Leader WhatsApp Number"
            value={fields.teamLeaderPhNo}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant1Name" size="lg">
          <Form.Label>Name of Participant 1</Form.Label>
          <Form.Control
            type="text"
            placeholder="Name of Participant 1"
            value={fields.participant1Name}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant1College" size="lg">
          <Form.Label>College of Participant 1</Form.Label>
          <Form.Control
            type="text"
            placeholder="College of Participant 1"
            value={fields.participant1College}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant1Email" size="lg">
          <Form.Label>Email of Participant 1</Form.Label>
          <Form.Control
            placeholder="Email of Participant 1"
            type="email"
            value={fields.participant1Email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant1PhNo" size="lg">
          <Form.Label>Phone Number of Participant 1</Form.Label>
          <Form.Control
            placeholder="Phone Number of Participant 1"
            type="text"
            value={fields.participant1PhNo}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant2Name" size="lg">
          <Form.Label>Name of Participant 2</Form.Label>
          <Form.Control
            placeholder="Name of Participant 2"
            type="text"
            value={fields.participant2Name}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant2College" size="lg">
          <Form.Label>College of Participant 2</Form.Label>
          <Form.Control
            placeholder="College of Participant 2"
            type="text"
            value={fields.participant2College}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant2Email" size="lg">
          <Form.Label>Email of Participant 2</Form.Label>
          <Form.Control
            placeholder="Email of Participant 2"
            type="email"
            value={fields.participant2Email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="participant2PhNo" size="lg">
          <Form.Label>Phone Number of Participant 2</Form.Label>
          <Form.Control
            placeholder="Phone Number of Participant 2"
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
      {isRegistered ? thankYouPage() :renderForm()}
    </div>
  );
}