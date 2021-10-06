import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Card,Typography } from "@material-ui/core";

const Details =(props) =>{

    const [showModal,setShowModal]= useState(false);
    const handleClose =() => setShowModal(false);

    return(
        <>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h3>uuid : <span className="uuid">{props.props.uuid}</span></h3>
                        <h3>Team Name : {props.props.TeamName}</h3>
                        <h3>Points: {props.props.points} </h3>
                        <h3>Team Leader Name : {props.props.teamLeaderName} </h3>
                        <h3>Team Leader Email : {props.props.teamLeaderEmail}</h3>
                        <h3>Team Leader PhoneNumber : {props.props.teamLeaderPhNo} </h3>
                        <h3>Team Leader College : {props.props.teamLeaderCollege}</h3>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <div onClick={setShowModal(true)}>
                <h1> hello world</h1>
                <Typography>
                    Team Name : {props.props.TeamName}
                </Typography>
                <Typography>
                    Points : {props.points}
                </Typography>
                <Typography>
                    uuid :  {props.uud}
                </Typography>
            </div>
        </>
    );
}

export default Details;