import * as React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	Image,
	SectionList,
	TouchableOpacity,
} from "react-native";
import { Header, Footer } from "../../components";
import { Moment } from "../../lib";

const moment = new Moment("yyyy-MM-dd hh:mm");

class Sections extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			book: {
				title: "",
				author: "",
				info: " ",
				status: "",
				lastSection: "",
				sortn: "",
				updateDate: "",
				cover: undefined,
			},
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

	headerTitle() {
		return `${this.state.book.title} 目录(共${this.state.sections.length}章)`;
	}

	toContents(sid) {
		return this.props.navigation.navigate("Contents", { sid });
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
			<TouchableOpacity activeOpacity={0.5}
				onPress={() => this.toContents(item.id)}
				key={index} style={styles.hotItem}>
				<Text>{item.title}</Text>
			</TouchableOpacity>
		);
		return (
			<ScrollView style={styles.container}>
				<Header navigation={this.props.navigation} type={3}
					title={this.headerTitle()} />
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
						<Text>更新: {moment(this.state.book.updateDate)}</Text>
						<Text>最新: {this.state.book.lastSection}</Text>
					</View>
				</View>
				<View style={styles.buttonBox}>
					<TouchableOpacity activeOpacity={0.5}
						style={styles.button}
						onPress={() => this.toContents(this.state.book.fid)}>
						<Text style={{ color: "#fff" }}>开始阅读</Text>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={0.5}
						style={styles.button}>
						<Text style={{ color: "#fff" }}>加入书架</Text>
					</TouchableOpacity>
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
	buttonBox: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 8,
		marginBottom: 8,
	},
	button: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: 8,
		marginRight: 8,
		height: 35,
		backgroundColor: "#1abc9c",
		borderRadius: 5,
	}
});


export default Sections;
