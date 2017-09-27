import React from 'react';
import { connect } from 'react-redux';

/* -----------------    COMPONENT     ------------------ */

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: ''
    }
    this.onSignupSubmit = this.onSignupSubmit.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onLogoutSubmit = this.onLogoutSubmit.bind(this);
    this.handleChangeToName = this.handleChangeToName.bind(this);
    this.handleChangeToEmail = this.handleChangeToEmail.bind(this);
    this.handleChangeToPassword = this.handleChangeToPassword.bind(this);
  }
   onSignupSubmit(event) {
    event.preventDefault();
    this.props.signup(this.state.name, this.state.email, this.state.password)
  }

   onLoginSubmit(event) {
    event.preventDefault();
    this.props.login(this.state.email, this.state.password)
  }

  onLogoutSubmit(event) {
    event.preventDefault();
    this.props.logout();
  }

  handleChangeToName(event) {
    this.setState({ name: event.target.value })
  }

  handleChangeToEmail(event) {
    this.setState({ email: event.target.value })
  }

  handleChangeToPassword(event) {
    this.setState({ password: event.target.value })
  }

  render() {
    return (
      <div className="signin-container">
        <div className="buffer local">Signup
          <form onSubmit={this.onSignupSubmit}>
            <div className="form-group">
              <label>name</label>
              <input
                name="name"
                type="name"
                className="form-control"
                onChange={(evt) => {
                  this.handleChangeToName(evt)
                }}
                required
              />
            </div>
            <div className="form-group">
              <label>email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                onChange={(evt) => {
                  this.handleChangeToEmail(evt)
                }}
                required
              />
            </div>
            <div className="form-group">
              <label>password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                onChange={(evt) => {
                  this.handleChangeToPassword(evt)
                }}
                required
              />
            </div>
            <button type="submit" className="btn btn-block btn-primary">Signup</button>
          </form>
        </div>
        <div className="buffer local">Login
          <form onSubmit={this.onLoginSubmit}>
            <div className="form-group">
              <label>email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                onChange={(evt) => {
                  this.handleChangeToEmail(evt)
                }}
                required
              />
            </div>
            <div className="form-group">
              <label>password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                onChange={(evt) => {
                  this.handleChangeToPassword(evt)
                }}
                required
              />
            </div>
            <button type="submit" className="btn btn-block btn-primary">Login</button>
          </form>
        </div>
        <button type="submit" onClick={this.onLogoutSubmit} className="btn btn-block btn-primary">Logout</button>
        
        <div className="or buffer">
          <div className="back-line">
            <span>OR</span>
          </div>
        </div>
        <div className="buffer oauth">
          <p>
            <a
              target="_self"
              href="/auth/google"
              className="btn btn-social btn-google">
              <i className="fa fa-google" />
              <span>Signup with Google</span>
            </a>
          </p>
        </div>
      </div>
    );
  }

 
}

/* -----------------    CONTAINER     ------------------ */
import { login, logout, signup } from '../redux/reducers/auth.jsx';

const mapDispatch = { login, logout, signup }


export default connect(null, mapDispatch)(Signup);
