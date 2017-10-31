import React from 'react';
import { connect } from 'react-redux';
import AudioDrop from '../audioDrop.js';
import Master from './Master.jsx';
import Gain from './Gain';
import { joinChatRoom } from '../webRTC/client.jsx'
import MicMaster from './MicMaster'
import Footer from './Footer'

/* -----------------    COMPONENT     ------------------ */

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = ({
      canJoin: false,
      canPlay: false,
      canPause: false,
      canStop: false,
      canDrop: true,
      showSidebar: false
    })

    this.adjustGainValue = this.adjustGainValue.bind(this)
    this.audioConnect = this.audioConnect.bind(this);
    this.audioDisconnect = this.audioDisconnect.bind(this);

  }

  componentDidMount() {
    if (this.props.canDrop) {
      const thisContext = this;
      const context = this.props.audioCtx.audioContext;
      AudioDrop({
        context: context,
        elements: window.document.body,
        drop: function (buffer, file) {
          var name = file.name.replace(/\.[^/.]+$/, "");
          // console.log(file)
          if (AudioDrop.isValidVariableName(name)) {
            window[name] = buffer;
            thisContext.props.addBuffer(buffer);
            thisContext.props.addName(name)
            console.log('Added the variable "' + name + '"" to the window.');
          } else {
            window[name + '-sample'] = buffer;
            console.log('Added the variable window["' + name + '-sample"] to the window.');
          }
        }
      });
      this.props.setDrop(false)
    }
    joinChatRoom('lobby')

    const {analyser} = this.props.audioCtx.master
    analyser.fftSize = 1024;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    // Get a canvas defined with ID "oscilloscope"
    var canvas = this.refs.visualizer;
    var canvasCtx = canvas.getContext("2d");


    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;


    // analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    var draw = function () {
      var drawVisual = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {
        barHeight = 5 * dataArray[i];

        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        canvasCtx.fillStyle = 'violet'
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    };

    draw();






  }

  adjustGainValue(event, node) {
    node.gain.value = event.target.value
    // this.props.updateFilter(node)
  }

  audioConnect(event) {
    //in case youre already connect.. but like dont press it twice you dumdum fuckina' betch
    if (this.props.audioStreamSource !== null) {
      this.props.audioStreamSource.disconnect();
    }
    event.preventDefault();
    const source = this.props.audioStream && this.props.audioCtx.audioContext.createMediaStreamSource(this.props.audioStream);
    this.props.setStreamSource(source);
    source.connect(this.props.audioCtx.micMaster.micCompressor);
    this.props.setMicConnection(true);
  }

  audioDisconnect(event) {
    event.preventDefault();
    this.props.audioStreamSource.disconnect();
    this.props.setMicConnection(false);
  }


  render() {

    // if (this.props.audioSource !== null) {
    //   this.props.audioSource.onended = (event) => {
    //     this.audioPlay(null, 0, this.props.currentSongIndex + 1)
    //   }
    // }
    return (
      <div>

        {
          this.state.showSidebar ? (
            <section id='sidebar'>
              <div className="w3-sidebar w3-bar-block w3-animate-left" id="mySidebar">Your Current Playlist
            {
                  this.props.audioNames.map((name, ind) => {
                    return (<div key={ind}>{ind + 1}. {name}
                    </div>)
                  })
                }
              </div>
            </section>
          ) : <div></div>
        }


        <section id="carousel">
          <div id="carousel-text">
            <h1>WebDAW: Collaborative Music Making and Audio Hangout</h1>
            <h2>
              <button onClick={(evt) => {
                evt.preventDefault();
                this.setState({
                  showSidebar: true ^ this.state.showSidebar
                })
              }}>Show Playlist</button>
              <button className="blue" onClick={(event) => this.audioConnect(event)}>Connect Microphone</button>
              <button className="blue" onClick={(event) => this.audioDisconnect(event)}>DisConnect Microphone</button>
            </h2>
          </div>
          {/*<img className="carousel-image" src="https://www.googleplaymusicdesktopplayer.com/img/par1.jpg" />*/}
          <canvas className="carousel-image" ref="visualizer" width={1250} height={1250} />
          <img className="carousel-image hidden" src="images/bg/city.jpg" />
          <img className="carousel-image hidden" src="images/bg/underwater.jpg" />
          <img className="carousel-image hidden" src="images/bg/brightsun.jpg" />
        </section>


        <div className="w3-overlay w3-animate-opacity" id="myOverlay"></div>

        <section id="about">
          <h2>About</h2>
          <div >
            <p className="flex">
              WebDAW is fully functioning Digital Audio Workstation, built to make and share in the music making process with your peers
      </p>
            <div id="aboutmockup">
            </div>
          </div>
        </section>

        <section id="mixing-board">
          <Master />
          <MicMaster />
        </section>

        <section id="playbar">
          <Footer />
        </section>
      </div>

    )
  }


}

/* -----------------    CONTAINER     ------------------ */
// import {login, logout, signup } from '../redux/reducers/auth.jsx';

// const mapDispatch = {login, logout, signup }



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


export default connect(mapState, mapDispatch)(Home);
