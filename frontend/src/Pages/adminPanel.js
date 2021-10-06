import { React,useState, useEffect } from "react";
import  Appbar  from "@material-ui/core/AppBar";
import { Typography } from "@material-ui/core";
import '../styles/adminPanel.css';
import {BiRefresh} from 'react-icons/bi';
import {FiClipboard} from 'react-icons/fi';
import { Button,Card,Modal } from "react-bootstrap";
import ShortUniqueId from 'short-unique-id';
import db from "../firebase";
import copy from 'copy-to-clipboard';
import { json2csv } from 'json-2-csv';
import Details from "../Components/Details";

const AdminPanel = () =>{
    const[participants, setParticipants]= useState([]);
    const[refresh,setRefresh]= useState(false);

    useEffect(() => {
        const query = db.collection('people').orderBy("points","desc");
        query.onSnapshot((snapshot) =>{
            setParticipants(snapshot.docs.map((doc)=>({
                id:doc.id,
                data:doc.data()
            })))
        })
    },[refresh])
    
    const downloadDet = () =>{
        const fs= require('fs');
        let converter= require('json-2-csv');
        let temp = participants;
        converter.json2csvAsync(temp,(err,val)=>{
            if(err)
                console.log(err);
        }).then((res,err)=>{
            copy(res);
            alert('copied to your clipboard');
        })
    }
    
    const refreshVals = () => {
        console.log(participants)
        setRefresh(!refresh);
    }
    const genId= () =>{
        const uid= new ShortUniqueId();
        var str = "par-"+String(uid.stamp(10));
        return str
    }
    return(
        <div className="container">
            {/*
            <Appbar className="heading">
                <div>
                    <Typography variant="h4" >
                        Leader-Board
                    </Typography>
                    <Button
                        onClick={refreshVals}
                    >
                        <BiRefresh size={52} />
                    </Button>
                    <Button
                        onClick= {downloadDet}
                    >
                        <BsDownload size={52} />
                    </Button>
                </div>
            </Appbar>
            */}
            <div >
                <h1> Leader Board</h1>
                <Button
                        onClick={refreshVals}
                >
                        <BiRefresh size={28} />
                </Button>
                <Button
                        onClick= {downloadDet}
                >
                    <FiClipboard size={28} />
                </Button>
                
                {
                    participants.map((val)=>{
                        return(
                            <>
                                <div>
                                    <Card className="card_style">
                                        <div className="card_style2">
                                        <Typography>
                                            Team Name : {val.data.TeamName}
                                        </Typography>
                                        <Typography>
                                            uuid :  {val.data.uuid}
                                        </Typography>
                                        <Typography>
                                            Points : {val.data.points}
                                        </Typography>
                                        <Typography>
                                            College :  {val.data.teamLeaderCollege}
                                        </Typography>
                                        <Typography>
                                            Phone Number :  {val.data.teamLeaderPhNo}
                                        </Typography>
                                        </div>
                                    </Card>
                                </div>
                            </>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default AdminPanel;