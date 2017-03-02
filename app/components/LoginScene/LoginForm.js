import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default class LoginForm extends Component {
  loginButtonPressed() {
    this.props.handleDiary();
  }

  signupButtonPressed() {
    this.props.handleSignupForm();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.signupButtonPressed.bind(this)}
          style={styles.signupButtonContainer}>
          <Text style={styles.signupButtonText}>don't have an account?</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="username or email"
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
        <TouchableOpacity
          onPress={this.loginButtonPressed.bind(this)}
          style={styles.buttonContainer}>
          <Text style={styles.buttonText}>LOGIN</Text>
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
    color: '#00585b',
    paddingHorizontal: 10
  },
  buttonContainer: {
    backgroundColor: '#00585b',
    paddingVertical: 15
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700'
  },
  signupButtonText: {
    color: '#404040',
    textAlign: 'center'
  },
  signupButtonContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 15
  }
});
