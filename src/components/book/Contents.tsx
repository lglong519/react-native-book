import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import {
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

class Contents extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		};
	}

	static navigationOptions = {
		title: "",
	};
}


export default Contents;
