import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';

/* -----------------    COMPONENT     ------------------ */

class Navbar extends React.Component {

  constructor(props) {
    super(props);

  }


  render() {
    return (
      <div>
        <div id="start-logo">
           <Link to="/" >
           <img alt="logo" src="images/WebDAW.png" />
           </Link>
        </div>
        <header>
          <div className="logo">
            <Link to="/" >
           <img alt="logo" src="images/WebDAW.png" />
           </Link>
          </div>
          <nav>
            <div className="nav-item">
              <a href="#">About</a>
            </div>
            <div className="nav-item">
              <a href="#">Features</a>
            </div>
            <div className="nav-item">
              <NavLink to="/solo" activeClassName="active">Solo Project</NavLink>
            </div>
            <div className="nav-item">
              <a href="#">Collab</a>
            </div>
            <div className="nav-item">
              <NavLink to="/login" activeClassName="active">Login/ Signup</NavLink>
            </div>
          </nav>
        </header>
      </div>
    );
  }


}

/* -----------------    CONTAINER     ------------------ */
// import { login, logout, signup } from '../redux/reducers/auth.jsx';

// const mapDispatch = { login, logout, signup }


export default connect(null, null)(Navbar);
