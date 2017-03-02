import React, { Component } from 'react';

import {
  View,
  Text,
  Dimensions,
  StyleSheet
} from 'react-native';


export default class DiaryEntry extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textContent}>
        What is isolation? The only answer I can come up with is complete seclusion from any other human contact. Of course, the statement seems broad, but the practice of isolation and the results proceeding such is broad.
         </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    backgroundColor: '#dec7b3',
    height: Dimensions.get('window').height
  },
  textContent: {
    paddingRight: 16,
    paddingLeft: 16,
    fontSize: 24,
    color: '#404040'
  }
});
