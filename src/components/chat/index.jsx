import React, {useState} from 'react';
import 'firebase/database'
import {chatRef} from '../../store';



function Chat() {
  const [message, setMessage] = useState("");
  const addToDo = async (newToDo) => {
    chatRef.push().set(newToDo);
  };
  
  const inputChange = e => {
    setMessage(e.target.value);
  };
  
  const formSubmit = () => {
    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    addToDo({
      message: message,
      timestamp: datetime,
      uid:"luke",
      username:"luke"
    });
    setMessage("");
  };

  return (
       <div>
        <form> 
          <input type="text" onChange={e => inputChange(e)} onSubmit={formSubmit}/>
          <input type="submit" value="submit" onClick={formSubmit}/>
        </form>
       </div>
  );
}

export default Chat;