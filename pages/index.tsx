import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [socket, setSocket] = useState(null as any);
  const [socketConnected, setSocketConnected] = useState(false);
  const [room, setRoom] = useState('');
  const [url, setUrl] = useState('');

  // useEffect(() => {
  //   const newSocket = io();
  //   setSocket(newSocket);
  // }, []);

  useEffect(() => {
    if (!socket) return;
    if (!room) return;
    
    socket.on('connect', () => {
      setSocketConnected(socket.connected);
    });

    socket.on('disconnect', () => {
      setSocketConnected(() => {console.log(socket.connected); return socket.connected});
    });

    socket.on('disconnected', (status: string) => {
      console.log(status);
    });
  }, [socket]);

  const handleSocketConnection = () => {
    if (socketConnected)
      socket.disconnect();
    else {
      socket.connect();
    }
  }

  const handleRoomConnection = () => {
    if (!socketConnected) {
      const correctedRoomCode = room.split(" ").join("");
      console.log(correctedRoomCode.length >= 6);
      if (correctedRoomCode.length >= 6 && !/[^a-zA-Z]/.test(correctedRoomCode)) {
        // socket.emit('join', room);
        setSocket(io({
          query: {
            roomCode: room
          }
        }));
      } else {
        alert('ayo check yo room code');
      }
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

      <h1>AYO THE PIZZA HERE</h1>

      <input
        type="button"
        style={{ marginTop: 10 }}
        value={socketConnected ? 'Disconnect' : 'Connect'}
        disabled={!socket}
        onClick={handleSocketConnection} />

      <input type="text" onChange={ (e) => setRoom(e.target.value) } />

      <input type="button" value={`join '${room}' room`} onClick={handleRoomConnection} />

      <input type="text" onChange={ (e) => setUrl(e.target.value) } />

      <input type="button" value={`request song`} onClick={handleSongRequest} />
    </div>
  )
}

export default Home;
