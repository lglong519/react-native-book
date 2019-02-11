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
	Header, Nav, Footer, BookList
} from "../components";
import { queryBooks } from "../libs";
/*
	切换类型要重置:currentPage.title,sort,sortData
*/
const blocks = [
	{
		title: "玄幻小说",
		sort: "xuanhuan",
	},
	{
		title: "修真小说",
		sort: "xiuzhen",
	},
	{
		title: "都市小说",
		sort: "dushi",
	},
	{
		title: "穿越小说",
		sort: "chuanyue",
	},
	{
		title: "网游小说",
		sort: "wangyou",
	},
	{
		title: "科幻小说",
		sort: "kehuan",
	},
];

class Sort extends React.Component {
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
		title: "Sort",
		gesturesEnabled: true,
	};

	async queryBooks(item) {
		await this.setState({
			sort: item.sort,
			title: item.title,
			loading: true,
		});
		queryBooks({
			q: `{"sort":"${item.sort}"}`,
			sort: "-updateDate",
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
			<View style={{ paddingBottom: 40 }}>
				<Header navigation={this.props.navigation} type={1} title={"小说分类"}/>
				<ScrollView
					ref="scrollView"
					onMomentumScrollEnd = {this.loadMore.bind(this)}
					style={styles.container}>
					<Nav navigation={this.props.navigation} route="Sort"/>
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
					<BookList navigation={this.props.navigation} books={this.state.sortData} title={this.state.title} type={"status"}/>
					{this.showMore()}
					<Footer
						scrollView={this.refs.scrollView}
						navigation={this.props.navigation}/>
				</ScrollView>
			</View>
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


export default Sort;
