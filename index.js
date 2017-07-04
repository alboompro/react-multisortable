import 'babel-polyfill'
import React, {  Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { render } from 'react-dom'

// lib components
import { SortableContainer, SortableContainer2, SortableElement } from './src/index'

import './styles.scss'

class Container extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired
  }

  render () {
    const { items } = this.props
    return (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '100%',
        }}>
          {items.map((item, i) => <ListItem key={`list-item-${i}`} item={item} />)}
        </div>
    )
  }
}
const ListContainer = SortableContainer2(Container)

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    selectedClassname: PropTypes.string,
    selectingClassname: PropTypes.string
  }

  render () {

    const containerClasses = cx({
      'selected': this.props.selected,
      'selecting': this.props.selecting
    })

    return (
        <div style={{
          width: '30%',
          padding: '15px',
          height: '80px',
          backgroundColor: '#fff',
          userSelect: 'none',
          cursor: 'pointer',
          marginBottom: '20px'
        }} className={containerClasses}>
          {this.props.item.text}
        </div>
    )
  }
}
const ListItem = SortableElement(Item)

class Example extends Component {

  state = {
    orderableItems: [
      {text: '1'}, {text: '2'}, {text: '3'}, {text: '4'}, {text: '5'}, {text: '6'},
      {text: '7'}, {text: '8'}, {text: '9'}, {text: '10'}, {text: '11'}, {text: '12'},
      {text: '13'}, {text: '14'}, {text: '15'}, {text: '16'}, {text: '17'}, {text: '18'},
      {text: '19'}, {text: '20'}, {text: '21'}, {text: '22'}, {text: '23'}, {text: '24'},
      {text: '25'}, {text: '26'}, {text: '27'}, {text: '28'}, {text: '29'}, {text: '30'},
      {text: '31'}, {text: '32'}, {text: '33'}, {text: '34'}, {text: '35'}, {text: '36'},
      {text: '37'}, {text: '38'}, {text: '39'}, {text: '40'}, {text: '41'}, {text: '42'},
      {text: '43'}, {text: '44'}, {text: '45'}, {text: '46'}, {text: '47'}, {text: '48'},
      {text: '49'}, {text: '50'}, {text: '51'}, {text: '52'}, {text: '53'}, {text: '54'},
      {text: '55'}, {text: '56'}, {text: '57'}, {text: '58'}, {text: '59'}, {text: '60'},
      {text: '61'}, {text: '62'}, {text: '63'}, {text: '64'}, {text: '65'}, {text: '66'},
      {text: '62'}, {text: '63'}, {text: '64'}, {text: '65'}, {text: '66'}, {text: '67'},
    ]
  }

  render () {

    let containerStyle = {
      padding: '20px',
      height: '100%'
    }

    return (
       <ListContainer
           enableDeselect
           infinite
           containerHeight={400}
           elementHeight={80}
           items={this.state.orderableItems}
           style={containerStyle} />
    )
  }
}

render(<Example />, document.getElementById('root'))