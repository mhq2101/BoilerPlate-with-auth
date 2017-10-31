import React from 'react'
// import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

/* -----------------    COMPONENT     ------------------ */

export default class Compressor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      threshold: this.props.filterNode.threshold.value,
      ratio: this.props.filterNode.ratio.value
    }
    this.changeThreshold = this.changeThreshold.bind(this)
    this.changeRatio = this.changeRatio.bind(this)
  }

  changeRatio(evt) {
    this.setState({
      ratio: evt.target.value
    })
  }

  changeThreshold(evt) {
    this.setState({
      threshold: evt.target.value
    })
  }

  render() {
    const { filterNode, adjustCompressorValues } = this.props
    return (
      <div className="list-group-item min-content user-item guitar-item">
        <div className="media">
          <h2> Filter: Compressor </h2>
          <h5 className="tucked-list">
            <form> Filter Threshold
                        <input type="range" id="freq" defaultValue="0" step="1" min='-40' max='0' onInput={(evt) => {
                adjustCompressorValues('threshold', evt, filterNode);
                this.changeThreshold(evt)
              }}></input>
            </form>
            <form> Ratio
                        <input type="range" id="freq" defaultValue="1" step="1" min='1' max='20' onInput={(evt) => {
                adjustCompressorValues('ratio', evt, filterNode);
                this.changeRatio(evt)
              }}></input>
            </form>
            <span> Threshold: {this.state.threshold} dB | </span>
            <span> Ratio: {this.state.ratio} | </span>
          </h5>
        </div>
      </div>
    )
  }
}
