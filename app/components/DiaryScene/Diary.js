import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Entypo';

import {
  View,
  Text,
  TabBarIOS,
  StyleSheet,
  KeyboardAvoidingView
} from 'react-native';

import Today from './Today';

export default class Diary extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedTab: 'todayTab' };
  }

  renderContent(pageText) {
    return (
      <View style={styles.tabContent}>
        <Today />
      </View>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <TabBarIOS
          unselectedTintColor="#00585b"
          tintColor="#099499"
          unselectedItemTintColor="#00585b"
          barTintColor="#d0ad8f">
          <Icon.TabBarItemIOS
            title="Diary"
            iconName="stopwatch"
            selected={this.state.selectedTab === 'diaryTab'}
            onPress={() => {
              this.setState({ selectedTab: 'diaryTab' });
            }}>
            {this.renderContent('Diary')}
          </Icon.TabBarItemIOS>
          <Icon.TabBarItemIOS
            title="Today"
            iconName="pencil"
            selected={this.state.selectedTab === 'todayTab'}
            onPress={() => {
              this.setState({ selectedTab: 'todayTab' });
            }}>
            {this.renderContent('Today')}
          </Icon.TabBarItemIOS>
          <Icon.TabBarItemIOS
            title="Diaries"
            iconName="light-up"
            title="Diaries"
            selected={this.state.selectedTab === 'diariesTab'}
            onPress={() => {
              this.setState({ selectedTab: 'diariesTab' });
            }}>
            {this.renderContent('Diaries')}
          </Icon.TabBarItemIOS>
        </TabBarIOS>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#dfc7b2'
  },
  container: {
    flex: 1,
    backgroundColor: '#d7baa1'
  }
});
