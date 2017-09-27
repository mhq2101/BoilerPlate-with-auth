import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
// import Audio from './Audio';
// import Home from './Home';
// import LocationSelection from './LocationSelection';
// import Login from './Login';
// import UserPage from './UserPage';
// import ChatroomPage from './ChatroomPage.jsx';
import Signup from './Signup.jsx';
// import { fetchAudio } from '../redux/reducers/audioStream.jsx';
// import store from '../store.jsx';
// import { joinChatRoom } from '../webRTC/client.jsx';
// import GMapImage from './VR/GMapImage';
// import { setCurrentPanoId } from '../redux/reducers/panoId';
// import { fetchChatrooms } from '../redux/reducers/chatroom';

export default class Root extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
      <Switch>
        <Route exact path='/' component={Signup} />
      </Switch>
			</div >
		)
  }
}


// export default withRouter(connect(mapState, mapDispatch)(Root))
