import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';

export default class LoginForm extends Component {
  loginButtonPressed() {
    this.props.handleLoginForm();
  }

  signupButtonPressed() {
    this.props.handleSignupForm();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.signupButtonPressed.bind(this)}
          style={[styles.buttonContainer, styles.lightButtonContainer]}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
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
  buttonContainer: {
    backgroundColor: '#00585b',
    marginVertical: 8,
    paddingVertical: 15
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700'
  },
  lightButtonContainer: {
    backgroundColor: '#099499'
  }
});
