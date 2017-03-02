import React, { Component } from 'react';
import moment from 'moment';

import {
  View,
  Text,
  Alert,
  ListView,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

export default class DiaryCell extends Component {
  constructor(props) {
    super(props);
  }

  truncateText(str, length) {
    const ending = '...';
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  }

  timeAgoInWords(momentDate) {
    return momentDate.fromNow()
                     .replace(' ', '')
                     .replace('seconds', 's')
                     .replace('minutes', 'm')
                     .replace('hours', 'h');
  }

  render() {
    const dateWritten = new Date(this.props.rowData.created_at);

    return (
      <TouchableOpacity style={styles.cellContainer}>
        <Text style={styles.bodyContent}>
          {this.truncateText(this.props.rowData.body, 35)}
        </Text>
        <Text style={styles.timeContent}>
          {this.timeAgoInWords(this.props.rowData.created_at)}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  bodyContent: {
    padding: 16
  },
  timeContent: {
    padding: 16,
    color: 'rgba(64, 64, 64, 0.4)'
  },
  cellContainer: {
    marginBottom: 1,
    borderBottomWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    borderBottomColor: 'rgba(64, 64, 64, 0.1)'
  }
});
