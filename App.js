import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import "@expo/metro-runtime";

import { View, Text } from 'react-native'

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './redux/reducers'
import { thunk } from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyCGJZHxw8Jwe5x7m2I5OlYUGo_nsdxZaT0",
  authDomain: "cookstarter-dev.firebaseapp.com",
  projectId: "cookstarter-dev",
  storageBucket: "cookstarter-dev.appspot.com",
  messagingSenderId: "474139738703",
  appId: "1:474139738703:web:d34e9acb75079a05e9e03a",
  measurementId: "G-65DJ82593P"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return(
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Register" component={RegisterScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
      );
    }

    return(
      <Provider store={store}>
          <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Add" component={AddScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      
    )
  }
}

export default App