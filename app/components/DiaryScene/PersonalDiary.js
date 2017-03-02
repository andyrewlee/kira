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
      dataSource: ds.cloneWithRows([
        {
          id: 1,
          body: "My bed. 6 pillows. 4 heavy blankets. Cool sheets. So warm. So comforting. So safe. Lying in bed with the covers drawn over my head. Leaving a small hole to breathe out of. Closing my eyes. For now the problems and worries are non-existent. I forget about the to-do list.",
          created_at: moment('2017-03-01T21:52:06-08:00')
        },
        {
          id: 2,
          body: "Forget about showering. Forget about cleaning. Showers that need scrubbing. Dinner. Dogs that need to be walked. Bills that need to be paid. Doctors I need to call back. Appointments that need to be made.",
          created_at: moment('2017-03-01T23:50:58-08:00')
        },
        {
          id: 3,
          body: "20 years from now I won't remember today. These are the words that pushed me to start writing a diary. I probably won't write it here but seeing this in my post history is a good reminder.",
          created_at: moment('2017-03-01T22:52:06-08:00')
        }
      ])
    };
  }

  render() {
    return (
      <ListView
        style={{width: Dimensions.get('window').width}}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <DiaryCell rowData={rowData} />}
      />
    );
  }
}
