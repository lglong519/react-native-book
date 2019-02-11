import * as React from "react";

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity
} from "react-native";
import { navTo } from "../libs";

class Nav extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.nav}>
				<TouchableOpacity style={styles.nvaButton} onPress={() => navTo(this.props, "Index") }>
					<Text>首页</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.nvaButton} onPress={() => navTo(this.props, "Sort") }>
					<Text>分类</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.nvaButton} onPress={() => navTo(this.props, "Top") }>
					<Text>排行</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.nvaButton} onPress={() => navTo(this.props, "Full") }>
					<Text>完本</Text>
				</TouchableOpacity>
			</View>
		);
	}
}


// styles
const styles = StyleSheet.create({
	nav: {
		alignSelf: "stretch",
		display: "flex",
		justifyContent: "space-around",
		alignItems: "stretch",
		flexDirection: "row",
		height: 40,
		borderBottomWidth: 0.8,
		backgroundColor: "#eee",
		borderBottomColor: "#ccc",
	},
	nvaButton: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff"
	},
});


export default Nav;
