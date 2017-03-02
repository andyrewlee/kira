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

  updateText(text) {
    this.props.addEntry(this.state.text);
    this.setState({text: ''});
  }

  render() {
    return (
      <TextInput
        style={styles.textInput}
        returnKeyType="done"
        onChangeText={(text) => this.setState({text: text})}
        onSubmitEditing={(event) => this.updateText(
          'onSubmitEditing text: ' + event.nativeEvent.text
        )}
        placeholder="how was your day?"
        value={this.state.text}
        enablesReturnKeyAutomatically={false}
        blurOnSubmit={true}
        returnKeyType="go"
        multiline
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
    fontSize: 24,
    paddingLeft: 16
  }
});
