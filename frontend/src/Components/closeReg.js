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

export default function CloseReg() {
    useEffect(()=>{
        document.title='Registration Closed'
    },[])
  function regClosePage() {
    return(
      <Container fluid>
      <div className="thankYouPage">
        <h1 className="Text-info"> Registrations have been Closed</h1>
        <br />
        <h5>The event begins on 4th Sept.. So Stay Tuned</h5>
        <h5>For any discrepancies contact: </h5>
        <h5>Aastha: <span className="uuid">+91-9661706009</span></h5>
        <h5>Akshansh: <span className="uuid">+91-7479546187</span></h5>
      </div>
      </Container>
      );
  }
  

  return (
    <div className="Signup">
      {regClosePage()}
    </div>
  );
}
