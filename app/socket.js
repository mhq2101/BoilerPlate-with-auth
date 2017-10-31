/* global socket */
// import io from 'socket.io-client';
// All A-Frame components need access to the socket instance
import io from 'socket.io-client'; 
window.socket = io.connect(window.location.origin);
import { fromJS } from 'immutable';

import { disconnectUser, addPeerConn, removePeerConn, setRemoteAnswer, setIceCandidate } from './webRTC/client';

socket.on('connect', () => {
  console.log('You\'ve made a persistent two-way connection to the server!');
});

// Adds a Peer to our DoM as their own Audio Element

socket.on('addPeer', (config) => {
  addPeerConn(config);
})

// Removes Peer from DoM after they have disconnected or switched room
socket.on('removePeer', removePeerConn);

// Replies to an offer made by a new Peer
socket.on('sessionDescription', setRemoteAnswer);

// Handles setting the ice server for an ice Candidate
socket.on('iceCandidate', setIceCandidate);

// Removes all peer connections and audio Elements from the DoM
socket.on('disconnect', () => disconnectUser)
