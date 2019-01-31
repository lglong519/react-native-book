import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import {
	ScrollView,
	Button,
	StyleSheet,
	Text,
	View,
	Image,
	SectionList
} from "react-native";

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			enthusiasmLevel: props.enthusiasmLevel || 1,
			hotData: [],
			recentData: []
		};
	}

	static navigationOptions = {
		title: "",
	};

	renderSectionHeader = (info) => {
		const { title } = info.section;
		return (
			<View style={styles.sectionHeader}>
				<Text style={styles.colorEm}>{title}</Text>
			</View>
		);
	};

	moment = (t) => {
		const time = new Date(t);
		const month = this.pad(time.getMonth() + 1);
		const date = this.pad(new Date(time).getDate());
		const year = this.pad(new Date(time).getFullYear());
		return `${year}-${month}-${date}`;
	};

	pad = value => (Number(value) < 10 ? `0${value}` : value);

	fetchData() {
		fetch("http://dev.mofunc.com/ws/books/?q={\"status\":\"完本\"}&sort=-updateDate&p=1")
			.then(response => response.json())
			.then((results) => {
				this.setState({
					hotData: results
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	toSections(bid) {
		return this.props.navigation.navigate("Sections", { bid });
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {
		const overrideRenderRecBox = ({ item }) => (
			<View style={styles.recContent}>
				{item.map((data, i) => this.renderRecSubCell(data, i))}
			</View>
		);
		const overrideRenderHotItem = ({
			item,
			index,
			section: { title, data }
		}) => (
			<View key={index} style={styles.hotItem}>
				<Image
					style={{ width: 35, height: 50 }}
					source={{ uri: item.cover }}
				/>
				<View style={styles.itemRight}>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}
					>
						<Text style={styles.colorEm} onPress={() => this.toSections(item.id)}>{item.title}</Text>
						<Text>
							<Text style={styles.colorOrg}>{this.moment(item.updateDate)}完本</Text>
						</Text>
					</View>
					<Text>作者: {item.author}</Text>
					<Text numberOfLines={1} ellipsizeMode={"tail"}>
						{item.info}
					</Text>
				</View>
			</View>
		);
		return (
			<ScrollView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.btns} onPress={() => this.props.navigation.navigate("Index")}>
						<Icon name={"home"} size={22} style={{ color: "#fff" }}/>
					</Text>
					<Text style={styles.btns}>完本小说</Text>
					<Text style={styles.btns} onPress={() => this.props.navigation.navigate("Bookshelf")}>
						<Icon name={"bookmark"} size={22} style={{ color: "#fff" }}/>
					</Text>
				</View>
				<View style={styles.nav}>
					<Text onPress={() => this.props.navigation.navigate("Index")}>首页</Text>
					<Text onPress={() => this.props.navigation.navigate("Sort")}>分类</Text>
					<Text onPress={() => this.props.navigation.navigate("Top")}>排行</Text>
					<Text>完本</Text>
				</View>

				<SectionList
					style={styles.section}
					renderItem={({ item, index, section }) => (
						<Text key={index}>{item}</Text>
					)}
					renderSectionHeader={this.renderSectionHeader}
					sections={[
						{
							title: "完本小说",
							data: this.state.hotData,
							renderItem: overrideRenderHotItem
						}
					]}
					keyExtractor={(item, index) => item.id + index}
				/>
				<View style={styles.footer}>
					<Text style={styles.footerItem} onPress={() => this.props.navigation.navigate("Index")}>首页</Text>
					<Text style={styles.footerItem} onPress={() => this.props.navigation.navigate("Bookshelf")}>书架</Text>
				</View>
			</ScrollView>
		);
	}
}


// styles
const styles = StyleSheet.create({
	container: {
		backgroundColor: "#F5F5F5"
	},
	header: {
		alignSelf: "stretch",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
		height: 40,
		backgroundColor: "#1abc9c",
		paddingLeft: 20,
		paddingRight: 20
	},
	btns: {
		color: "#fff"
	},
	nav: {
		alignSelf: "stretch",
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
		flexDirection: "row",
		height: 40,
		borderBottomWidth: 0.8,
		borderBottomColor: "#ccc",
		backgroundColor: "#fff"
	},
	recContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: 8,
		paddingBottom: 8
	},
	recItem: {
		flex: 1,
		alignItems: "center"
	},
	section: {
		margin: 5,
		backgroundColor: "#fff"
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		height: 30,
		paddingLeft: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: "#ccc",
		backgroundColor: "#fff",
	},
	hotItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 8,
		paddingRight: 10,
		paddingBottom: 5,
		paddingTop: 5,
		borderBottomWidth: 0.5,
		borderColor: "#e2e2e2"
	},
	itemRight: {
		flexDirection: "column",
		justifyContent: "space-around",
		paddingLeft: 8,
		paddingRight: 35
	},
	colorOrg: {
		color: "#ff8040"
	},
	colorEm: {
		color: "#333",
	},
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


export default Index;
