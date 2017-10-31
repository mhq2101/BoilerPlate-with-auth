import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import  Navbar  from './Navbar'
// import Audio from './Audio';
// import Home from './Home';
// import LocationSelection from './LocationSelection';
// import Login from './Login';
// import UserPage from './UserPage';
// import ChatroomPage from './ChatroomPage.jsx';
import Signup from './Signup.jsx';
import Home from './Home.jsx';
import Solo from './Solo.jsx';
import { fetchAudio } from '../redux/reducers/audioStream.jsx';
// import { joinChatRoom } from '../webRTC/client.jsx';
// import GMapImage from './VR/GMapImage';
// import { setCurrentPanoId } from '../redux/reducers/panoId';
// import { fetchChatrooms } from '../redux/reducers/chatroom';

class Root extends React.Component {
  componentDidMount() {
    this.props.fetchAudio();
  }

  render() {
    return (
      <div>
        <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Signup} />
        <Route exact path='/solo' component={Solo} />
      </Switch>
			</div >
		)
  }
}

const mapDispatch = {fetchAudio};

export default withRouter(connect(null, mapDispatch)(Root))
