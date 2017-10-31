import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import Sidebar from '../Sidebar'
import EqualizerBand from './EqualizerBand'
import Compressor from './Compressor'
// import Gain from './Gain'
// import Delay from './Delay'

/* -----------------    COMPONENT     ------------------ */

class FilterList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      added: '',
      removed: ''
    }

    this.handleAddNewFilter = this.handleAddNewFilter.bind(this)
    this.adjustEqValues = this.adjustEqValues.bind(this)
    this.adjustCompressorValues = this.adjustCompressorValues.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.adjustGainValue = this.adjustGainValue.bind(this)
    this.adjustDelayValue = this.adjustDelayValue.bind(this)
  }

  render() {
    let { track, audioCtx, addFilter, removeFilter } = this.props;
    let filters = track.filters
    // if (filters) {
    //   if (filters.length !== 0) {
    //     track && track.disconnect()
    //     for (var j = 0; j < filters.length; j++) {
    //       filters[j].disconnect()
    //     }
    //     track.connect(filters[0])
    //     for (var i = 1; i < filters.length; i++) {
    //       filters[i - 1].connect(filters[i])
    //     }
    //     filters[filters.length - 1].connect(audioCtx.audioContext.destination)
    //   } else {
    //     // track && track.connect(this.state.analyser)
    //     // this.state.analyser.connect(audioCtx.destination)
    //     track && track.connect(audioCtx.audioContext.destination)
    //   }
    // }
    return (
      <div className="container">
        <button
          className="btn btn-default"
          onClick={(event) => this.handleAddNewFilter(event, 'EQ')}>
          <span className="glyphicon glyphicon-plus" />Add EQ
                </button>
        <button
          className="btn btn-default"
          onClick={(event) => this.handleAddNewFilter(event, 'Compressor')}>
          <span className="glyphicon glyphicon-plus" />Add Compressor
                </button>
        {/*<button
                    className="btn btn-default"
                    onClick={(event) => this.handleAddNewFilter(event, 'Gain')}>
                    <span className="glyphicon glyphicon-plus" />Add Gain
                </button>*/}
        <button
          className="btn btn-default"
          onClick={(event) => this.handleAddNewFilter(event, 'Delay')}>
          <span className="glyphicon glyphicon-plus" />Add Delay
                </button>
        <br />
        <br />
        <div className="user-list">
          {
            filters && filters.map((node, ind) => {
              if (node instanceof BiquadFilterNode) {
                return (
                  <div>
                    <EqualizerBand filterNode={node} adjustEqValues={this.adjustEqValues} />
                    <button
                      className="btn btn-default"
                      onClick={(event) => {
                        event.preventDefault();
                        removeFilter(track.track, track.filters, ind)
                        this.setState({
                          removed: 'eq'
                        })
                      }}>
                      <span className="glyphicon glyphicon-remove" />REMOVE EQ
                                    </button>
                  </div>
                )
              }
              if (node instanceof DynamicsCompressorNode) {
                return (
                  <div>
                    <Compressor filterNode={node} adjustCompressorValues={this.adjustCompressorValues} />
                    <button
                      className="btn btn-default"
                      onClick={(event) => {
                        event.preventDefault();
                        removeFilter(track.track, track.filters, ind)
                        this.setState({
                          removed: 'compressor'
                        })
                      }}>
                      <span className="glyphicon glyphicon-remove" />REMOVE Compressor
                                    </button>
                  </div>
                )
              }
            })
          }
        </div>
      </div>
    )
  }

  handleAddNewFilter(event, type, options) {
    event.preventDefault()
    switch (type) {
      case 'EQ':
        var biquadFilter = this.props.audioCtx.audioContext.createBiquadFilter()
        biquadFilter.type = 'peaking'
        this.props.addFilter(this.props.track.track, this.props.track.filters, biquadFilter)
        this.setState({
          added: 'EQ'
        })
        break
      case 'Compressor':
        var compressor = this.props.audioCtx.audioContext.createDynamicsCompressor()
        this.props.addFilter(this.props.track.track, this.props.track.filters, compressor)
        this.setState({
          added: 'Compressor'
        })
        break
    }
  }

  adjustDelayValue(nodeInd, event) {
    const value = event.target.value
    const node = this.props.filters[nodeInd]
    node.delayTime.value = value
    this.props.updateFilter(nodeInd, node)
  }

  adjustGainValue(nodeInd, event) {
    const value = event.target.value
    const node = this.props.filters[nodeInd]
    node.gain.value = value
    this.props.updateFilter(nodeInd, node)
  }

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

  handleSwitch(nodeInd, newPriority) {
    this.props.switchPriority(nodeInd, newPriority)
  }

  handleRemove(event, node) {
    event.preventDefault()
    this.props.removeFilter(node)
  }
}

/* -----------------    CONTAINER     ------------------ */

// import {addFilter, removeFilter, updateFilter, switchPriority} from 'APP/app/reducers/filter'

const mapState = ({ audioCtx }) => ({ audioCtx })

// const mapDispatch = { addFilter, removeFilter, updateFilter, switchPriority }

export default connect(mapState)(FilterList)
