import * as React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	SectionList,
	TouchableOpacity,
} from "react-native";
import {
	Nav, Footer, Header, BookList
} from "../components";
import { queryBooks } from "../libs/api";

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
		queryBooks({
			sort: `-${item.sort}`,
			p: 0
		}).then((res) => {
			this.setState({
				sortData: res.data._55
			});
		}).catch((error) => {
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
			<TouchableOpacity key={index}
				onPress={() => this.queryBooks(item)}
				style={[styles.sortItem, this.state.sort === item.name ? styles.activeBg : null]}>
				<Text
					style={[this.state.sort === item.name ? styles.activeClr : null]}>{item.name}</Text>
			</TouchableOpacity>
		);
		const overrideRenderRecBox = ({ item }) => (
			<View style={styles.sortBox}>
				{item.map((data, i) => renderRecSubCell(data, i))}
			</View>
		);
		return (
			<ScrollView style={styles.container}>
				<Header navigation={this.props.navigation} type={1} title={"总排行榜"}/>
				<Nav navigation={this.props.navigation}/>
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
				<BookList navigation={this.props.navigation} books={this.state.sortData} title={this.state.sort} type={"views"}/>
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
	sortBox: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingTop: 8,
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
		backgroundColor: "#D9D9D9",
	},
	activeClr: {
		color: "#1abc9c"
	}
});

export default Top;
