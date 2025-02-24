import React, { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Container, TextField, Typography, Button, Box, Stack } from "@mui/material";

const App = () => {

  const socket = useMemo(() =>
    io("http://localhost:3000", {withCredentials: true})
    , []);


  const message = useRef("");
  const room = useRef("");
  const [socketId, setSocketId] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const joinRoomId = useRef("");

  useEffect(() => {
    socket.on("welcome", (s) => {
      setSocketId(socket.id);
      console.log(s);
    });

    socket.on("receive-message", (msg) => {
      console.log(msg);
      setAllMessages((values) => [...values, msg]);
    });


    return () => {
      socket.off("welcome");
      socket.off("receive-message");
    };
  }, [socket]);


  const handleSubmit = (e) => {
    e.preventDefault();
    let msg = message.current.value;
    let roomm = room.current.value;
    socket.emit("message", { msg, roomm });
    message.current.value = "";

  }

  const handleJoin = (e) => {
    e.preventDefault();
    let joinId = joinRoomId.current.value;
    socket.emit("join-room", joinId);
    joinRoomId.current.value = "";
  }

  return <Container maxWidth="sm">
    <Box sx={{ height: "200px" }}></Box>

    <Typography variant='h6' component="div" gutterBottom>
      {socketId}
    </Typography>

    <form onSubmit={handleJoin}>
      <h5>Join Room</h5>
      <TextField id='outlined-basic' label="Join_Room" varient="outlined" inputRef={joinRoomId}></TextField>
      <Button variant="contained" color="primary" type="submit">Join</Button>

    </form>

    <form onSubmit={handleSubmit}>
      <TextField id='outlined-basic' label="Message" varient="outlined" inputRef={message}></TextField>
      <TextField id='outlined-basic' label="Room" varient="outlined" inputRef={room}></TextField>

      <Button variant="contained" color="primary" type="submit">Send</Button>
    </form>


    <Stack>
      {allMessages.map((m, i) => {
        return (<Typography key={i} variant='h6' component="div" gutterBottom>
          {m}
        </Typography>)
      })}
    </Stack>
  </Container>
}

export default App;