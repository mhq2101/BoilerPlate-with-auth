import { combineReducers } from 'redux';
import auth from './auth.jsx'
import audioStream from './audioStream';
import audioContext from './audioContext';
import audioBuffers from './audioBuffers';
import audioNames from './audioNames';
import audioSource from './audioSource';
import currentSongIndex from './currentSongIndex';
import startTime from './startTime';
import timeStarted from './timeStarted';
import audioStreamSource from './audioStreamSource';
import micConnected from './micConnected';
import musicPlaying from './musicPlaying';
import canDrop from './canDrop';
import filter from './filter';
import remoteStreams from './remoteStreams';
import webrtc from './webrtc-reducer';


const rootReducer = combineReducers({
  auth,
  audioStream,
  audioCtx: audioContext,
  audioBuffers,
  audioNames,
  audioSource,
  currentSongIndex,
  audioStreamSource,
  startTime,
  timeStarted,
	micConnected,
	musicPlaying,
  canDrop,
  filter,
  remoteStreams,
  webrtc
});


export default rootReducer;
