import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableHighlight,
} from "react-native";

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	navTo(type) {
		return this.props.navigation.navigate(type);
	}

	render() {
		if (this.props.type === 0) {
			return (
				<View style={styles.header}>
					<TouchableHighlight style={styles.touch} underlayColor={"#00A686"} onPress={() => this.navTo("Bookshelf")}>
						<Text style={styles.icon}>
							<Icon name={"bookmark"} size={22}/>
						</Text>
					</TouchableHighlight>
					<Text style={styles.icon}>{this.props.title}</Text>
					<TouchableHighlight style={styles.touch} underlayColor={"#00A686"} onPress={() => this.navTo("Bookshelf")}>
						<Text style={styles.icon}>
							<Icon name={"search"} size={22}/>
						</Text>
					</TouchableHighlight>
				</View>
			);
		}
		if (this.props.type === 1) {
			return (
				<View style={styles.header}>
					<TouchableHighlight style={styles.touch} underlayColor={"#00A686"} onPress={() => this.navTo("Index")}>
						<Text style={styles.icon}>
							<Icon name={"home"} size={22}/>
						</Text>
					</TouchableHighlight>
					<Text style={styles.icon}>{this.props.title}</Text>
					<TouchableHighlight style={styles.touch} underlayColor={"#00A686"} onPress={() => this.navTo("Bookshelf")}>
						<Text style={styles.icon}>
							<Icon name={"bookmark"} size={22}/>
						</Text>
					</TouchableHighlight>
				</View>
			);
		}
		if (this.props.type === 2) {
			return (
				<View style={styles.header}>
					<TouchableHighlight style={styles.touch} underlayColor={"#00A686"} onPress={() => this.navTo("Index")}>
						<Text style={styles.icon}>
							<Icon name={"home"} size={22}/>
						</Text>
					</TouchableHighlight>
					<Text style={styles.icon}>{this.props.title}</Text>
					<TouchableHighlight style={styles.touch} underlayColor={"#00A686"} onPress={() => this.navTo("Index")}>
						<Text style={styles.icon}>
							注销
						</Text>
					</TouchableHighlight>
				</View>
			);
		}
		return (
			<View style={[styles.header, styles.btnHeader]}>
				<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
					<Text style={styles.btns}>
						返回
					</Text>
				</TouchableOpacity>
				<Text style={styles.icon}>{this.props.title}</Text>
				<TouchableOpacity onPress={() => this.navTo("Index")}>
					<Text style={styles.btns}>
						首页
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}


// styles
const styles = StyleSheet.create({
	header: {
		alignSelf: "stretch",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
		height: 40,
		backgroundColor: "#1abc9c",
		paddingLeft: 15,
		paddingRight: 15
	},
	touch: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 3,
		paddingBottom: 3,
		borderRadius: 2,
	},
	btnHeader: {
		paddingLeft: 15,
		paddingRight: 15
	},
	icon: {
		color: "#fff"
	},
	btns: {
		color: "#fff",
		backgroundColor: "#1ce0b9",
		paddingLeft: 7,
		paddingRight: 7,
		paddingTop: 2,
		paddingBottom: 2,
		borderRadius: 1.5,
	},
});


export default Header;
