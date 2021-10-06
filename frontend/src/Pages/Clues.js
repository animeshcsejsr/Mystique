import React from 'react'
import { useEffect, useState } from 'react';
import { Form,Button,Modal } from 'react-bootstrap';
import {GoVerified} from 'react-icons/go';
import {GiCancel} from 'react-icons/gi';
import db from '../firebase';
import '../styles/clues.css'
import firebase from 'firebase';

const Clues =(props) =>{

    const [questionState, setQuestionState]= useState(0);
    const [teamName, setTeamName] = useState("Name");
    const [question, setQuestion]= useState("");
    const [answers, setAnswers]= useState([]);
    const [nextID, setNextID]= useState(0);
    const [userInput, setUserInput]= useState("");
    const [isLogged, setIsLogged]= useState(false);
    const [uuid, setUuid]= useState(props.uuid)
    const [points, setPoints]= useState(0);
    const [showErrModal, setShowErrModal]= useState(false);
    const [showCorrectModal, setShowCorrectModal]= useState(false);

    useEffect(()=>{
        console.log(props);
        const query = db.collection('people').where("uuid",'==',uuid);
        query.onSnapshot((snapshot)=>{
            snapshot.forEach((doc)=>{
                console.log(doc.data().currentQuestionNumber);
                console.log("next id = "+ doc.data().nextID);
                setTeamName(doc.data().TeamName);
                setPoints(doc.data().points);
                setQuestionState(doc.data().currentQuestionNumber);
            })
        })
    },[])
    useEffect(() =>{
        console.log("Question State = "+ questionState)
        const query= db.collection('questions').where("questionID",'==',questionState)
        query.onSnapshot((snapshot)=>{
            console.log(snapshot.size)
            snapshot.forEach((doc)=>{
                setQuestion(doc.data().body);
                setNextID(doc.data().nextID);
                setAnswers(doc.data().Answers);
            })
        })
    },[questionState])

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    }
    function verifyAns(){
        var temp = userInput;
        temp = temp.toLowerCase();
        temp = temp.replace(/ /g,"");
        console.log(temp);
        return answers.includes(temp)
    }
    function submitAns(e){
        e.preventDefault();
        console.log(answers);
        const date1 = new Date("Jan 1, 2021 11:10:05" );
        const date2= new Date();
        const res=  Math.abs(date1 - date2) / 1000;
        const seconds = res % 60;
        console.log(props)
        if(userInput!=""){
            if(verifyAns()){
                const query= db.collection('people').doc(uuid);
                query.update({
                    currentQuestionNumber: nextID,
                    points: (3.0*nextID)+ ((0.1/((seconds)+100)))
                })
                setShowCorrectModal(true);
            }else{
                setShowErrModal(true);
            }
        }else{
            alert('Answer cannot be null');
        }
        setUserInput("");
    }
    return(
        
        <>
            <Modal show={showCorrectModal} onHide={() => {setShowCorrectModal(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title><GoVerified color="green" size={52} />Answer is Correct </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h1>Congratulations.. Your answer was correct..  </h1>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {setShowCorrectModal(false)}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showErrModal} onHide={() => {setShowErrModal(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title><GiCancel size={52} color="red" />Answer is incorrect </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h1>Incorrect Answer Try Again</h1>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {setShowErrModal(false)}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="box">
                <div className="team-info">
                    <span className="team-name">
                        {teamName}
                    </span>
                </div>
                <div className="clue-no">
                    CLUE - {questionState}
                </div>
                <div class="text-box">
                    <p>
                        {question}
                    </p>
                </div>
                <Form onSubmit={submitAns}>
                    <Form.Group size="lg">
                        <Form.Label><h1>Enter Your Answer </h1></Form.Label>
                        <Form.Control
                            required
                            placeholder="Enter Answer"
                            type="text"
                            value={userInput}
                            onChange={handleUserInput}
                        />
                    </Form.Group>
                    <br />
                    <Button
                    block
                    size="lg"
                    type ="submit"
                    >
                    Submit
                    </Button>
                </Form>
            </div>
        </>
    );
}

export default Clues;