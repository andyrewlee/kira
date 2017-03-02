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
import DiaryEntry from './DiaryEntry';

export default class DiaryScene extends Component {
  constructor(props) {
    super(props);
  }

  handleLogout() {
    this.props.handleLogout();
  }

  handleDiaryEntry() {
    const nextRoute = {
      component: DiaryEntry,
      title: 'Bar That',
      passProps: { myProp: 'bar' }
    };

    this.refs.nav.push(nextRoute);
  }

  render() {
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
          onRightButtonPress: () => this.handleLogout(),
          passProps: {
            handleDiaryEntry: this.handleDiaryEntry.bind(this)
          }
        }}
        style={{flex: 1}}
      />
    );
  }
}
