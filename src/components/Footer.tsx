import * as React from "react";

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity
} from "react-native";

class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	async navTo(type) {
		if (type === "Bookshelf") {
			const accessToken = await global.storage.load({ key: "accessToken" });
			if (!accessToken) {
				return this.props.navigation.navigate("Signin");
			}
		}
		return this.props.navigation.navigate(type);
	}

	render() {
		return (
			<View style={styles.footer}>
				<TouchableOpacity onPress={() => this.navTo("Index")}>
					<Text style={styles.footerItem}>首页</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => this.navTo("Bookshelf")}>
					<Text style={styles.footerItem}>书架</Text>
				</TouchableOpacity>
			</View>
		);
	}
}


// styles
const styles = StyleSheet.create({
	footer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 15,
		marginBottom: 20,
	},
	footerItem: {
		marginRight: 10,
		marginLeft: 10,
	}
});


export default Footer;
