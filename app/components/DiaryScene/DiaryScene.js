import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Entypo';

import {
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS,
  Alert,
  Navigator
} from 'react-native';

import Diary from './Diary';

export default class DiaryScene extends Component {
  constructor(props) {
    super(props);
    this.state = { scene: 'default' };
  }

  handleLogout() {
    this.props.handleLogout();
  }

  render() {
    let nextRoute;

    return (
      <NavigatorIOS
        ref="nav"
        initialRoute={{
          component: Diary,
          title: 'kira',
          barTintColor: '#d7baa1',
          tintColor: '#404040',
          titleTextColor: '#800000',
          rightButtonIcon: require('../../images/logout.png'),
          onRightButtonPress: () => this.handleLogout()
        }}
        style={{flex: 1}}
      />
    );
  }
}
