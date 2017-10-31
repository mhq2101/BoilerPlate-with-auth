import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import Sidebar from '../Sidebar'
import EqualizerBand from './EqualizerBand';
import Compressor from './Compressor';
import Gain from './Gain';


/* -----------------    COMPONENT     ------------------ */

class Footer extends Component {
  constructor(props) {
    super(props)

    this.state = ({
      canJoin: false,
      canPlay: false,
      canPause: false,
      canStop: false,
      canDrop: true
    })

    this.audioPlay = this.audioPlay.bind(this);
    this.audioPause = this.audioPause.bind(this);
    this.audioStop = this.audioStop.bind(this);
    this.adjustGainValue = this.adjustGainValue.bind(this)
   
  }

  adjustGainValue(event, node) {
    node.gain.value = event.target.value
    // this.props.updateFilter(node)
  }
  audioPlay(event, start, current) {

    if (this.props.audioSource !== null) {
      this.props.audioSource.disconnect();
    }
    if (current < 0) {
      current = 0;
      this.props.setCurrent(0);

    } else if (current > this.props.audioBuffers.length - 1) {
      current = 0;
      this.props.setCurrent(0);

    } else {
      this.props.setCurrent(current);
    }


    // start the source playing
    var source = this.props.audioCtx.audioContext.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    source.buffer = this.props.audioBuffers[current];
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(this.props.audioCtx.master.compressor);
    source.connect(this.props.audioCtx.audioDest)
    if (event !== null) {
      event.preventDefault();
    }

    this.props.setSource(source);
    this.props.setTime(this.props.audioCtx.audioContext.currentTime);
    //put this on redux

    this.setState({
      canPlay: false, //ehh...
      canPause: true,
      canStop: true
    });
    if (start === null) {
      source.start(0, this.props.startTime);
    }
    else {
      this.props.setStart(0);
      source.start(0, start);
    }
    this.props.setMusicPlaying(true);
  }
  audioPause(event) {
    event.preventDefault();
    this.props.setStart(this.props.audioCtx.audioContext.currentTime - this.props.timeStarted + this.props.startTime)
    // move to redux
    this.setState({
      canPause: false,
      canPlay: true,
      canStop: true
    });
    this.props.audioSource.disconnect();
    this.props.setMusicPlaying(false);
  }
  audioStop(event) {
    event.preventDefault();
    this.props.setStart(0);
    this.props.setTime(0);
    this.setState({
      canPlay: true,
      canPause: false
    });
    this.props.audioSource.disconnect();
    this.props.setMusicPlaying(false);
  }

  render() {

    if (this.props.audioSource !== null) {
      this.props.audioSource.onended = (event) => {
        this.audioPlay(null, 0, this.props.currentSongIndex + 1)
      }
    }
    
    return (
      <footer className="footer">
            <div className="hide-on-small-only">
              <button className="footer-item"
                onClick={(event) => this.audioPlay(event, 0, this.props.currentSongIndex - 1, 'prev')}
              >Previous</button>
              <button className="footer-item"
                onClick={(event) => this.audioPlay(event, null, this.props.currentSongIndex)}
              >Play</button>
              <button className="footer-item"
                onClick={(event) => this.audioPause(event)}
                disabled={!this.state.canPause}>Pause</button>
              <button className="footer-item"
                onClick={(event) => this.audioStop(event)}
                disabled={!this.state.canStop}>Stop</button>
              <button className="footer-item"
                onClick={(event) => this.audioPlay(event, 0, this.props.currentSongIndex + 1, 'next')}
              >Next</button>
            </div>
            <Gain adjustGainValue={this.adjustGainValue} filterNode={this.props.audioCtx.master.gain} />
          </footer>
    )
  }

}

/* -----------------    CONTAINER     ------------------ */

import { setSource } from '../redux/reducers/audioSource.jsx';
import { setStreamSource } from '../redux/reducers/audioStreamSource.jsx';
import { addBuffer } from '../redux/reducers/audioBuffers.jsx';
import { addName } from '../redux/reducers/audioNames.jsx';
import { setCurrent } from '../redux/reducers/currentSongIndex.jsx';
import { setTime } from '../redux/reducers/timeStarted.jsx';
import { setStart } from '../redux/reducers/startTime.jsx';
import { setMicConnection } from '../redux/reducers/micConnected.jsx';
import { setMusicPlaying } from '../redux/reducers/musicPlaying.jsx';
import { setDrop } from '../redux/reducers/canDrop.jsx';

const mapState = ({ auth, audioStream, audioBuffers, audioNames, audioSource, currentSongIndex, audioCtx, webrtc, timeStarted, startTime, audioStreamSource, canDrop }) => ({
  auth,
  audioStream,
  audioBuffers,
  audioNames,
  audioSource,
  currentSongIndex,
  audioCtx,
  webrtc,
  timeStarted,
  startTime,
  audioStreamSource,
  canDrop
});



const mapDispatch = { setSource, addBuffer, addName, setCurrent, setTime, setStart, setStreamSource, setMicConnection, setMusicPlaying, setDrop };


export default connect(mapState, mapDispatch)(Footer);
