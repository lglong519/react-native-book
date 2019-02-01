import * as React from "react";

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity
} from "react-native";

class Nav extends React.Component {
	constructor(props) {
		super(props);
	}

	navTo(type) {
		return this.props.navigation.navigate(type);
	}

	render() {
		return (
			<View style={styles.nav}>
				<TouchableOpacity style={styles.nvaButton} onPress={() => this.navTo("Index") }>
					<Text>首页</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.nvaButton} onPress={() => this.navTo("Sort") }>
					<Text>分类</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.nvaButton} onPress={() => this.navTo("Top") }>
					<Text>排行</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.nvaButton} onPress={() => this.navTo("Full") }>
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
