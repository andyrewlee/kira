import React, { Component } from 'react';
import moment from 'moment';

import {
  View,
  Text,
  ListView,
  Dimensions
} from 'react-native';

import DiaryCell from './DiaryCell';

export default class PersonalDiary extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.myDiaryEntries)
    };
  }

  render() {
    return (
      <ListView
        style={{width: Dimensions.get('window').width}}
        dataSource={this.state.dataSource}
        renderRow={(rowData) =><DiaryCell rowData={rowData} handleDiaryEntry={this.props.handleDiaryEntry.bind(this)} />}
      />
    );
  }
}
