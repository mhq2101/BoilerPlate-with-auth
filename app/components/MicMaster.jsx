import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import Sidebar from '../Sidebar'
import EqualizerBand from './EqualizerBand'
import Compressor from './Compressor'
import Gain from './Gain'


/* -----------------    COMPONENT     ------------------ */

class MicMaster extends Component {
  constructor(props) {
    super(props)
    
    // this.handelAddNewFilter = this.handleAddNewFilter.bind(this)
    this.adjustEqValues = this.adjustEqValues.bind(this)
    this.adjustCompressorValues = this.adjustCompressorValues.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
   
  }

  render() {
    // const { audioCtx, source } = this.state
    const { micCompressor, micEq1, micEq2, micEq3, micEq4, micEq5, micGain } = this.props.audioCtx.micMaster

    return (

      <div className="user-list">
         <h1>Master Mic Mixer!</h1>
        <Compressor filterNode={micCompressor} adjustCompressorValues={this.adjustCompressorValues} />
        <div className="master-eq">
          <EqualizerBand filterNode={micEq1} adjustEqValues={this.adjustEqValues} />
          <EqualizerBand filterNode={micEq2} adjustEqValues={this.adjustEqValues} />
          <EqualizerBand filterNode={micEq3} adjustEqValues={this.adjustEqValues} />
          <EqualizerBand filterNode={micEq4} adjustEqValues={this.adjustEqValues} />
          <EqualizerBand filterNode={micEq5} adjustEqValues={this.adjustEqValues} />
        </div>
      </div>
    )
  }

  // handleAddNewFilter(event, type, options) {
  //   event.preventDefault()
  //   switch (type) {
  //     case 'EQ':
  //       var biquadFilter = this.state.audioCtx.createBiquadFilter()
  //       biquadFilter.type = 'peaking'
  //       this.props.addFilter(biquadFilter)
  //       break
  //     case 'Compressor':
  //       var compressor = this.state.audioCtx.createDynamicsCompressor()
  //       this.props.addFilter(compressor)
  //       break
  //     case 'Gain':
  //       var gain = this.state.audioCtx.createGain()
  //       this.props.addFilter(gain)
  //       break
  //     case 'Delay':
  //       var delay = this.state.audioCtx.createDelay()
  //       this.props.addFilter(delay)
  //   }
  // }

  // adjustDelayValue(event) {
  //   const value = event.target.value
  //   const node = this.props.filters[nodeInd]
  //   node.delayTime.value = value
  //   this.props.updateFilter(nodeInd, node)
  // }

  

  adjustEqValues(param, event, node) {
    const value = event.target.value
    switch (param) {
      case 'gain':
        node.gain.value = value
        // this.props.updateFilter(node)
        break
      case 'frequency':
        node.frequency.value = value
        // this.props.updateFilter(node)
        break
      case 'Q':
        node.Q.value = value
        // this.props.updateFilter(node)
        break
      case 'type':
        node.type = value
        break
    }
  }

  adjustCompressorValues(param, event, node) {
    const value = event.target.value
    switch (param) {
      case 'threshold':
        node.threshold.value = value
        // this.props.updateFilter(node)
        break
      case 'ratio':
        node.ratio.value = value
        // this.props.updateFilter(node)
        break
    }
  }

  handleRemove(event, node) {
    event.preventDefault()
    this.props.removeFilter(node)
  }
}

/* -----------------    CONTAINER     ------------------ */

import { updateFilter } from '../redux/reducers/filter.jsx'

const mapState = ({ audioCtx }) => ({ audioCtx })

const mapDispatch = { updateFilter }

export default connect(mapState, mapDispatch)(MicMaster)
