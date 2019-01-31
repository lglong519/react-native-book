import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	Image,
	SectionList,
	FlatList,
} from "react-native";

const blocks = [
	{
		name: "日点击榜",
		sort: "dayvisit",
	},
	{
		name: "周点击榜",
		sort: "weekvisit",
	},
	{
		name: "月点击榜",
		sort: "monthvisit",
	},
	{
		name: "总点击榜",
		sort: "views",
	},
	{
		name: "周推荐榜",
		sort: "weekvote",
	},
	{
		name: "月推荐榜",
		sort: "monthvote",
	},
	{
		name: "总推荐榜",
		sort: "allvote",
	},
	{
		name: "总收藏榜",
		sort: "goodnum",
	},
	{
		name: "字数排行",
		sort: "size",
	},
	{
		name: "最新入库",
		sort: "uploadDate",
	},
	{
		name: "最近更新",
		sort: "updateDate",
	},
	{
		name: "新书榜单",
		sort: "goodnew",
	},
];

class Top extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			enthusiasmLevel: props.enthusiasmLevel || 1,
			sortData: [],
			sort: "",
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
		return `${month}-${date} ${hours}:${minutes}`;
	};

	pad = value => (Number(value) < 10 ? `0${value}` : value);

	queryBooks(item) {
		this.setState({
			sort: item.name
		});
		fetch(`http://dev.mofunc.com/ws/books/?sort=-${item.sort}&p=0`)
			.then(response => response.json())
			.then((results) => {
				this.setState({
					sortData: results
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
		// this.fetchData();
	}

	render() {
		const renderRecSubCell = (item, index) => (
			<View key={index} style={[styles.sortItem, this.state.sort === item.name ? styles.activeBg : null]}>
				<Text
					style={[this.state.sort === item.name ? styles.activeClr : null]}
					onPress={() => this.queryBooks(item)}>{item.name}</Text>
			</View>
		);
		const overrideRenderRecBox = ({ item }) => (
			<View style={styles.sortBox}>
				{item.map((data, i) => renderRecSubCell(data, i))}
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
							<Text style={styles.colorOrg}>{item.views}</Text>
					人在看
						</Text>
					</View>
					<Text>作者: {item.author}</Text>
					<Text numberOfLines={1} ellipsizeMode={"tail"}>
						{item.info}
					</Text>
				</View>
			</View>
		);
		const sortListView = this.state.sortData.length ? <SectionList
			style={styles.section}
			renderItem={({ item, index, section }) => (
				<Text key={index}>{item}</Text>
			)}
			renderSectionHeader={this.renderSectionHeader}
			sections={[
				{
					title: this.state.sort,
					data: this.state.sortData,
					renderItem: overrideRenderHotItem
				}
			]}
			keyExtractor={(item, index) => item.id + index}
		/> : null;
		return (
			<ScrollView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.btns} onPress={() => this.props.navigation.navigate("Index")}>
						<Icon name={"home"} size={22} style={{ color: "#fff" }}/>
					</Text>
					<Text style={styles.btns}>总排行榜</Text>
					<Text style={styles.btns} onPress={() => this.props.navigation.navigate("Index")}>
						<Icon name={"bookmark"} size={22} style={{ color: "#fff" }}/>
					</Text>
				</View>
				<View style={styles.nav}>
					<Text onPress={() => this.props.navigation.navigate("Index")}>首页</Text>
					<Text onPress={() => this.props.navigation.navigate("Sort")}>分类</Text>
					<Text>排行</Text>
					<Text onPress={() => this.props.navigation.navigate("Full")}>完本</Text>
				</View>
				<SectionList style={{ margin: 5 }}
					renderItem={({ item, index, section }) => (
						<Text style={styles.sortItem} key={index}>{item.name}</Text>
					)}
					sections={[
						{
							title: this.state.sort,
							data: [blocks],
							renderItem: overrideRenderRecBox
						}
					]}
					keyExtractor={(item, index) => index}
				/>
				{sortListView}
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
	},
	sortBox: {
		// display: "flex",
		// flexDirection: "row",
		// backgroundColor: "red",
		// justifyContent: "space-around",
		flexDirection: "row",
		justifyContent: "space-around",
		paddingTop: 8,
		paddingBottom: 8,
		flexWrap: "wrap",
	},
	sortItem: {
		flexBasis: "31%",
		backgroundColor: "#fff",
		alignItems: "center",
		paddingTop: 10,
		paddingBottom: 10,
		marginBottom: 10,
		borderRadius: 3,
	},
	recItem: {
		flex: 1,
	},
	activeBg: {
		backgroundColor: "#ccc",
	},
	activeClr: {
		color: "#e4393c"
	}
});


export default Top;
