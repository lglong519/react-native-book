import * as React from "react";

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity
} from "react-native";
import { navTo } from "../libs";

class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	toTop() {
		if (this.props.scrollView) {
			let footerItemStyle = [styles.footerItem];
			if (this.props.bgType === "dark") {
				footerItemStyle.push({ color: "#BCBCBF" });
			}
			return <TouchableOpacity onPress={() => this.props.scrollView.scrollTo({ x: 0, y: 0, animated: true })}>
				<Text style={footerItemStyle}>返回顶部</Text>
			</TouchableOpacity>;
		}
	}

	render() {
		let footerItemStyle = [styles.footerItem];
		if (this.props.bgType === "dark") {
			footerItemStyle.push({ color: "#BCBCBF" });
		}
		return (
			<View style={styles.footer}>
				<TouchableOpacity onPress={() => navTo(this.props, "Index")}>
					<Text style={footerItemStyle}>首页</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navTo(this.props, "Bookshelf")}>
					<Text style={footerItemStyle}>书架</Text>
				</TouchableOpacity>
				{this.toTop()}
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
