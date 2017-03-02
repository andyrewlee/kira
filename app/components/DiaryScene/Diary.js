import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Entypo';

import {
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';

export default class Diary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'todayTab',
      text: ''
    };
  }

  closeKeyboard() {
    Alert.alert('hi', 'ho');
  }

  renderContent(pageText) {
    return (
      <View style={styles.tabContent}>
        <TextInput
          style={{height: 400, borderColor: 'transparent'}}
          onChangeText={(text) => this.setState({text})}
          placeholder="how was your day?"
          padding={16}
          multiline
          value={this.state.text}
        />
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
            this.setState({
              selectedTab: 'diaryTab'
            });
          }}>
          {this.renderContent('Diary')}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="Today"
          iconName="pencil"
          selected={this.state.selectedTab === 'todayTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'todayTab'
            });
          }}>
          {this.renderContent('Today')}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="Diaries"
          iconName="light-up"
          title="Diaries"
          selected={this.state.selectedTab === 'diariesTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'diariesTab'
            });
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
  tabText: {
    color: 'white',
    marginTop: 30
  },
  container: {
    flex: 1,
    backgroundColor: '#d7baa1'
  }
});
