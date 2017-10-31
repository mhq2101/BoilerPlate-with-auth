import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { leaveChatRoom } from '../webRTC/client.jsx'
import AudioDrop from '../webRTC/audioDrop.js';
import Gain from './Gain';
import { NavLink } from 'react-router-dom';
import { Row, Col, Button, Input, Icon, Table } from 'react-materialize'

import NavBar from './NavBar.jsx';

/* -------Component--------- */

class ChatroomPage extends React.Component {

  constructor() {
    super()
    this.state = ({
      canJoin: false,
      canPlay: false,
      canPause: false,
      canStop: false,
      canDrop: true,
    })

    this.adjustGainValue = this.adjustGainValue.bind(this);
    this.audioPlay = this.audioPlay.bind(this);
    this.audioPause = this.audioPause.bind(this);
    this.audioStop = this.audioStop.bind(this);
    this.audioDropHandle = this.audioDropHandle.bind(this);
    this.audioConnect = this.audioConnect.bind(this);
    this.audioDisconnect = this.audioDisconnect.bind(this);
  }

  adjustGainValue(node, event) {
    const value = event.target.value
    node.gain.value = value
  }

  audioDropHandle(event, context) {
    event.preventDefault();
    // const gainNode = context.createGain();
    // this.setState({
    // 	gain: gainNode
    // })
    const thisContext = this;
    AudioDrop({
      context: context,
      elements: window.document.body,
      drop: function (buffer, file) {
        var name = file.name.replace(/\.[^/.]+$/, "");
        if (AudioDrop.isValidVariableName(name)) {
          window[name] = buffer;
          //REDUX!!!!!!
          thisContext.props.addBuffer(buffer);
          thisContext.props.addName(name)
          thisContext.setState({
            canPlay: true // ehh...
          })
          console.log('Added the variable "' + name + '"" to the window.');
        } else {
          window[name + '-sample'] = buffer;
          console.log('Added the variable window["' + name + '-sample"] to the window.');
        }
      }
    });
    //redux
    this.setState({
      canDrop: false
    })
  }

