import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SelectBox extends Component {
  static propTypes = {
    fixedPosition: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    style: {
      border: '1px solid #000',
      backgroundColor: 'rgba(60, 60, 60, 0.5)',
      opacity: '0.2'
    }
  }

  state = {
    top: 0,
    left: 0,
    boxWidth: 0,
    boxHeight: 0,
    isBoxSelecting: false
  }

  getRef = () => this.selectbox
  getSelectboxRef = c => this.selectbox = c

  render () {
    const { style, className, fixedPosition} = this.props

    const boxStyle = {
      ...style,
      left: this.state.boxLeft,
      top: this.state.boxTop,
      width: this.state.boxWidth,
      height: this.state.boxHeight,
      zIndex: 9000,
      position: fixedPosition ? 'fixed' : 'absolute',
      cursor: 'default'
    }

    return (
        <div>
          {
            this.state.isBoxSelecting &&
                <div ref={this.getSelectboxRef}
                     style={boxStyle}
                     className={className} />
          }
        </div>
    )
  }
}
