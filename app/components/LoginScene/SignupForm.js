import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  TouchableHighlight,
  Alert
} from 'react-native';

export default class SignupForm extends Component {
  loginButtonPressed() {
    this.props.handleLoginForm();
  }

  signupButtonPressed() {
    this.props.handleDiary();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.loginButtonPressed.bind(this)}
          style={styles.loginButtonContainer}>
          <Text style={styles.loginButtonText}>already have an account?</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="username"
          placeholderTextColor="rgba(64,64,64,0.5)"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          />

        <TextInput
          placeholder="email"
          placeholderTextColor="rgba(64,64,64,0.5)"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          />

        <TextInput
          placeholder="password"
          placeholderTextColor="rgba(64,64,64,0.5)"
          returnKeyType="go"
          secureTextEntry
          style={styles.input}
          ref={(input) => this.passwordInput = input}
          />

        <TextInput
          placeholder="password confirmation"
          placeholderTextColor="rgba(64,64,64,0.5)"
          returnKeyType="go"
          secureTextEntry
          style={styles.input}
          ref={(input) => this.passwordInput = input}
          />

        <TouchableOpacity
          onPress={this.signupButtonPressed.bind(this)}
          style={styles.signupButtonContainer}>
          <Text style={styles.signupButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: '#dfc7b2',
    marginBottom: 10,
    color: '#099499',
    paddingHorizontal: 10
  },
  signupButtonContainer: {
    backgroundColor: '#099499',
    paddingVertical: 15
  },
  signupButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700'
  },
  loginButtonText: {
    color: '#404040',
    textAlign: 'center'
  },
  loginButtonContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 15
  }
});
