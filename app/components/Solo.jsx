import React from 'react';
import { connect } from 'react-redux';
import AudioDrop from '../audioDrop.js';
import Master from './Master.jsx';
import Gain from './Gain';
import { joinChatRoom } from '../webRTC/client.jsx'
import MicMaster from './MicMaster'
import Footer from './Footer'
import webAudioBuilder from 'waveform-data/webaudio'
import FilterList from './FilterList'

/* -----------------    COMPONENT     ------------------ */

class Solo extends React.Component {

  constructor(props) {
    super(props);

    this.state = ({
      canJoin: false,
      canPlay: false,
      canPause: false,
      canStop: false,
      canDrop: true,
      addWave: false,
      showSidebar: false,
      selected: null,
      tracks: [],
      currentChunks: [],
      recorder: '',
      newRecorder: true

    })

    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.adjustGainValue = this.adjustGainValue.bind(this)
    this.audioConnect = this.audioConnect.bind(this);
    this.audioDisconnect = this.audioDisconnect.bind(this);
    this.addWaveform = this.addWaveform.bind(this)
    this.addFilter = this.addFilter.bind(this)
    this.removeFilter = this.removeFilter.bind(this)

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
          if (AudioDrop.isValidVariableName(name)) {
            var track = context.createBufferSource();
            track.buffer = buffer;
            thisContext.setState({
              tracks: thisContext.state.tracks.concat([{
                name,
                track,
                buffer,
                filters: []
              }])
            })
            thisContext.setState({
              addWave: true
            })
            window[name] = buffer;
            console.log('Added the variable "' + name + '"" to the window.');
          } else {
            window[name + '-sample'] = buffer;
            console.log('Added the variable window["' + name + '-sample"] to the window.');
          }
        }
      });
      this.props.setDrop(false)
    }

    const { analyser } = this.props.audioCtx.master
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

  componentDidUpdate() {
    console.log(this.state.currentChunks)
    if (this.state.addWave) {
      this.addWaveform(this.state.tracks[this.state.tracks.length - 1].buffer, this.state.tracks.length - 1)
    }
    if (this.props.audioStream && this.state.newRecorder) {
      var recorder = new MediaRecorder(this.props.audioStream);
      recorder.ondataavailable = (e) => {

        this.setState({
          currentChunks: this.state.currentChunks.concat([e.data])
        })
      }
      recorder.onstop = (e) => {
        console.log("data available after MediaRecorder.stop() called.");
        console.log('dataAvailable', this.state.currentChunks)
        var blob = new Blob(this.state.currentChunks, { 'type': 'audio/ogg; codecs=opus' });
        console.log(blob)
        let fileReader = new FileReader();
        let arrayBuffer;

        fileReader.onloadend = () => {
          arrayBuffer = fileReader.result;

          this.props.audioCtx.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            var source = this.props.audioCtx.audioContext.createBufferSource();
            source.buffer = buffer
            console.log(source)
            this.setState({
              tracks: this.state.tracks.concat([{
                name: 'newRecordingDoe',
                track: source,
                buffer,
                filters: []
              }]),
              addWave: true
            })
          }, function (e) {
            console.error('There was an error decoding ' + file.name);
          });
        }

        fileReader.readAsArrayBuffer(blob);
        this.setState({
          currentChunks: []
        })
      }
      this.setState({
        recorder: recorder,
        newRecorder: false
      })


    }
  }

  startRecording() {
    this.playAll();
    this.state.recorder.start();
    console.log(this.state.recorder.state);
    console.log("recorder started");

  }

  stopRecording() {
    this.state.recorder.stop();
    this.state.tracks.forEach(track => {
      track.track.disconnect()
    })
    console.log(this.state.recorder.state);
    console.log("recorder stopped");
  }

  addFilter(track, filters, filter) {
    let lastFilter = filters[filters.length - 1]
    if (lastFilter) {
      lastFilter.disconnect();
      lastFilter.connect(filter);
      filter.connect(this.props.audioCtx.master.analyser)
    }
    else {
      track.disconnect();
      track.connect(filter);
      filter.connect(this.props.audioCtx.master.analyser)
    }
    filters.push(filter)
    this.setState({
      tracks: this.state.tracks
    })
  }

  removeFilter(track, filters, index) {
    let currentFilter = filters[index];
    currentFilter.disconnect()
    let lastFilter = filters[index - 1];
    let nextFilter = filters[index + 1]
    if (lastFilter) {
      lastFilter.disconnect()
      if (nextFilter) {
        lastFilter.connect(nextFilter)
      }
      else {
        lastFilter.connect(this.props.audioCtx.master.analyser)
      }
    }
    else {
      if (nextFilter) {
        track.connect(nextFilter)
      }
      else {
        track.connect(this.props.audioCtx.master.analyser)
      }
    }
    filters.splice(index, 1)
  }

  addWaveform(buffer, index) {
    let waveform;
    webAudioBuilder(this.props.audioCtx.audioContext, buffer, (error, wave) => {
      waveform = wave;
    })
    let canvas = this.refs[`canvas${index}`]
    const interpolateHeight = (total_height) => {
      const amplitude = 256;
      return (size) => total_height - ((size + 128) * total_height) / amplitude;
    };
    // var count = thisContext.props.audioNames.length
    const y = interpolateHeight(canvas.height);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    // from 0 to 100 
    waveform.min.forEach((val, x) => ctx.lineTo(x + 0.5, y(val) + 0.5));
    // then looping back from 100 to 0 
    waveform.max.reverse().forEach((val, x) => {
      ctx.lineTo((waveform.offset_length - x) + 0.5, y(val) + 0.5);
    });
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
    this.setState({
      addWave: false
    })
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

  playAll() {
    let { tracks } = this.state;
    for (var i = 0; i < tracks.length; i++) {
      let filters = tracks[i].filters
      tracks[i].track.disconnect();
      var source = this.props.audioCtx.audioContext.createBufferSource();
      // set the buffer in the AudioBufferSourceNode
      source.buffer = tracks[i].buffer
      tracks[i].track = source;

      for (var j = 0; j < filters.length; j++) {
        console.log(filters)
        filters[j].disconnect();
      }
      if (filters.length) {
        tracks[i].track.connect(filters[0])
        for (var k = 1; k < filters.length; k++) {
          filters[k - 1].connect(filters[k])
        }
        filters[filters.length - 1].connect(this.props.audioCtx.master.analyser)
      } else {
        tracks[i].track.connect(this.props.audioCtx.master.analyser)
      }
    }
    tracks.forEach((track, ind) => {
      if (!(ind === 0)) {
        track.track.start(0, .30);

      } else {
        track.track.start();
      }
    })
  }

  audioPlay(track, filters) {
    track.start();
  }

  audioStop(track) {
    this.state.tracks.forEach(track => {
      track.track.disconnect()
    })
  }

  render() {
    return (
      <div id="container">
        <section id="recordings">
          <h1> This is where dem records go homie</h1>
          {
            this.state.tracks.map((audio, ind) => {

              return (
                <div>
                  <button onClick={(evt) => {
                    evt.preventDefault();
                    this.audioPlay(audio.track)
                  }}>Play</button>

                  <button onClick={(evt) => {
                    evt.preventDefault();
                    this.audioStop(audio.track)
                  }}>Stop</button>

                  <div onClick={(evt) => {
                    if (this.state.selected !== ind) {
                      evt.preventDefault();
                      this.setState({
                        selected: ind
                      });
                    }
                    else {
                      evt.preventDefault();
                      this.setState({
                        selected: null
                      })
                    }
                  }}>
                    <div>{audio.name}</div>
                    <canvas ref={`canvas${ind}`} width={1250} height={300} />
                  </div>
                  {
                    this.state.selected === ind ? (<FilterList track={audio} addFilter={this.addFilter} removeFilter={this.removeFilter} />) : (<div></div>)
                  }
                </div>
              )
            })
          }
        </section>

        <section id="carousel">
          <div id="carousel-text">

          </div>
          {/*<img className="carousel-image" src="https://www.googleplaymusicdesktopplayer.com/img/par1.jpg" />*/}
          <canvas className="carousel-image" ref="visualizer" width={1250} height={1250} />
          <img className="carousel-image hidden" src="images/bg/city.jpg" />
          <img className="carousel-image hidden" src="images/bg/underwater.jpg" />
          <img className="carousel-image hidden" src="images/bg/brightsun.jpg" />
        </section>


        <section id="mixing-board">
          <button onClick={(evt) => {
            evt.preventDefault();
            this.playAll();
          }}>Play All!!</button>

          <button onClick={(evt) => {
            evt.preventDefault();
            this.startRecording();
          }}>Start Recording</button>

          <button onClick={(evt) => {
            evt.preventDefault();
            this.stopRecording();
          }}>Stop Recording</button>

          {/*<Master />
          <MicMaster />*/}
        </section>

        {/*<section id="playbar">
          <Footer />
        </section>*/}
      </div>

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


export default connect(mapState, mapDispatch)(Solo);
