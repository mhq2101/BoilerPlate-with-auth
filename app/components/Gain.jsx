import React from 'react'
// import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

/* -----------------    COMPONENT     ------------------ */

export default class Gain extends React.Component {
  render() {
    const { filterNode, adjustGainValue } = this.props
    return (
            <div className="list-group-item min-content user-item guitar-item">
                <div className="media">
                    <h5 className="tucked-list">
                        <form> Volume
                        <input type="range" id="gain" defaultValue="1" step=".01" min='0' max='1' onInput={(evt) => adjustGainValue(evt, filterNode) }></input>
                        </form>
                    </h5>
                </div>
            </div>
    )
  }
}
