import type { NextPage } from 'next';
import Head from 'next/head';
//import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from '../styles/Home.module.css';
import { HomeIcon, PersonIcon, PlusCircleIcon, PlusIcon, SearchIcon, SignInIcon } from '@primer/octicons-react';
import NavbarButton from '../components/NavbarButton';
import ChatMessage from '../components/ChatMessage';
import { SocketContext } from '../context/SocketContext';

const Home: NextPage = () => {
  const socket = useContext(SocketContext);
  //const [socket, setSocket] = useState(null as any);
  const [socketConnected, setSocketConnected] = useState(false);
  const [room, setRoom] = useState('');
  const [url, setUrl] = useState('');
  const [roomPassword, setRoomPassword] = useState('');

  useEffect(() => {
    if (!socket) return console.log('BRUHHH');
    console.log('debug!!')

    setSocketConnected(socket.connected);
    
    socket.on('connect', () => {
      setSocketConnected(socket.connected);
      console.log('ayo the fuck goin on')
    });

    socket.on('disconnect', () => {
      setSocketConnected(() => {console.log(socket.connected); return socket.connected});
    });

    socket.on('disconnected', (status: string) => {
      console.log(status);
    });
  }, []);

  const handleSocketConnection = () => {
    if (socketConnected)
      socket.disconnect();
    else {
      socket.connect();
    }
  }

  const handleRoomConnection = () => {
    const correctedRoomCode = room.split(" ").join("");
    console.log(correctedRoomCode.length >= 5);
    if (correctedRoomCode.length >= 5 && !/[^a-zA-Z]/.test(correctedRoomCode)) {
      socket.emit('join', {room: correctedRoomCode, password: roomPassword});
    } else {
      alert('ayo check yo room code');
    }
  }

  const handleSongRequest = () => {
    if (socketConnected) {
      socket.emit('request-song', url);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Main - sockets tests</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.sidebar}>
        <button className={styles.sidebarButtonTop}>
          <HomeIcon />
        </button>

        <div className={styles.buttonsHandler}>
          <NavbarButton buttonName={"Add Music"}>
            <PlusIcon />
          </NavbarButton>
          <NavbarButton buttonName={"Search Rooms"}>
            <SearchIcon />
          </NavbarButton>
          <NavbarButton buttonName={"Enter room code"}>
            <SignInIcon />
          </NavbarButton>
          <NavbarButton buttonName={"Create new room"}>
            <PlusCircleIcon />
          </NavbarButton>
        </div>

        <button className={styles.sidebarButtonBottom}>
          <PersonIcon />
        </button>
      </div>

      <div className={styles.main}>
        hi
      </div>

      <div className={styles.chatRoom}>
        <div className={styles.MessagesHandler}>
          <ChatMessage user={"User1"}>
            Hello World!
          </ChatMessage>
        </div>
        <div className={styles.chatMessengerHandler}>
          <textarea rows={3} name="" id="" />
          <button>Send</button>
        </div>
      </div>

      <div className='socketIODebugMenu'>
        <input
          type="button"
          style={{ marginTop: 10 }}
          value={socketConnected ? 'Disconnect' : 'Connect'}
          disabled={!socket}
          onClick={handleSocketConnection} />

        room code: <input type="text" onChange={ (e) => setRoom(e.target.value) } />
        password: <input type="text" onChange={ (e) => setRoomPassword(e.target.value) } />

        <input type="button" value={`join '${room}' room`} onClick={handleRoomConnection} />

        <input type="text" onChange={ (e) => setUrl(e.target.value) } />

        <input type="button" value={`request song`} onClick={handleSongRequest} />
      </div>
    </div>
  )
}

export default Home;
