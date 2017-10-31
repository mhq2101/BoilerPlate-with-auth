import store from '../redux/store.jsx';
import { setUserMedia, addPeer, deletePeer, clearPeers } from '../redux/reducers/webrtc-reducer';
import { addUserToChatroom, removeUserFromChatroom, setCurrentChatroom } from '../redux/reducers/chatroom';
import { addRemote } from '../redux/reducers/remoteStreams'
// import io from 'socket.io-client';
// All A-Frame components need access to the socket instance
// window.socket = io.connect(window.location.origin);
/** You should probably use a different stun server doing commercial stuff **/
/** Also see: https://gist.github.com/zziuni/3741933 **/
const ICE_SERVERS = [
  { url: 'stun:stun.l.google.com:19302' },
  {
    url: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
    username: 'webrtc@live.com'
  },
  {
    url: 'turn:192.158.29.39:3478?transport=udp',
    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    username: '28224511:1379330808'
  },
  {
    url: 'turn:192.158.29.39:3478?transport=tcp',
    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    username: '28224511:1379330808'
  }
];

// This will be our socket connection
let signalingSocket = null;
let peerMediaElements = {};  // keep track of our <audio> tags, indexed by peer_id

// Called by an A-Frame Room's componentDidMount hook, the joinChatRoom function asks the user
//   for access to their audio stream (if needed), and then emits the 'joinChatRoom' event which
//   causes the server to:
//   --Join the client to a socket.io room matching the string passed in.
//   --Instructs all clients in the same room to initiate WebRTC peer-to-peer voice connections
// If the user decides not to share their microphone, they are presented with an error
//   informing them that voice is unavailable.

export function joinChatRoom (room, errorback) {
  // Get our microphone from the state
  const localMediaStream = store.getState().audioStream;

  if (!room) {
    console.log('No room was provided');
    return;
  }
  if (signalingSocket === null) {
    signalingSocket = window.socket;
  }
  if (localMediaStream !== null) {  /* ie, if we've already been initialized */
    signalingSocket.emit('joinChatRoom', room, store.getState().auth.name);
    return;
  }
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  console.log('Requesting access to local audio / video inputs');
  navigator.getUserMedia({ 'audio': true, 'video': false },
    // On Success
    function (stream) {
      console.log('Access granted to audio');
      store.dispatch(setUserMedia(stream));
      signalingSocket.emit('joinChatRoom', room, store.getState().auth.name);
    },
    // On Failure... likely because user denied access to a/v
    function () {
      console.log('Access denied for audio/video');
      window.alert('You chose not to provide access to your microphone, so real-time voice chat is unavailable.');
      
      if (errorback) errorback();
    });
}

// Called by a A-Frame Room's componentWillUnmount lifecycle hook, it leaveChatRoom
//   triggers server-side logic to leave the matching socket.io room and tear down
//   existing WebRTC connections.
export function leaveChatRoom () {
  signalingSocket.emit('leaveChatRoom', store.getState().auth.name);
}

