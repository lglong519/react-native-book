import React from "react";
import { Platform } from "react-native";
import { StackNavigator } from "react-navigation";
import Index from "./components/Index";
import Sort from "./components/Sort";
import Top from "./components/Top";
import Full from "./components/Full";
import Bookshelf from "./components/Bookshelf";
import Sections from "./components/book/Sections";
import Contents from "./components/book/Contents";

const RouteConfigs = {
	Index: {
		screen: ({ navigation }) => <Index navigation={navigation}/>
	},
	Sort: {
		screen: ({ navigation }) => <Sort navigation={navigation}/>
	},
	Top: {
		screen: ({ navigation }) => <Top navigation={navigation}/>
	},
	Full: {
		screen: ({ navigation }) => <Full navigation={navigation}/>
	},
	Bookshelf: {
		screen: ({ navigation }) => <Bookshelf navigation={navigation}/>
	},
	Sections: {
		screen: ({ navigation }) => <Sections navigation={navigation}/>
	},
	Contents: {
		screen: ({ navigation }) => <Contents navigation={navigation}/>
	},
};

const StackNavigatorConfig = {
	headerMode: "none",
	mode: Platform.OS === "ios" ? "modal" : "card",
	initialRouteName: "Index",
};

const MainScreen = StackNavigator(RouteConfigs, StackNavigatorConfig);

export default MainScreen;
