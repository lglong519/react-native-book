import * as React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	SectionList,
	TouchableOpacity,
	Alert,
} from "react-native";
import { Nav, Footer, Header } from "../../components";
import { getBookshelf, delBookshelf } from "../../libs/api";

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			books: [],
			recentData: []
		};
	}

	static navigationOptions = {
		title: "",
	};

	async getData() {
		try {
			this.loading = true;
			const bookshelf = await getBookshelf();
			await this.setState({ books: bookshelf.books });
		} catch (e) {
			if (e === 401) {
				return this.props.navigation.navigate("Signin");
			}
		}
	}

	toSections(bid) {
		return this.props.navigation.navigate("Sections", { bid });
	}

	toContents(sid) {
		if (!sid) {
			return;
		}
		this.props.navigation.navigate("Contents", { sid });
	}

	remove(item) {
		Alert.alert(
			"提示",
			`确定要删除 ${item.btitle}?`,
			[
				{ text: "取消" },
				{
					text: "确定",
					onPress: async () => {
						await delBookshelf(item.book);
						this.getData();
					}
				},
			],
		);
	}

	async componentDidMount() {
		this.getData();
	}

	render() {
		const overrideRenderHotItem = ({
			item,
			index,
			section: { title, data }
		}) => (
			<View key={index} style={styles.hotItem}>
				<TouchableOpacity onPress={() => this.toSections(item.book)}>
					<Text style={styles.lineHeight}>书名: {item.btitle}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => this.toContents(item.sid)}>
					<Text style={styles.lineHeight}>最新: {item.stitle}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => this.toContents(item.mid)}>
					<Text style={styles.lineHeight}>书签: {item.mtitle || "无"}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => this.remove(item)}>
					<Text style={[styles.colorRed, styles.lineHeight]}>删除本书</Text>
				</TouchableOpacity>
			</View>
		);
		return (
			<ScrollView style={styles.container}>
				<Header navigation={this.props.navigation} type={2} title={"我的书架"}/>
				<Nav navigation={this.props.navigation}/>
				<SectionList
					style={styles.section}
					renderItem={({ item, index, section }) => (
						<Text key={index}>{item}</Text>
					)}
					sections={[
						{
							title: "",
							data: this.state.books,
							renderItem: overrideRenderHotItem
						}
					]}
					keyExtractor={(item, index) => item.id + index}
				/>
				<Footer navigation={this.props.navigation}/>
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
		marginTop: 10,
		marginBottom: 10,
		paddingLeft: 12,
		paddingRight: 10,
		paddingBottom: 10,
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
		paddingTop: 8,
		paddingBottom: 8,
		borderBottomWidth: 0.8,
		borderColor: "#d3feda"
	},
	colorOrg: {
		color: "#ff8040"
	},
	colorEm: {
		color: "#333",
	},
	lineHeight: {
		marginTop: 2,
		marginBottom: 2,
	},
	colorRed: {
		color: "#e4393c"
	}
});


export default Index;
