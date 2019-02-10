import React from "react";
import { Platform } from "react-native";
import { StackNavigator } from "react-navigation";
import CardStackStyleInterpolator from "react-navigation/src/views/CardStack/CardStackStyleInterpolator";
import Index from "./views/Index";
import Sort from "./views/Sort";
import Top from "./views/Top";
import Full from "./views/Full";
import Sections from "./views/book/Sections";
import Contents from "./views/book/Contents";
import Bookshelf from "./views/user/Bookshelf";
import Signin from "./views/user/Signin";
import Signup from "./views/user/Signup";


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
	Signin: {
		screen: ({ navigation }) => <Signin navigation={navigation}/>
	},
	Signup: {
		screen: ({ navigation }) => <Signup navigation={navigation}/>
	},
};

const StackNavigatorConfig = {
	headerMode: "none",
	mode: Platform.OS === "ios" ? "modal" : "card",
	initialRouteName: "Full",
	transitionConfig: () => ({
		screenInterpolator: CardStackStyleInterpolator.forHorizontal,
	})
};

const MainScreen = StackNavigator(RouteConfigs, StackNavigatorConfig);

export default MainScreen;
