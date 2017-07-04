import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import SelectBox from '../SelectBox'

import {
  isNodeInRoot,
  getBoundsForNode,
  doObjectsCollide,
  provideDisplayName
} from '../utils'

export default function SortableContainer(WrappedComponent) {
  return class extends Component {
    state = {
      selectionMode: false,
      mouseDownStarted: false,
      mouseMoveStarted: false,
      mouseUpStarted: false
    }

    static displayName = provideDisplayName('SortableContainer', WrappedComponent)

    static propTypes = {
      selectionModeClass: PropTypes.string,
      scrollContainer: PropTypes.string,
      globalMouse: PropTypes.bool
    }

    static childContextTypes = {
      selectable: PropTypes.object
    }

    static defaultProps = {
      selectionModeClass: 'selecting',
      globalMouse: false
    }

    /**
     * Limpa a seleção dos itens atuais e seta
     * os itens dentro dela como não selecionados
     */
    clearSelection = () => {
      for(const item of this.state.selectedItems){
        item.setState({ selected: false })
      }
      this.setState({ selectedItems: [], selectionMode: false })
    }

    componentDidMount () {
      this.rootNode = this.selectableGroup
      this.scrollContainer = document.querySelector(this.props.scrollContainer) || this.rootNode
      this.rootNode.addEventListener('mousedown', this.mouseDown)
      this.rootNode.addEventListener('touchstart', this.mouseDown)
    }

    componentWillUnmount () {
      this.rootNode.removeEventListener('mouseDown', this.mouseDown)
      this.rootNode.removeEventListener('touchstart', this.mouseDown)
    }

    constructor (props){
      super(props)
      this.selectedItems = []
      this.selectingItems = []
      this.registry = []
      this.mouseDownData = false
    }

    /**
     * Utilizado para retornar o objeto com o formato desktop (não touch) das
     * cordenadas do evento, independente da ação ser originária de um despositivo
     * movel ou desktop
     *
     * @param e Original Event
     * @returns {*}
     */
    desktopEventCoords (e) {
      if (e.pageX === undefined || e.pageY === undefined) { // Touch-device
        if (
            e.targetTouches[0] !== undefined &&
            e.targetTouches[0].pageX !== undefined
        ) { // For touchmove
          e.pageX = e.targetTouches[0].pageX
          e.pageY = e.targetTouches[0].pageY
        } else if (
            e.changedTouches[0] !== undefined &&
            e.changedTouches[0].pageX !== undefined
        ) { // For touchstart
          e.pageX = e.changedTouches[0].pageX
          e.pageY = e.changedTouches[0].pageY
        }
      }
      return e
    }

    getChildContext () {
      return {
        selectable: {
          register: this.registerSelectable,
          unregister: this.unregisterSelectable,
          clearSelection: this.clearSelection
        }
      }
    }

    getGroupRef = c => this.selectableGroup = c
    getSelectboxRef = c => this.selectbox = c

    /**
     *  Evento disparado quando o mouse ou toque é iniciado para seleção
     *  dos itens que  serão processados
     * @param e (JS Event)
     */
    mouseDown = e => {
      if (this.state.mouseDownStarted) return
      this.setState({ mouseDownStarted: true, mouseUpStarted: false })
      e = this.desktopEventCoords(e)

      // Esse bloco faz referencia aos nodes que estão marcados
      // para serem ignorados, feature não implementada

      // this.updateWhiteListNodes()
      // if (this.inIgnoreList(e.target)) {
      //   this.mouseDownStarted = false
      //   return
      // }

      const node = this.selectableGroup
      if(!this.props.globalMouse && !isNodeInRoot(e.target, node)) {
        const offsetData = getBoundsForNode(node)
        const collides = doObjectsCollide(
            {
              top: offsetData.top,
              left: offsetData.left,
              bottom: offsetData.offsetHeight,
              right: offsetData.offsetWidth
            },
            {
              top: e.pageY,
              left: e.pageX,
              offsetWidth: 0,
              offsetHeight: 0
            }
        )
        if (!collides) return
      }
      this.updateRootBounds()
      this.updateRegistry()

      const { scaledTop, scaledLeft } = this.applyScale(e.pageY, e.pageX)
      this.setState({
        mouseDownData: {
          boxLeft: scaledLeft,
          boxTop: scaledTop,
          scrollTop: this.scrollContainer.scrollTop,
          scrollLeft: this.scrollContainer.scrollLeft,
          target: e.target
        }
      })
      e.preventDefault()
      document.addEventListener('touchmove', this.openSelectbox)
      document.addEventListener('mouseup', this.mouseUp)
      document.addEventListener('touchend', this.mouseUp)
    }

    updateRegistry = () => {
      const containerScroll = {
        scrollTop: this.scrollContainer.scrollTop,
        scrollLeft: this.scrollContainer.scrollLeft,
      }
      for(const selectableItem of this.registry){
        selectableItem.registerSelectable(containerScroll)
      }
    }

    /**
     *  Adiciona ao registro um item selecionavel
     * @param selectableItem
     */
    registerSelectable = selectableItem => {
      this.registry.push(selectableItem)
      if (selectableItem.props.selected) {
        this.selectedItems.push(selectableItem)
      }
    }

    /**
     * Remove do registro um item selecionavel
     * @param selectableItem
     */
    unregisterSelectable = selectableItem => {
      let index = this.registry.indexOf(selectableItem)
      if (index > -1 ) return
      this.registry.splice(index, 1)
    }

    updateRootBounds() {
      if (this.scrollBounds) {
        this.oldScrollBounds = this.scrollBounds
      }
      this.scrollBounds = this.scrollContainer.getBoundingClientRect()
      this.maxScroll = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight
    }

    render () {
      const {
        className,
        selectionModeClass,
        style
      } = this.props

      const containerClasses = cx({
        [className]: !!className,
        [selectionModeClass]: this.state.selectionMode
      })

      return (
          <div ref={this.getGroupRef} style={style} className={containerClasses}>
            <SelectBox ref={this.getSelectboxRef} />
            <WrappedComponent {...this.props} />
          </div>
      )
    }
  }
}