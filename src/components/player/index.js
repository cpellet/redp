import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import SongsList from './components/songs list';
import PlayerControls from './components/player controls';

const { ipcRenderer } = window.require('electron');

const Player = inject('appStore')(observer(class PlayerClass extends Component {
  constructor(props) {
    super(props);
    this.state={shouldShow: true};
  }
  handleKeyPress = ({ code }) => {
    if (document.activeElement.nodeName !== 'BODY') this.setState({shouldShow:false});
  }
  handleMouseDown = ({ code }) => {
    if (document.activeElement.nodeName === 'INPUT') this.setState({shouldShow:false});
    if (document.activeElement.nodeName === 'BODY') this.setState({shouldShow:true});
  }
  componentDidMount() {
    ipcRenderer.on('files:open', (e, filePaths) => {
      this.props.appStore.openFile(filePaths);
    })
    window.addEventListener('keypress', this.handleKeyPress);
    window.addEventListener('click', this.handleMouseDown);
  }
  render() {
    return (
      <section style={{
          display: this.state.shouldShow? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '1rem',
          flex: '1',
          justifyContent: 'flex-end',
        }}
      >
        <SongsList />
        <PlayerControls />
      </section>
    );
  }
}));

export default Player;
