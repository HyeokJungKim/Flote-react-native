import React, { Component } from 'react';
import { Container} from 'native-base'
import {Platform, StyleSheet,} from 'react-native';
import {StackNavigator} from 'react-navigation'
import Home from './Home'
import Login from './Login'
import NoteContainer from './NoteContainer'

const Screens = StackNavigator({
  Login : {screen: Login},
  NoteContainer : {screen: NoteContainer},
  Home :{screen: Home},
})

export default Screens
