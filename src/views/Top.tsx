import * as React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	SectionList,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import {
	Nav, Footer, Header, BookList
} from "../components";
import { queryBooks } from "../libs/api";

const blocks = [
	{
		title: "日点击榜",
		sort: "dayvisit",
	},
	{
		title: "周点击榜",
		sort: "weekvisit",
	},
	{
		title: "月点击榜",
		sort: "monthvisit",
	},
	{
		title: "总点击榜",
		sort: "views",
	},
	{
		title: "周推荐榜",
		sort: "weekvote",
	},
	{
		title: "月推荐榜",
		sort: "monthvote",
	},
	{
		title: "总推荐榜",
		sort: "allvote",
	},
	{
		title: "总收藏榜",
		sort: "goodnum",
	},
	{
		title: "字数排行",
		sort: "size",
	},
	{
		title: "最新入库",
		sort: "uploadDate",
	},
	{
		title: "最近更新",
		sort: "updateDate",
	},
	{
		title: "新书榜单",
		sort: "goodnew",
	},
];

class Top extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sortData: [],
			title: "",
			sort: "",
			pages: 0,
			currentPage: 0,
			pageSize: 20,
			loading: false,
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

	async queryBooks(item) {
		await this.setState({
			title: item.title,
			sort: item.sort,
			loading: true,
		});
		queryBooks({
			sort: `-${item.sort}`,
			pageSize: this.state.pageSize,
			p: this.state.currentPage,
		}).then((res) => {
			this.setState({
				sortData: this.state.sortData.concat(res.data._55),
				pages: res.headers.get("x-total-pages"),
				loading: false,
			});
		}).catch((error) => {
			console.error(error);
			this.setState({ loading: false });
		});
	}

	async loadMore(e: Object) {
		if ((this.state.pages && this.state.currentPage >= this.state.pages - 1) || !this.state.title) {
			return;
		}
		let offsetY = e.nativeEvent.contentOffset.y; // 滑动距离
		let contentSizeHeight = e.nativeEvent.contentSize.height; // scrollView contentSize高度
		let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; // scrollView高度
		if (Math.abs(offsetY + oriageScrollHeight - contentSizeHeight) < 10) {
			await this.setState({ currentPage: this.state.currentPage + 1 });
			this.queryBooks({ title: this.state.title, sort: this.state.sort });
		}
	}

	showMore() {
		if (this.state.loading) {
			return (<View style={{
				paddingVertical: 30,
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "row",
			}}>
				<ActivityIndicator size="small" color="#1abc9c" />
				<Text>正在加载</Text>
			</View>);
		}
		if (!this.state.sortData.length) {
			return null;
		}
		let str = "加载更多";
		if (this.state.currentPage >= this.state.pages - 1) {
			str = "没有更多内容了";
		}
		return (<View style={{
			paddingVertical: 15,
			justifyContent: "center",
			alignItems: "center",
		}}>
			<Text>{str}</Text>
		</View>);
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
				onPress={async () => {
					await this.setState({
						sortData: [],
						title: "",
						sort: "",
						currentPage: 0,
					});
					this.queryBooks(item);
				}}
				style={[styles.sortItem, this.state.title === item.title ? styles.activeBg : null]}>
				<Text
					style={[this.state.title === item.title ? styles.activeClr : null]}>{item.title}</Text>
			</TouchableOpacity>
		);
		const overrideRenderRecBox = ({ item }) => (
			<View style={styles.sortBox}>
				{item.map((data, i) => renderRecSubCell(data, i))}
			</View>
		);
		return (
			<ScrollView
				ref="scrollView"
				onMomentumScrollEnd = {this.loadMore.bind(this)}
				style={styles.container}>
				<Header navigation={this.props.navigation} type={1} title={"总排行榜"}/>
				<Nav navigation={this.props.navigation}/>
				<SectionList style={{ margin: 5 }}
					renderItem={({ item, index, section }) => (
						<Text style={styles.sortItem} key={index}>{item.title}</Text>
					)}
					sections={[
						{
							title: this.state.title,
							data: [blocks],
							renderItem: overrideRenderRecBox
						}
					]}
					keyExtractor={(item, index) => index}
				/>
				<BookList navigation={this.props.navigation} books={this.state.sortData} title={this.state.title} type={"views"}/>
				{this.showMore()}
				<Footer
					scrollView={this.refs.scrollView}
					navigation={this.props.navigation}/>
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
