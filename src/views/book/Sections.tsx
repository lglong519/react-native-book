import * as React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	Image,
	SectionList,
	TouchableOpacity,
	Alert,
	Picker,
	ActivityIndicator,
	Dimensions,
	ToastAndroid,
} from "react-native";
import { Header, Footer } from "../../components";
import {
	addToBookshelf, footsteps, querySections, getBook,
	Moment,
	toContents,
	navTo,
} from "../../libs";

const moment = new Moment("yyyy-MM-dd hh:mm");
const { width, height } = Dimensions.get("window");

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
			newSections: [],
			count: 0,
			pages: 0,
			currentPage: 0,
			pageSize: 20,
			selectedIndex: 0,
			loading: true,
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
		getBook(bid)
			.then((result) => {
				this.setState({
					book: result
				});
				return footsteps("book", {
					id: result.id,
					author: result.author,
					title: result.title,
				});
			});
		querySections(bid, {
			sort: "-sequence",
			pageSize: 5
		}).then((result) => {
			this.setState({
				newSections: result.data._55
			});
		});
	}

	async querySections() {
		if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.bid) {
			//
		} else {
			return;
		}
		const { bid } = this.props.navigation.state.params;
		await this.setState({
			sections: [],
			loading: true,
		});
		querySections(bid, {
			pageSize: 20,
			p: this.state.currentPage
		}).then((result) => {
			this.setState({
				sections: result.data._55,
				count: result.headers.get("x-total-count"),
				pages: result.headers.get("x-total-pages"),
				loading: false,
			});
		});
	}

	pagination() {
		let items = null;
		let { pageSize } = this.state;
		if (this.state.pages && !this.state.loading) {
			items = Array.from({ length: this.state.pages }).map((e, i) => <Picker.Item key={i} label={`第${i + 1}页  第${i * pageSize + 1} - ${(i + 1) * pageSize}章`} value={i} />);
		} else {
			return null;
		}
		return <View style={styles.buttonBox}>
			<TouchableOpacity activeOpacity={0.5}
				style={[styles.button, styles.pageBtn, this.state.currentPage ? null : styles.diabled]}
				onPress={() => this.prev()}>
				<Text style={{ color: "#fff" }}>上一页</Text>
			</TouchableOpacity>
			<Picker
				selectedValue={this.state.currentPage}
				style={{ height: 50, flex: 1 }}
				onValueChange={async (itemValue, itemIndex) => {
					await this.setState({ currentPage: itemIndex });
					this.querySections();
				}}>
				{items}
			</Picker>
			<TouchableOpacity activeOpacity={0.5}
				onPress={() => this.next()}
				style={[
					styles.button,
					styles.pageBtn,
					this.state.currentPage < this.state.pages - 1 ? null : styles.diabled]}>
				<Text style={{ color: "#fff" }}>下一页</Text>
			</TouchableOpacity>
		</View>;
	}

	async next() {
		if (this.state.currentPage >= this.state.pages - 1) {
			return;
		}
		await this.setState({ currentPage: this.state.currentPage + 1 });
		this.querySections();
	}

	async prev() {
		if (this.state.currentPage <= 0) {
			return;
		}
		await this.setState({ currentPage: this.state.currentPage - 1 });
		this.querySections();
	}

	async addToBookshelf() {
		try {
			await addToBookshelf(this.state.book.id);
			await ToastAndroid.showWithGravity("加入书架成功！", ToastAndroid.SHORT, ToastAndroid.CENTER);
		} catch (e) {
			if (e === 401) {
				Alert.alert(
					"未登录",
					"前往登录?",
					[
						{ text: "取消" },
						{
							text: "确定",
							onPress: async () => navTo(this.props, "Signin")
						},
					],
				);
			}
		}
	}

	headerTitle() {
		return `${this.state.book.title} 目录(共${this.state.count}章)`;
	}

	async componentDidMount() {
		await this.fetchData();
		this.querySections();
		this.setState({
			loading: false,
		});
	}

	cover() {
		if (this.state.book.title) {
			return <View style={[styles.hotItem, { marginLeft: 15 }]}>
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
			</View>;
		}
		return null;
	}

	spinning() {
		if (!this.state.loading) {
			return null;
		}
		return <View style={{
			zIndex: 100,
			position: "absolute",
			backgroundColor: "rgba(0,0,0,0.3)",
			top: 0,
			left: 0,
			width,
			height,
			alignItems: "center",
			justifyContent: "center",
		}}>
			<ActivityIndicator size="large" color="#1abc9c" />
		</View>;
	}

	render() {
		const overrideRenderHotItem = ({
			item,
			index,
			section: { title, data }
		}) => (
			<TouchableOpacity activeOpacity={0.5}
				onPress={() => toContents(this.props, item.id)}
				key={index} style={styles.hotItem}>
				<Text>{item.title}</Text>
			</TouchableOpacity>
		);
		return (
			<View style={{ paddingBottom: 40 }}>
				{this.spinning()}
				<Header navigation={this.props.navigation} type={3}
					title={this.headerTitle()} />
				<ScrollView
					ref="scrollView"
					style={styles.container}>
					{this.cover()}
					<View style={styles.buttonBox}>
						<TouchableOpacity activeOpacity={0.5}
							style={styles.button}
							onPress={() => toContents(this.props, this.state.book.fid)}>
							<Text style={{ color: "#fff" }}>开始阅读</Text>
						</TouchableOpacity>
						<TouchableOpacity activeOpacity={0.5}
							onPress={() => this.addToBookshelf()}
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
							...this.state.currentPage ? [] : [
								{
									title: "小说简介",
									data: [this.state.book.info],
								},
								{
									title: "最新章节",
									data: this.state.newSections,
									renderItem: overrideRenderHotItem
								},
							],
							{
								title: "全部章节列表",
								data: this.state.sections,
								renderItem: overrideRenderHotItem
							}
						]}
						keyExtractor={(item, index) => index}
					/>
					{this.pagination()}
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
		fontSize: 18,
		color: "#333",
		marginBottom: 5,
		flexWrap: "wrap",
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
		paddingBottom: 10,
		paddingTop: 6,
		borderBottomWidth: 0.5,
		borderColor: "#e2e2e2",
		marginTop: 2,
		marginBottom: 2,
	},
	itemRight: {
		flex: 1,
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
		alignItems: "center",
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
	},
	pageBtn: {
		flex: 0,
		paddingLeft: 8,
		paddingRight: 8,
	},
	diabled: {
		opacity: 0.5
	}
});


export default Sections;
