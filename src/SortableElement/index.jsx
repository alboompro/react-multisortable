import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { getBoundsForNode, provideDisplayName } from '../utils'

export default function sortableElement (WrappedComponent) {
  return class extends Component {
    state = {
      selected: false,
      selecting: false
    }

    static displayName = provideDisplayName('SortableElement', WrappedComponent);

    static contextTypes = {
      selectable: React.PropTypes.object
    }

    static propTypes = {
      selected: PropTypes.bool
    }

    static defaultProps = {
      selected: false
    }

    componentDidMount () {
      this.node = ReactDOM.findDOMNode(this) // eslint-disable-line
      this.registerSelectable()
    }

    componentWillUnmount () {
      this.context.selectable.unregister(this)
    }

    registerSelectable = containerScroll => {
      this.bounds = getBoundsForNode(this.node, containerScroll)
      this.context.selectable.register(this)
    }

    render () {
      const props = {
        ...this.props,
        selected: this.state.selected,
        selecting: this.state.selecting
      }

      return (
        <WrappedComponent {...props} />
      )
    }
  }
}
