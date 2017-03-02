import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Alert
} from 'react-native';

import LoginScene from './app/components/LoginScene/LoginScene';
import DiaryScene from './app/components/DiaryScene/DiaryScene';

export default class Kira extends Component {
  constructor(props) {
    super(props);
    this.state = { scene: 'diary' };
  }

  handleLogout() {
    this.setState({ scene: 'login' });
  }

  handleDiary() {
    this.setState({ scene: 'diary' });
  }

  render() {
    let currentScene;

    if(this.state.scene === 'diary') {
      currentScene = <DiaryScene handleLogout={this.handleLogout.bind(this)} />;
    } else {
      currentScene = <LoginScene handleDiary={this.handleDiary.bind(this)} />;
    }

    return (
      currentScene
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('Kira', () => Kira);
