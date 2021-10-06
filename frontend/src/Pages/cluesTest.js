import React from 'react'
import { useEffect, useState } from 'react';
import { Form,Button,Modal, Container } from 'react-bootstrap';
import {GoVerified} from 'react-icons/go';
import {GiCancel} from 'react-icons/gi';
import db from '../firebase';
import '../styles/cluesTest.css';

const CluesTest = (props) =>{

    const [questionState, setQuestionState]= useState(1);
    const [teamName, setTeamName] = useState("Name");
    const [img, setImg]= useState("");
    const [doc, setDoc]= useState("");
    const [audio, setAudio]= useState("");
    const [isImg, setIsImg]= useState(false);
    const [isDoc, setIsDoc]= useState(false);
    const [isAudio, setIsAudio]= useState(false);
    const [showSubmit, setShowSubmit]= useState(false);
    const [answers, setAnswers]= useState([]);
    const [nextID, setNextID]= useState(0);
    const [userInput, setUserInput]= useState("");
    const [uuid, setUuid]= useState("par-Q6126256b1");
    const [points, setPoints]= useState(0);
    const [confession, setConfession]= useState("");
    const [showErrModal, setShowErrModal]= useState(false);
    const [showCorrectModal, setShowCorrectModal]= useState(false);
    const [showConfessionModal, setShowConfessionModal]= useState(false);

    useEffect(()=>{
        console.log(props);
        const query = db.collection('people').where("uuid",'==',uuid);
        query.onSnapshot((snapshot)=>{
            snapshot.forEach((doc)=>{
                setTeamName(doc.data().TeamName);
                setPoints(doc.data().points);
                setQuestionState(doc.data().currentQuestionNumber);
            })
        })
    },[])

    useEffect(() =>{
        console.log("Question State = "+ questionState)
        const query= db.collection('questionsNew').where("questionId",'==',questionState)
        query.onSnapshot((snapshot)=>{
            console.log(snapshot.size)
            snapshot.forEach((doc)=>{
                setIsImg(doc.data().isImg);
                setIsDoc(doc.data().isDoc);
                setIsAudio(doc.data().isAudio);
                setShowSubmit(doc.data().showSubmit);
                setImg(doc.data().img);
                setDoc(doc.data().doc);
                setConfession(doc.data().confession);
                setAudio(doc.data().audio);
                setNextID(doc.data().nextId);
                setAnswers(doc.data().answers);
            })
            setShowConfessionModal(true);
        })
    },[questionState])

    const handleUserInput =(e) =>{
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
                console.log("nextID= "+ nextID);
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
            <Modal show={showConfessionModal} onHide={() => {setShowConfessionModal(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title><h1>Confession </h1></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h1>Confession : </h1>
                    <p>{confession} </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {setShowConfessionModal(false)}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
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
            <div className="root">
                <div className="container">
                    <div className="topRow">
                        <h1 className="team_name">Team -{teamName}</h1>
                        <Button
                        className="confessionButton"
                        variant="warning"
                        onClick={() => setShowConfessionModal(true)}
                        >Confession</Button>
                    </div>
                    <br />

                    {isImg ?<img src={img} className="imgStyle"/> :<> </>}
                    {isDoc ?<embed src={doc} type="application/pdf" className="imgStyle"></embed> :<> </>}
                    {isAudio ?<audio controls ><source src={audio} /></audio> :<> </>}

                    <Form onSubmit={submitAns}>
                        <Form.Group size="lg">
                            <Form.Label><h1 className="writeAns">Enter Your Answer :</h1></Form.Label>
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
                        variant="success"
                        size="lg"
                        type ="submit"
                        >
                        Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default CluesTest;