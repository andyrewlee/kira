import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
  KeyboardAvoidingView
} from 'react-native';

import LoginForm from './LoginForm';
import DefaultForm from './DefaultForm';
import SignupForm from './SignupForm';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { form: 'default' };
  }

  handleLoginForm() {
    this.setState({ form: 'login' });
  }

  handleSignupForm() {
    this.setState({ form: 'signup' });
  }

  render() {
    let loginForm;

    if(this.state.form === 'login') {
      loginForm = <LoginForm
                    handleSignupForm={this.handleSignupForm.bind(this)}
                    handleDiary={this.props.handleDiary.bind(this)}
                  />;
    } else if(this.state.form === 'default') {
      loginForm = <DefaultForm
                    handleLoginForm={this.handleLoginForm.bind(this)}
                    handleSignupForm={this.handleSignupForm.bind(this)}
                  />;
    } else {
      loginForm = <SignupForm
                    handleLoginForm={this.handleLoginForm.bind(this)}
                    handleDiary={this.props.handleDiary.bind(this)}
                  />;
    }

    return(
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../../images/shiba.png')}
              />
          <Text style={styles.title}>anonymous diaries</Text>
          </View>
          <View style={styles.formContainer}>
            {loginForm}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d7baa1'
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center'
  },
  logo: {
    width: 100,
    height: 120
  },
  title: {
    color: '#404040',
    marginTop: 10,
    width: 160,
    fontSize: 18,
    textAlign: 'center'
  }
});
