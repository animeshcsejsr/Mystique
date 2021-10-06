import React, { useEffect, useState } from 'react'
import db from '../firebase';
import {Typography} from '@material-ui/core'
import { Button,Container,Form } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { GiCancel } from 'react-icons/gi';
import Clues from './Clues';
import '../styles/login.css';

const LoginPage = () =>{
    const axios= require('axios')
    const [uuid, setUuid]= useState("");
    const [captcha, setCaptcha]= useState("");
    const [refresh, setRefresh]= useState(false);
    const [inputCaptcha, setInputCaptcha]= useState("");
    const [userLoggedIn, setUserLoggedIn]= useState(false);
    const [errModal, setErrModal]= useState(false);
    const handleCloseModal= () => setErrModal(false);

    useEffect(()=>{
        const alphaNums= ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let emptyArr=[]
        for (let i = 1; i <= 7; i++) {
            emptyArr.push(alphaNums[Math.floor(Math.random() * alphaNums.length)]);
        }
        var cap= emptyArr.join('');
        setCaptcha(cap);
    },[refresh])

    function validateCaptcha(){
        return captcha== inputCaptcha;
    }
    const handleSubmit = (event) =>{
        event.preventDefault();

        if(validateCaptcha()){
            axios.get('http://localhost:8000/',{
                params:{
                    uuid:uuid
                }
            }).then((res)=>{
                const response = res.data;
                console.log(response);
                console.log(uuid);
                setUserLoggedIn(response);
                // set modal based on response
                setErrModal(!response);
            })
        }else{
            window.alert('invalid captcha');
            handleRefresh();
        }
    }
    const handleRefresh = () =>{
        setRefresh(!refresh);
        setInputCaptcha("");
        setUuid("");
    }
    return(
        
        userLoggedIn ? <Clues uuid={uuid} /> : 
        <>
            <Modal show={errModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title><GiCancel size={52} color="red" />Error Occured </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h1>Check the Following Points and Try Again</h1>
                    <ol>
                        <li>Capthcha entered is correct</li>
                        <li>Make sure you are entering the correct uuid assigned to you</li>
                    </ol>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container>
            <body className="body1">
            <div>
                <div className="opacity">
                    <Form onSubmit={handleSubmit}>
                        <Form.Label>   
                            <h1 className="Text-info">Login</h1> 
                        </Form.Label> 
                        <Form.Group controlId="uuid" size="lg"> 
                            <Form.Control
                                required
                                placeholder="uuid"
                                type="text"
                                value={uuid}
                                onChange={(e)=> setUuid(e.target.value)}
                            />
                        </Form.Group>  
                        <br/>
                        <div className="center">
                            <div id="captchaBackground">
                                <h4 className="captcha">{captcha}</h4>
                                <Form.Group controlId="inputCaptcha" size="lg">
                                <Form.Control 
                                required
                                placeholder="Captcha" 
                                type="text" 
                                value={inputCaptcha} 
                                onChange={(e)=>setInputCaptcha(e.target.value)}
                                />
                                </Form.Group>
                                <div id="buttons">
                                    <Button
                                    className="buttStyle"
                                    size="md" 
                                    type="submit" 
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        className="buttStyle"
                                        size="md"
                                        onClick={handleRefresh}
                                    >
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
                </div>
            </body>
        </Container>
        </>
    );
}

export default LoginPage;