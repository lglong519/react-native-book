import * as React from "react";
import { Platform, StyleSheet, Text, View, ScrollView } from "react-native";
import Index from "../../components/Index";
import {
	StackNavigator,
  } from 'react-navigation';
  
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5"
  }
});

const instructions = Platform.select({
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu",
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu"
});
// const AppNavigator = StackNavigator({
// 	Index: {screen: Index},
//   },
//   {
// 	  initialRouteName: 'Index',
//   });
//   export default () => <AppNavigator />

const App = () => (
  <ScrollView style={styles.container}>
    <Index/>
  </ScrollView>
);

export default App;
