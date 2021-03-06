/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Button, Item, Input, Icon } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createStackNavigator, createAppContainer,  createDrawerNavigator, createSwitchNavigator ,createBottomTabNavigator } from "react-navigation";
import Login from './app/components/Login';
import SignUpPage from './app/components/SignUp';
import NearMeList from './app/components/NearMeList';
import NearMeMap from './app/components/NearMeMap';
import RoutePlanning from './app/components/RoutePlanning';
import SideBar from './app/components/SideBar';




const Mdn = createDrawerNavigator({
  rout:{screen:RoutePlanning},
  nearmelist: {screen:NearMeList},
  nearmeMap: {screen:NearMeMap},

},
{
  contentComponent: SideBar,
  contentOptions:{
    activeTintColor:"red",
  }
})


const TabNavigator = createBottomTabNavigator({
  login: { screen: Login },
  signup: { screen: SignUpPage },
});

const switchNav = createSwitchNavigator({
  login: { screen: Login },
  signup: { screen: SignUpPage },
});

const AppNavigator = createStackNavigator({

  main:switchNav,
  profile: Mdn,
},
{
  defaultNavigationOptions: ({navigation}) => {
    return {
      headerLeft:(
        <FontAwesome5 name={"bars"} brand style={{paddingLeft:15 , fontSize: 30, color:'black'}} onPress={() => navigation.toggleDrawer()}/>
      )
    };
  }
});

export default createAppContainer(AppNavigator);