import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	Image,
	SectionList
} from "react-native";

const book = {
	_id: 13, id: 3714, title: "飞剑问道", author: "我吃西红柿", sort: "xiuzhen", cover: "https://m.biquke.com/files/article/image/3/3714/3714s.jpg", info: " 在这个世界，有狐仙、河神、水怪、大妖，也有求长生的修行者。 修行者们， 开法眼，可看妖魔鬼怪。 炼一口飞剑，可千里杀敌。 千里眼、顺风耳，更可探查四方。 …… 秦府二公子‘秦云’，便是一位修行者……", views: 59056269, sequence: 3, status: "连载中", uploadDate: "2019-01-20T11:36:12.000Z", updateDate: "2019-01-26T12:46:51.000Z", firstSection: "飞剑问道 新书预览", lastSection: "第十九篇 第十五章 赶紧走", dayvisit: 1, weekvisit: 1, monthvisit: 1, weekvote: 4, monthvote: 2, allvote: 1, goodnum: 0, size: 0, goodnew: 0, createdAt: "2019-01-20T11:36:12.000Z", updatedAt: "2019-01-20T11:36:12.000Z", sortn: "修真小说", fid: 2166271, lid: 10049872
};
class Sections extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			book,
			// book: {
			// 	title: "",
			// 	author: "",
			// 	info: " ",
			// 	status: "",
			// 	lastSection: "",
			// 	sortn: "",
			// 	updateDate: "",
			// 	cover: undefined,
			// },
			sections: [],
			newSections: []
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
		const hours = this.pad(new Date(time).getHours());
		const minutes = this.pad(new Date(time).getMinutes());
		const year = this.pad(new Date(time).getFullYear());
		return `${year}-${month}-${date} ${hours}:${minutes}`;
	};

	pad = value => (Number(value) < 10 ? `0${value}` : value);

	renderRecSubCell(item, index) {
		return (
			<View key={index} style={styles.recItem}>
				<Image
					style={{ width: 100, height: 130 }}
					source={{
						uri: item.cover
					}}
				/>
				<Text>{item.title}</Text>
			</View>
		);
	}

	fetchData() {
		if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.bid) {
			//
		} else {
			return;
		}
		const { bid } = this.props.navigation.state.params;
		fetch(`http://dev.mofunc.com/ws/books/${bid}`)
			.then(response => response.json())
			.then((result) => {
				this.setState({
					book: result
				});
			})
			.catch((error) => {
				console.error(error);
			});
		fetch(`http://dev.mofunc.com/ws/books/${bid}/sections?sort=-sequence&pageSize=5`)
			.then(response => response.json())
			.then((results) => {
				this.setState({
					newSections: results
				});
			})
			.catch((error) => {
				console.error(error);
			});
		fetch(`http://dev.mofunc.com/ws/books/${bid}/sections?pageSize=20`)
			.then(response => response.json())
			.then((results) => {
				this.setState({
					sections: results
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {
		const overrideRenderHotItem = ({
			item,
			index,
			section: { title, data }
		}) => (
			<View key={index} style={styles.hotItem}>
				<Text>{item.title}</Text>
			</View>
		);
		return (
			<ScrollView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.btns} onPress={() => this.props.navigation.goBack()}>
						返回
					</Text>
					<Text style={styles.headerTitle}>{this.state.book.title}&nbsp;目录(共{this.state.sections.length}章)</Text>
					<Text style={styles.btns} onPress={() => this.props.navigation.navigate("Index")}>
						首页
					</Text>
				</View>

				<View style={[styles.hotItem, { marginLeft: 15 }]}>
					<Image
						style={{ width: 100, height: 130 }}
						source={{ uri: this.state.book.cover }}
					/>
					<View style={styles.itemRight}>
						<Text style={styles.btitle}>{this.state.book.title}</Text>
						<Text>作者: {this.state.book.author}</Text>
						<Text>分类: {this.state.book.sortn}</Text>
						<Text>状态: {this.state.book.status}</Text>
						<Text>更新: {this.moment(this.state.book.updateDate)}</Text>
						<Text>最新: {this.state.book.lastSection}</Text>
					</View>
				</View>
				<SectionList
					style={styles.section}
					renderItem={({ item, index, section }) => (
						<Text style={styles.info} key={index}>{item}</Text>
					)}
					renderSectionHeader={this.renderSectionHeader}
					sections={[
						{
							title: `${this.state.book.title}小说简介`,
							data: [this.state.book.info],
						},
						{
							title: `${this.state.book.title}最新章节`,
							data: this.state.newSections,
							renderItem: overrideRenderHotItem
						},
						{
							title: "全部章节列表",
							data: this.state.sections,
							renderItem: overrideRenderHotItem
						}
					]}
					keyExtractor={(item, index) => index}
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
		paddingLeft: 15,
		paddingRight: 15
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
	headerTitle: {
		color: "#fff"
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
		borderBottomWidth: 0.8,
		borderBottomColor: "#1abc9c",
		backgroundColor: "#f4f4f4",
	},
	btitle: {
		fontSize: 20,
		color: "#333",
		marginBottom: 5,
	},
	info: {
		padding: 8,
		letterSpacing: 2,
		lineHeight: 25,
	},
	hotItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 8,
		paddingRight: 10,
		paddingBottom: 6,
		paddingTop: 6,
		borderBottomWidth: 0.5,
		borderColor: "#e2e2e2",
		marginTop: 2,
		marginBottom: 2,
	},
	itemRight: {
		flexDirection: "column",
		justifyContent: "space-around",
		paddingLeft: 15,
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


export default Sections;
