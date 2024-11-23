import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import "./App.css"
import { useEffect, useState } from 'react';
import Data from './data';
function App() {
  const [savedchats,setsavedchats] = useState(localStorage.getItem("storedchats")? JSON.parse(localStorage.getItem("storedchats")) : [])
  const [listofmessages,setlistofmessages] = useState([]);
  const [inputmsg,setinputmsg] = useState("");
  const [islikebuttonclicked,setislikebuttonclicked] = useState(false);
  const [isdislikebuttonclicked,setisdislikebuttonclicked] = useState(false);
  const [feedback,setfeedback] = useState("");
  const [showpreviouschats,setshowpreviouschats] = useState(false);
  const [isnavigatebuttonclicked,setisnavigatebuttonclicked] = useState(false);


  const handlenavigate = () => {
    setisnavigatebuttonclicked(!isnavigatebuttonclicked);
  }
  const handlepreviouschats = () => {
    setshowpreviouschats(true);
  }
  const handlenewchat = () => {
    setlistofmessages([]);
    setshowpreviouschats(false);
  }

  const handlesavebutton = () => {
    setsavedchats([...savedchats,listofmessages]);
  }
  const handlefeedback = (event) => {
    setfeedback(event.target.value);
  }

  const handlesubmitfeedback = (msg) => {
    setlistofmessages(listofmessages.map((LMSG) => {
      if(LMSG.input === "AI" && LMSG.message === msg)
      {
        LMSG.feedback = feedback;
      }
      return LMSG;
    }))
    setfeedback("");
    setisdislikebuttonclicked(false);
  }
  const handleratingchange = (event,msg) => {
    setlistofmessages(listofmessages.map((LMSG) => {
      if(LMSG.input === "AI" && LMSG.message === msg)
      {
        LMSG.rating = event.target.value;
      }
      return LMSG;
    }))
    setislikebuttonclicked(false);
  }

  const handlelikebutton = () => {
    setislikebuttonclicked(true);
  }

  const handledislikebutton = () => {
    setisdislikebuttonclicked(true);
  }

  const handleinputchange = (event) => {
    setinputmsg(event.target.value);
  }

  const getmsgfromdata = () => {
    let ret = "";
    for(let i=0;i<Data.length;i++)
    {
      if(Data[i].question === inputmsg)
      {
        ret = Data[i].response;
        break;
      }
    }
    if(ret==="")
    {
      ret = "As an AI model,I dont have access to these details,Therefore how can i assist u Further?"
    }
    return ret;
  }

  const handleaskbutton = () => {
    let outputmsg = getmsgfromdata();
    setlistofmessages([...listofmessages,{
      input : "Me",
      message : inputmsg,
    },
    {
      input : "AI",
      message : outputmsg,
      feedback : "",
      rating : 0
    }
  ])
    setinputmsg("");
  }
  const handlepredefinedmsgonlick = (msg) => {
    let outputmsg = "As an AI model,I dont have access to these details,Therefore how can i assist u Further?";
    setlistofmessages([...listofmessages,{
      input : "Me",
      message : msg
    },{
      input : "AI",
      message : outputmsg,
      feedback : "",
      rating : 0
    }]);
  }

  useEffect(()=>{
    localStorage.setItem("storedchats",JSON.stringify(savedchats));
  },[savedchats]);

  return (
    <div className="App">
      <div className='mobilenavigator'>
        <button onClick={handlenavigate} className='navigatebutton'>Navigate</button>
        {
          isnavigatebuttonclicked && (
            <div>
              <button onClick={handlenewchat}>New chat</button>
              <button onClick={handlepreviouschats}>previous chats</button>
            </div>
          )
        }
      </div>
      <div className='sidepanel'>
          <Button variant="contained" sx={{ backgroundColor: '#D7CF4' }} className='newchatbutton' onClick={handlenewchat}>
              New Chat
          </Button>
          <Button variant="contained" sx={{ backgroundColor: '#D7CF4' }} className='pastchatbutton' onClick={handlepreviouschats}>
              Past COnversations
          </Button>
      </div>
      {
        showpreviouschats===false && <div className={listofmessages.length===0 ? "chatdiv" : "chatdiv2"} >
        <div className='titlediv'>
            <Typography variant="h2" sx={{ color: '#D7CF4' }} >
              Bot AI
            </Typography>
       
        </div>
        {
          listofmessages.length===0 && <div className='predefined_messages_grid'>
          <div className='predefinedmessage'>
              <Button onClick={() => handlepredefinedmsgonlick("Hi,What is the weather?")}>
                <Typography variant="h4">
                  Hi,What is the weather?
                </Typography>
                <Typography variant="body1">Get Immediate AI generated response!!</Typography>
              </Button>
          </div>
          <div className='predefinedmessage'>
              <Button onClick={() => handlepredefinedmsgonlick("Hi,What is my location?")}>
                <Typography variant="h4">
                  Hi,What is my location?
                </Typography>
                <Typography variant="body1">Get Immediate AI generated response!!</Typography>
              </Button>
          </div>
          <div className='predefinedmessage'>
              <Button onClick={() => handlepredefinedmsgonlick("Hi,What is the temperature?")}>
                  <Typography variant="h4">
                    Hi,What is the temperature?
                  </Typography>
                  <Typography variant="body1">Get Immediate AI generated response!!</Typography>
              </Button>
          </div>
          <div className='predefinedmessage'>
              <Button onClick={() => handlepredefinedmsgonlick("Hi,How are you?")}>
                <Typography variant="h4">
                  Hi,How are you?
                </Typography>
                <Typography variant="body1">Get Immediate AI generated response!!</Typography>
              </Button>
          </div>
        </div>
        }
        <div>
        {
          listofmessages.length !== 0 && (
            listofmessages.map((lmsg) => (
              <div key={lmsg.input + lmsg.message} className={lmsg.input === "Me" ? "mymessage" : "aimessage"}>
                {lmsg.input}: {lmsg.message}
                {
                  (lmsg.input==="AI" && lmsg.rating!==0) && <p>Rating : {lmsg.rating}</p>
                }
                {
                  (lmsg.input==="AI" && lmsg.feedback!=="") && <p>Feedback : {lmsg.feedback}</p>
                }
                {
                  lmsg.input==="AI" && (
                    <div className='Rating_Feedback'>
                      <Button onClick={handlelikebutton}>Like</Button>
                      {
                        islikebuttonclicked && (
                          <div>
                            <p>Provide Rating:</p>
                            <select onChange={(event) => handleratingchange(event,lmsg.message)}>
                              <option value={0}>0</option>
                              <option value={5}>5</option>
                              <option value={4}>4</option>
                              <option value={3}>3</option>
                              <option value={2}>2</option>
                              <option value={1}>1</option>
                            </select>
                          </div>
                        )
                      }
                      <Button onClick={handledislikebutton}>Dislike</Button>
                      {
                        isdislikebuttonclicked && (
                          <div>
                            <p>Provide Feedback</p>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                onChange={handlefeedback}
                                value = {feedback}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white',
                                    borderColor: 'black',
                                    borderWidth: '2px',
                                  },
                                }}
                                className='inputquestion'
                              />
                              <Button onClick={() => handlesubmitfeedback(lmsg.message)}>Submit feedback</Button>
                          </div>
                        )
                      }
                    </div>
                  )
                }
              </div>
            ))
          )
        }
        </div>
        <div className='chatpanel'>
            <TextField
                id="outlined-basic"
                variant="outlined"
                onChange={handleinputchange}
                value = {inputmsg}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderColor: 'black',
                    borderWidth: '2px',
                  },
                }}
                className='inputquestion'
              />
              <Button variant="contained" sx={{ backgroundColor: '#D7CF4' }} className='askbutton' onClick={handleaskbutton}>
                  Ask
              </Button>
              <Button variant="contained" sx={{ backgroundColor: '#D7CF4' }} className='savebutton'onClick={handlesavebutton}>
                  Save
              </Button>
        </div>
       </div>
      }
      {
        showpreviouschats===true && <div className='chatdiv3'>

          <h2>Previous Chats</h2>
          {
            savedchats.length>0 && savedchats.map((chat) => {
              let str = "";
              //console.log(chat);
              //console.log(chat.length);
              for(let i=0;i<chat.length;i++)
              {
                 //console.log(chat[i].message);
                 str += chat[i].input;
                 str += ":"
                 str += chat[i].message;
                 str+='\n';
                 if(chat[i].input==="AI" && chat[i].rating!==0)
                 {
                  str += "Rating :";
                  str += chat[i].rating;
                 }
                 str+='\n';
                 if(chat[i].input==="AI" && chat[i].feedback!=="")
                  {
                    str += "Feedback :";
                    str += chat[i].feedback;
                  }
                  str += '\n';
              }
              const lines = str.split('\n');
              return <div key={str} className='chats'>
                {
                  lines.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))
                }
              </div>
            })
          }
          </div>
      }
    </div>
  );
}

export default App;
