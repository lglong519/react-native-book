import * as React from "react";
import { Platform, StyleSheet, Text, View, ScrollView } from "react-native";
import Index from "../../components/Index";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FCFF"
  }
});

const instructions = Platform.select({
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu",
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu"
});

const App = () => (
  <ScrollView style={styles.container}>
    <Index/>
  </ScrollView>
);

export default App;
