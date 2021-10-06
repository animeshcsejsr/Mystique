/*
export default class Participant{
    Participant(name, email, college, PhNo)
    {
        this.name= name;
        this.email= email;
        this.college= college;
        this.PhNo= PhNo;
    }
}
*/
import { useState } from "react";

const Participant =(props) =>{
    const [name, setName]= useState("");
    const [email, setEmail]= useState("");
    const [college, setCollege]= useState("");
    const [PhNo, setPhNo]= useState("");
    
}