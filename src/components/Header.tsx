import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableHighlight,
	Alert,
	TextInput,
} from "react-native";

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchType: "title",
			searchValue: "",
			loading: false,
			searchVisible: false,
		};
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

	logout() {
		Alert.alert(
			"提示",
			"退出登录?",
			[
				{ text: "取消" },
				{
					text: "确定",
					onPress: async () => {
						await global.storage.remove({ key: "accessToken" });
						this.navTo("Index");
					}
				},
			],
		);
	}

	switchSearchType() {
		let searchType = "authortitle".replace(this.state.searchType, "");
		this.setState({
			searchType
		});
	}

	search() {
		this.props.search({
			searchType: this.state.searchType,
			searchValue: this.state.searchValue,
		});
	}

	toggleSearch() {
		let searchVisible = !this.state.searchVisible;
		this.setState({
			searchVisible
		});
		if (!searchVisible) {
			this.setState({
				searchValue: ""
			});
			this.props.search({
				searchType: this.state.searchType,
				searchValue: "",
			});
		}
	}

	render() {
		let headerStyle = [styles.header];
		if (this.props.bgType === "dark") {
			headerStyle.push({ backgroundColor: "#999" });
		}
		if (this.props.type === 0) {
			return (
				<View>
					<View style={styles.header}>
						<TouchableHighlight style={styles.touch} underlayColor={"#00A686"} onPress={() => this.navTo("Bookshelf")}>
							<Text style={styles.icon}>
								<Icon name={"bookmark"} size={22}/>
							</Text>
						</TouchableHighlight>
						<View style={styles.titleBox}>
							<Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
						</View>
						<TouchableHighlight style={styles.touch} underlayColor={"#00A686"} onPress={() => this.toggleSearch()}>
							<Text style={styles.icon}>
								<Icon name={"search"} size={22}/>
							</Text>
						</TouchableHighlight>
					</View>
					{this.state.searchVisible ? (
						<View style={styles.searchBox}>
							<TouchableOpacity
								onPress={() => this.switchSearchType()}
								style={styles.searchType}>
								<Text>
									{this.state.searchType === "author" ? "作者" : "书名"}
								</Text>
							</TouchableOpacity>
							<View style={styles.searchInputBox}>
								<TextInput
									ref="search"
									style={styles.searchInput}
									lineHeight={12}
									placeholder='输入搜索内容'
									underlineColorAndroid="transparent"
									onChangeText={searchValue => this.setState({ searchValue })}
								/>
							</View>
							<TouchableOpacity
								onPress={() => this.search()}
								style={styles.searchBtn}>
								<Icon name={"search"} size={22} color="#fff"/>
							</TouchableOpacity>
						</View>) : null}
				</View>
			);
		}
		if (this.props.type === 1) {
			return (
				<View style={headerStyle}>
					<TouchableHighlight style={styles.touch} underlayColor={"#00A686"} onPress={() => this.navTo("Index")}>
						<Text style={styles.icon}>
							<Icon name={"home"} size={22}/>
						</Text>
					</TouchableHighlight>
					<View style={styles.titleBox}>
						<Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
					</View>
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
					<View style={styles.titleBox}>
						<Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
					</View>
					<TouchableHighlight style={styles.touch} underlayColor={"#00A686"} onPress={() => this.logout()}>
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
				<View style={styles.titleBox}>
					<Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
				</View>
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
		paddingRight: 15,
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
	titleBox: {
		flex: 1,
		alignItems: "center",
	},
	title: {
		color: "#fff",
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
	searchBox: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		backgroundColor: "#fff",
		borderBottomWidth: 0.8,
		borderBottomColor: "#ccc",
	},
	searchInputBox: {
		height: 30,
		width: "50%",
		borderWidth: 0.8,
		borderColor: "#ccc",
		alignItems: "center",
		flexDirection: "row",
	},
	searchInput: {
		padding: 0,
		width: "100%",
		height: 30,
		paddingLeft: 5,
	},
	searchBtn: {
		height: 30,
		width: "15%",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1ce0b9",
	},
	searchType: {
		height: 30,
		width: "12%",
		borderWidth: 0.8,
		borderColor: "#ccc",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 5,
	},
});


export default Header;
