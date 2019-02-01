import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	SectionList,
	TouchableOpacity,
} from "react-native";
import { Nav, Footer, Header } from "../components";


const bookshelf = {
	id: 1,
	user: "5b92910c2a533525de87e42a",
	createdAt: "2019-01-20T16:30:19.000Z",
	updatedAt: "2019-01-20T16:30:19.000Z",
	books: [{
		id: 1, book: 3714, mark: 10049872, bookshelf: 1, createdAt: "2019-01-20T16:30:29.000Z", updatedAt: "2019-01-29T14:13:00.000Z", bid: 3714, btitle: "飞剑问道", mid: 10049872, mtitle: "第十九篇 第十五章 赶紧走", mbook: 3714, sid: 10049872, stitle: "第十九篇 第十五章 赶紧走", sbook: 3714
	}, {
		id: 2, book: 34900, mark: 10064539, bookshelf: 1, createdAt: "2019-01-20T19:00:05.000Z", updatedAt: "2019-01-29T08:57:38.000Z", bid: 34900, btitle: "圣墟", mid: 10064539, mtitle: "1361章 吾为天帝", mbook: 34900, sid: 10064539, stitle: "1361章 吾为天帝", sbook: 34900
	}, {
		id: 9, book: 22572, mark: 8473047, bookshelf: 1, createdAt: "2019-01-26T21:17:22.000Z", updatedAt: "2019-01-27T11:46:16.000Z", bid: 22572, btitle: "五行天", mid: 8473047, mtitle: "大结局", mbook: 22572, sid: 8473047, stitle: "大结局", sbook: 22572
	}, {
		id: 8, book: 36242, mark: 27887801, bookshelf: 1, createdAt: "2019-01-26T16:05:21.000Z", updatedAt: "2019-01-26T19:16:47.000Z", bid: 36242, btitle: "重生之都市仙尊", mid: 27887801, mtitle: "869、第872章欧洲年轻第一", mbook: 36242, sid: 27887801, stitle: "869、第872章欧洲年轻第一", sbook: 36242
	}, {
		id: 7, book: 606, mark: 36550, bookshelf: 1, createdAt: "2019-01-24T12:53:05.000Z", updatedAt: "2019-01-24T13:21:45.000Z", bid: 606, btitle: "完美世界", mid: 36550, mtitle: "第四百零七章 强势到底", mbook: 606, sid: 38084, stitle: "第一千八百三十六章 对决第一至尊", sbook: 606
	}]
};


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

	toContents(sid) {
		if (!sid) {
			return;
		}
		this.props.navigation.navigate("Contents", { sid });
	}

	componentDidMount() {
		// this.fetchData();
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
					<Text style={styles.lineHeight}>书签: {item.mtitle}</Text>
				</TouchableOpacity>
				<TouchableOpacity>
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
							data: bookshelf.books,
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