// accepts conifg
export function addPeerConn (config) {
  console.log('Signaling server said to add peer:', config);
  const peerId = config.peer_id;
  const peers = store.getState().webrtc.get('peers');
  const peerName = config.peerName;
  console.log(peerName)
  // If for some reason, this client aready is connected to the peer, return
  if (peers.has(peerId)) {
    console.log('Already connected to peer ', peerId);
    return;
  }

  // Create a webRTC peer connection to the ICE servers
  const peerConnection = new webkitRTCPeerConnection(
    { 'iceServers': ICE_SERVERS },
    { 'optional': [{ 'DtlsSrtpKeyAgreement': true }] }
    /* this will no longer be needed by chrome
    * eventually (supposedly), but is necessary
    * for now to get firefox to talk to chrome */
  );

  //Set up ice candidates
  peerConnection.onicecandidate = function (event) {
    if (event.candidate) {
      signalingSocket.emit('relayICECandidate', {
        'peer_id': peerId,
        'ice_candidate': {
          'sdpMLineIndex': event.candidate.sdpMLineIndex,
          'candidate': event.candidate.candidate
        }
      });
    }
  };

  // When we recieve a peer's WebRTC stream, add an audio tag to the DOM with
  //   an ID equal to the peerID, and set it to autoplay.
  peerConnection.onaddstream = function (event) {
    console.log('onAddStream', event);
    
    const remoteAudio = document.createElement('audio');
    const bodyTag = document.getElementsByTagName('body')[0];
    bodyTag.appendChild(remoteAudio);
    remoteAudio.setAttribute('id', peerId);
    remoteAudio.setAttribute('autoplay', 'autoplay');
    peerMediaElements[peerId] = remoteAudio; // array of the all peer WebRTC streams
    remoteAudio.srcObject = event.stream;
    
    // var source = store.getState().audioCtx.audioContext.createMediaStreamSource(event.stream);
    // console.log(source)
    // source.connect(store.getState().audioCtx.audioContext.destination);
    // peerMediaElements[peerId] = source; // array of the all peer WebRTC streams
  };
  /* Add our local stream */
  peerConnection.addStream(store.getState().audioCtx.audioDest.stream);
  /* Only one side of the peer connection should create the
  * offer, the signaling server picks one to be the offerer.
  * The other user will get a 'sessionDescription' event and will
  * create an offer, then send back an answer 'sessionDescription' to us
  */
  if (config.should_create_offer) {
    console.log('Creating RTC offer to ', peerId);
    peerConnection.createOffer(
      function (localDescription) {
        console.log('Local offer description is: ', localDescription);
        peerConnection.setLocalDescription(localDescription,
          function () {
            signalingSocket.emit('relaySessionDescription',
              { 'peer_id': peerId, 'session_description': localDescription });
            console.log('Offer setLocalDescription succeeded');
          },
          function () { window.alert('Offer setLocalDescription failed!'); }
        );
      },
      function (error) {
        console.log('Error sending offer: ', error);
      }
    );
  }
  store.dispatch(addPeer(peerId, peerConnection, peerName, peerMediaElements[peerId]));
}

export function removePeerConn (config) {
  const peerName = config.peerName
  console.log('Signaling server said to remove peer:', config);
  const peerId = config.peer_id;
  if (peerId in peerMediaElements) {
    peerMediaElements[peerId].remove();
  }
  const peers = store.getState().webrtc.get('peers');
  if (peers.has(peerId)) {
    peers.get(peerId).close();
  }
  store.dispatch(deletePeer(peerId, peerName));
  delete peerMediaElements[config.peerId];
}

export function setRemoteAnswer (config) {
  console.log('Remote description received: ', config);
  const peerId = config.peer_id;
  const peer = store.getState().webrtc.getIn(['peers', peerId]);
  const remoteDescription = config.session_description;
  console.log(config.session_description);
  const desc = new RTCSessionDescription(remoteDescription);
  const stuff = peer.setRemoteDescription(desc,
    function () {
      console.log('setRemoteDescription succeeded');
      if (remoteDescription.type === 'offer') {
        console.log('Creating answer');
        peer.createAnswer(
          function (localDescription) {
            console.log('Answer description is: ', localDescription);
            peer.setLocalDescription(localDescription,
              function () {
                signalingSocket.emit('relaySessionDescription',
                  { 'peer_id': peerId, 'session_description': localDescription });
                console.log('Answer setLocalDescription succeeded');
              },
              function () { window.alert('Answer setLocalDescription failed!'); }
            );
          },
          function (error) {
            console.log('Error creating answer: ', error);
            console.log(peer);
          }
        );
      }
    },
    function (error) {
      console.log('setRemoteDescription error: ', error);
    }
  );
  console.log('Description Object: ', desc);
}

export function setIceCandidate (config) {
  const peer = store.getState().webrtc.getIn(['peers', config.peer_id]);
  const iceCandidate = config.ice_candidate;
  peer.addIceCandidate(new RTCIceCandidate(iceCandidate));
}

export function disconnectUser () {
  for (const peerId in peerMediaElements) {
    peerMediaElements[peerId].remove();
  }
  const peers = store.getState().webrtc.get('peers');
  peers.valueSeq.forEach(peerConn => {
    peerConn.close();
  });
  store.dispatch(clearPeers());
  peerMediaElements = {};
}

export function peerElements() {
  return peerMediaElements;
}