  audioPlay(event, start, current, nextOrPrev) {

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
    source.connect(this.props.audioCtx.gain);
    this.props.audioCtx.gain.connect(this.props.audioCtx.audioContext.destination);
    this.props.audioCtx.gain.connect(this.props.audioCtx.audioDest);
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

  audioConnect(event) {
    //in case youre already connect.. but like dont press it twice you dumdum fuckina' betch
    if (this.props.audioStreamSource !== null) {
      this.props.audioStreamSource.disconnect();
    }
    event.preventDefault();
    const source = this.props.audioStream && this.props.audioCtx.audioContext.createMediaStreamSource(this.props.audioStream);
    this.props.setStreamSource(source);
    source.connect(this.props.audioCtx.audioDest);
    this.props.setMicConnection(true);
  }

  audioDisconnect(event) {
    event.preventDefault();
    this.props.audioStreamSource.disconnect();
    this.props.setMicConnection(false);
  }

  componentDidMount() {
    if (!this.props.chatroom.chatroom.id) {
      this.props.joinAndGo(this.props.match.params.name)
    }
    if (this.props.canDrop) {
      const thisContext = this;
      const context = this.props.audioCtx.audioContext;
      AudioDrop({
        context: context,
        elements: window.document.body,
        drop: function (buffer, file) {
          var name = file.name.replace(/\.[^/.]+$/, "");
          if (AudioDrop.isValidVariableName(name)) {
            window[name] = buffer;
            //REDUX!!!!!!
            thisContext.props.addBuffer(buffer);
            thisContext.props.addName(name)
            // thisContext.setState({
            //   canPlay: true // ehh...
            // })
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
    if (!this.props.auth.id) {
      (this.props.history.push('/login'))
    }
  }

  render() {
    let { canJoin, canPlay, canPause, canStop, canDrop } = this.state;
    const { audioStream, audioCtx, webrtc, audioSource, audioBuffers, audioNames, currentSongIndex, audioStreamSource } = this.props;
    const { audioContext, audioDest, gain } = this.props.audioCtx;

    if (audioSource !== null) {
      audioSource.onended = (event) => {
        this.audioPlay(null, 0, currentSongIndex + 1)
      }
    }
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="section">
            <h4>Welcome to Chatroom: {this.props.chatroom.chatroom.name}</h4>
            <h5>Audio Section</h5>
            <h6>Drag and Drop your Audio Files Anywhere on the Screen to Start!</h6>
            {/*<Button className="blue" onClick={(event) => this.audioDropHandle(event, audioCtx.audioContext)}
              disabled={!canDrop}> Drop <Icon medium left>music_note</Icon></Button>*/}
            

            <p>Your Playlist ({audioBuffers.length} Songs)
            {
                audioNames.map((name, ind) => {
                  return (<div key={ind}>{ind + 1}. {name}
                    <Button
                      onClick={(event) => this.audioPlay(event, 0, ind)}
                    >Play<Icon left>play_arrow</Icon>
                    </Button>
                  </div>)
                })
              }
            </p>

            <Row>
              <Col s={12}>
                <div className="hide-on-small-only">
                  <Button className="blue"
                    onClick={(event) => this.audioPlay(event, 0, currentSongIndex - 1, 'prev')}
                  >Previous<Icon left>skip_previous</Icon></Button>
                  <Button className="blue"
                    onClick={(event) => this.audioPlay(event, null, currentSongIndex)}
                    >Play<Icon left>play_arrow</Icon></Button>
                  <Button className="blue"
                    onClick={(event) => this.audioPause(event)}
                    disabled={!canPause}>Pause<Icon left>pause</Icon></Button>
                  <Button className="blue"
                    onClick={(event) => this.audioStop(event)}
                    disabled={!canStop}>Stop<Icon left>stop</Icon></Button>
                  <Button className="blue"
                    onClick={(event) => this.audioPlay(event, 0, currentSongIndex + 1, 'next')}
                  >Next<Icon left>skip_next</Icon></Button>
                </div>

                <div className="hide-on-med-and-up">
                  <Button className="btn-music-mobile blue"
                    onClick={(event) => this.audioPlay(event, 0, currentSongIndex - 1, 'prev')}
                  ><Icon>skip_previous</Icon></Button>
                  <Button className="btn-music-mobile blue"
                    onClick={(event) => this.audioPlay(event, null, currentSongIndex)}
                    disabled={!canPlay}><Icon>play_arrow</Icon></Button>
                  <Button className="btn-music-mobile blue"
                    onClick={(event) => this.audioPause(event)}
                    disabled={!canPause}><Icon>pause</Icon></Button>
                  <Button className="btn-music-mobile blue"
                    onClick={(event) => this.audioStop(event)}
                    disabled={!canStop}><Icon>stop</Icon></Button>
                  <Button className="btn-music-mobile blue"
                    onClick={(event) => this.audioPlay(event, 0, currentSongIndex + 1, 'next')}
                  ><Icon>skip_next</Icon></Button>
                </div>
              </Col>
            </Row>

            {
              gain !== null ? (<Gain node={gain} adjustGainValue={this.adjustGainValue} />) : (<div></div>)
            }

            <Row>
              <Col>
                <Button type="submit" className="blue" onClick={(event) => this.audioConnect(event)}>Connect Microphone</Button>
                <Button type="submit" className="blue" onClick={(event) => this.audioDisconnect(event)}>DisConnect Microphone</Button>
              </Col>
            </Row>

            <Row>
              <Col>
                <Button className="blue" onClick={() => {
                  leaveChatRoom(this.props.chatroom.chatroom.name)
                  this.setState({
                    canJoin: true
                  })
                  this.props.history.push('/user')
                }} disabled={canJoin}>Leave Room<Icon left>chevron_left</Icon>
                </Button>

                <Button type="submit" className="blue" onClick={() => this.props.history.push(`/${this.props.chatroom.chatroom.name}/location-selection`)}>Select Your Location</Button>
              </Col>
            </Row>

            <h5>Users In Room: {this.props.chatroom.name}</h5>
            <Table responsive striped hoverable>
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {webrtc && webrtc.get('peerNames').valueSeq().toArray().map(name => {
                  return (
                    <tr key={name}>
                      <td>{name}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    )
  }
}



/*-------Container-----------*/
import { joinAndGo } from '../redux/reducers/chatroom.jsx';
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

const mapState = ({ auth, chatroom, audioStream, audioBuffers, audioNames, audioSource, currentSongIndex, audioCtx, webrtc, timeStarted, startTime, audioStreamSource, canDrop }) => ({
  auth,
  chatroom,
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

const mapDispatch = { joinAndGo, setSource, addBuffer, addName, setCurrent, setTime, setStart, setStreamSource, setMicConnection, setMusicPlaying, setDrop };

export default withRouter(connect(mapState, mapDispatch)(ChatroomPage));
