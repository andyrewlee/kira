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
import PersonalDiary from './PersonalDiary';
import Diaries from './Diaries';

export default class Diary extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedTab: 'todayTab' };
  }

  addEntry(text) {
    this.props.addEntry(text);
    this.setState({selectedTab: 'diaryTab'});
  }

  renderContent(pageText) {
    let currentTab;
    if(this.state.selectedTab === 'todayTab') {
      currentTab = <Today addEntry={this.addEntry.bind(this)}/>;
    } else if(this.state.selectedTab == 'diaryTab'){
      currentTab = <PersonalDiary
                     myDiaryEntries={this.props.myDiaryEntries}
                     handleDiaryEntry={this.props.handleDiaryEntry.bind(this)} />;
    } else {
      currentTab = <Diaries
                     allDiaryEntries={this.props.allDiaryEntries}
                     handleDiaryEntry={this.props.handleDiaryEntry.bind(this)} />;
    }

    return (
      <View style={styles.tabContent}>
        {currentTab}
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
    alignItems: 'center',
    backgroundColor: '#dfc7b2'
  },
  container: {
    flex: 1,
    backgroundColor: '#d7baa1'
  }
});
