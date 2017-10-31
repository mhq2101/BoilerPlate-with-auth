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
      tracks: []
    })

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
            // thisContext.props.addBuffer(buffer);
            // thisContext.props.addName(name)
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

  }

  componentDidUpdate() {
    if (this.state.addWave) {
      this.addWaveform(this.state.tracks[this.state.tracks.length - 1].buffer, this.state.tracks.length - 1)
    }
  }

  addFilter(track, filters, filter) {
    let lastFilter = filters[filters.length - 1]
    if (lastFilter) {
      lastFilter.disconnect();
      lastFilter.connect(filter);
      filter.connect(this.props.audioCtx.audioContext.destination)
    }
    else {
      track.disconnect();
      track.connect(filter);
      filter.connect(this.props.audioCtx.audioContext.destination)
    }
    filters.push(filter)
    this.setState({
      tracks: this.state.tracks
    })
  }

  removeFilter(track, filters, index) {
    let currentFilter = filters[index];
    currentFilter.disconnect()
    let lastFilter = filters[index-1];
    let nextFilter = filters[index+1]
    if (lastFilter) {
      lastFilter.disconnect()
      if(nextFilter) {
        lastFilter.connect(nextFilter)
      }
      else {
        lastFilter.connect(this.props.audioCtx.audioContext.destination)
      }
    }
    else {
      if(nextFilter) {
        track.connect(nextFilter)
      }
      else {
        track.connect(this.props.audioCtx.audioContext.destination)
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
        filters[filters.length - 1].connect(this.props.audioCtx.audioContext.destination)
      } else {
        tracks[i].track.connect(this.props.audioCtx.audioContext.destination)
      }
    }
    tracks.forEach(track => {
      track.track.start()
    })
  }

  audioPlay(track, filters) {
    track.start();
  }

  audioStop(track) {
    track.disconnect();
  }

  render() {
    console.log(this.state.tracks)
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

        <section id="mixing-board">
          <button onClick={(evt) => {
            evt.preventDefault();
            this.playAll();
          }}>Play All!!</button>
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
