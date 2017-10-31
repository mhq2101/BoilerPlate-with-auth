import React from 'react'
// import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

/* -----------------    COMPONENT     ------------------ */

export default class EQ extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gain: this.props.filterNode.gain.value,
      frequency: this.props.filterNode.frequency.value,
      Q: this.props.filterNode.Q.value || 'none',
      type: this.props.filterNode.type
      
    }

    this.changeGain = this.changeGain.bind(this);
    this.changeFrequency = this.changeFrequency.bind(this);
    this.changeQ = this.changeQ.bind(this);
    this.changeType = this.changeType.bind(this);


  }
  changeType(string) {
    this.setState({
      type: string
    })
  }

  changeGain(evt) {
    this.setState({
      gain: evt.target.value
    })
  }

  changeFrequency(evt) {
    this.setState({
      frequency: evt.target.value
    })
  }

  changeQ(evt) {
    this.setState({
      Q: evt.target.value
    })
  }



  render() {
    const { filterNode, adjustEqValues } = this.props
    return (
      <div className="eq-list">
        <div className="media">
          <h2> Filter: EQ Filter </h2>
          <h5 className="tucked-list">
            <form> Filter Gain
                        <input type="range" id="freq" defaultValue="0" step="1" min='-20' max='20' onInput={(evt) => {
                adjustEqValues('gain', evt, filterNode);
                this.changeGain(evt);
              }}></input>
            </form>
            <form> Center Frequency
                        <input type="range" id="freq" defaultValue="40" step="1" min='60' max='12000' onInput={(evt) => {
                adjustEqValues('frequency', evt, filterNode);
                this.changeFrequency(evt);
              }}></input>
            </form>
            <form> Q Factor
                        <input type="range" id="freq" defaultValue="1" step=".1" min='.5' max='4' onInput={(evt) => {
                adjustEqValues('Q', evt, filterNode);
                this.changeQ(evt);
              }}></input>
            </form>
            Type: <select value={this.state.type} onChange={(evt) => {
              adjustEqValues('type', evt, filterNode);
              this.changeType(evt.target.value)
              }}>
              <option value="lowshelf">lowshelf</option>
              <option value="peaking">peaking</option>
              <option value="highshelf">highshelf</option>
            </select>
            <span> Filter Gain: {this.state.gain} dB | </span>
            <span> Frequency: {this.state.frequency} Hz | </span>
            <span> Q Factor: {this.state.Q}</span>
          </h5>
        </div>
      </div>
    )
  }
}

/* -----------------    CONTAINER     ------------------ */

// const mapState = ({ brands }) => ({ brands })

// export default connect(null, null)(EQ)
