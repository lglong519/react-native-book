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
import { getBookshelf, delBookshelf, getFootsteps } from "../../libs/api";
import { Moment } from "../../libs";

const moment = new Moment("MM-dd hh:mm:ss");

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			books: [],
			recentData: [],
			footsteps: [],
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

	async getFootsteps() {
		let steps = await getFootsteps("section");
		await this.setState({ footsteps: steps });
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

	bookList() {
		const overrideRenderMarkItem = ({
			item,
			index,
			section: { title, data }
		}) => (
			<View key={index} style={styles.markItem}>
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
		if (this.state.books && this.state.books.length) {
			return <SectionList
				style={styles.section}
				renderItem={({ item, index, section }) => (
					<Text key={index}>{item}</Text>
				)}
				sections={[
					{
						title: "",
						data: this.state.books,
						renderItem: overrideRenderMarkItem
					}
				]}
				keyExtractor={(item, index) => item.id + index}
			/>;
		}
		return <View style={styles.empty}>
			<Text>还木有任何书籍( ˙﹏˙ )</Text>
		</View>;
	}

	recentSteps() {
		const overrideRenderRecentItem = ({
			item,
			index,
			section: { title, data }
		}) => (
			<View key={index} style={styles.hotItem}>
				<Text style={{ alignSelf: "flex-start" }}>{index + 1}.</Text>
				<View style={{ flex: 1 }}>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }} onPress={() => this.toContents(item.data.section)}>
							<Text style={styles.colorEm} numberOfLines={1}>
								{item.data.stitle}
							</Text>
						</TouchableOpacity>
						<Text style={styles.colorOrg}>
							{moment(item.updatedAt)}
						</Text>
					</View>
					<TouchableOpacity activeOpacity={0.5} onPress={() => this.toSections(item.data.book)}>
						<Text numberOfLines={1} ellipsizeMode={"tail"} style={{ marginTop: 8, fontSize: 12 }}>
							{item.data.btitle}
						</Text>
					</TouchableOpacity>

				</View>
			</View>
		);
		const renderSectionHeader = (info) => {
			const { title } = info.section;
			return (
				<View style={styles.sectionHeader}>
					<Text style={styles.colorEm}>{title}</Text>
				</View>
			);
		};
		if (!this.state.footsteps.length) {
			return null;
		}
		return <SectionList
			style={styles.section}
			renderItem={({ item, index, section }) => (
				<Text key={index}>{item}</Text>
			)}
			renderSectionHeader={renderSectionHeader}
			sections={[
				{
					title: "最近浏览",
					data: this.state.footsteps,
					renderItem: overrideRenderRecentItem
				}
			]}
			keyExtractor={(item, index) => item.id + index}
		/>;
	}

	async componentDidMount() {
		await this.getData();
		this.getFootsteps();
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<Header navigation={this.props.navigation} type={2} title={"我的书架"}/>
				<Nav navigation={this.props.navigation}/>
				{this.bookList()}
				{this.recentSteps()}
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
		height: 35,
		paddingLeft: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: "#ccc",
		backgroundColor: "#fff",
	},
	markItem: {
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
		flex: 1,
	},
	lineHeight: {
		marginTop: 2,
		marginBottom: 2,
	},
	colorRed: {
		color: "#e4393c"
	},
	empty: {
		alignItems: "center",
		paddingTop: 20,
		paddingBottom: 10,
	},
	hotItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 5,
		paddingRight: 5,
		paddingBottom: 10,
		paddingTop: 6,
		borderBottomWidth: 0.5,
		borderColor: "#e2e2e2",
		marginTop: 2,
		marginBottom: 2,
	},
});


export default Index;
