import React, { Component } from 'react';

import {
  TextInput,
  StyleSheet
} from 'react-native';

export default class Today extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => this.setState({text})}
        placeholder="how was your day?"
        multiline
        value={this.state.text}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 400,
    borderColor: 'transparent',
    paddingTop: 80,
    paddingRight: 16,
    paddingLeft: 16
  }
});
