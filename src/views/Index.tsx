import * as React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	Image,
	SectionList,
	TouchableOpacity,
	ActivityIndicator,
	Dimensions,
} from "react-native";
import PageScrollView from "../components/PageScrollView";
import {
	Header, Nav, Footer, BookList
} from "../components";
import { Moment } from "../libs";
import { getBooks } from "../libs/api";

const { width: w, height: h } = Dimensions.get("window");

const moment = new Moment("MM-dd hh:mm:ss");

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			hotData: [],
			recentData: [],
			searchData: [],
			searchVisible: false,
		};
	}

	static navigationOptions = {
		title: "Index",
		gesturesEnabled: true,
	};

	renderSectionHeader = (info) => {
		const { title } = info.section;
		return (
			<View style={styles.sectionHeader}>
				<Text style={styles.colorEm}>{title}</Text>
			</View>
		);
	};

	toSections(bid) {
		return this.props.navigation.navigate("Sections", { bid });
	}

	renderRecSubCell(item, index) {
		return (
			<TouchableOpacity activeOpacity={0.5} key={index} style={styles.recItem}
				onPress={() => this.toSections(item.id)}>
				<Image
					style={{ width: 100, height: 130 }}
					source={{
						uri: item.cover
					}}
				/>
				<Text>{item.title}</Text>
			</TouchableOpacity>
		);
	}

	async fetchData() {
		await getBooks().then((results) => {
			this.setState({
				hotData: results
			});
		}).catch((error) => {
			console.error(error);
		});
		await getBooks({ sort: "-updateDate" }).then((results) => {
			this.setState({
				recentData: results
			});
		}).catch((error) => {
			console.error(error);
		});
		this.setState({
			loading: false
		});
	}

	recSection() {
		if (!this.state.hotData.length || this.state.searchVisible) {
			return null;
		}
		const overrideRenderRecBox = ({ item }) => (
			<View style={styles.recContent}>
				{item.map((data, i) => this.renderRecSubCell(data, i))}
			</View>
		);
		return <SectionList
			style={[styles.section, { marginBottom: 0 }]}
			renderItem={({ item, index, section }) => (
				<Text key={index}>{item}</Text>
			)}
			renderSectionHeader={this.renderSectionHeader}
			sections={[
				{
					title: "本站推荐",
					data: [],
					// renderItem: overrideRenderRecBox
				}
			]}
			keyExtractor={(item, index) => item.id + index}
		/>;
	}

	recentSection() {
		if (!this.state.recentData.length || this.state.searchVisible) {
			return null;
		}
		const overrideRenderRecentItem = ({
			item,
			index,
			section: { title, data }
		}) => (
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => this.toSections(item.id)}
				key={index} style={styles.hotItem}
			>
				<Text style={{ alignSelf: "flex-start" }}>{index + 1}.</Text>
				<View style={{ flex: 1 }}>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Text style={styles.colorEm} numberOfLines={1}>
							{item.title}
					&nbsp; - &nbsp;
							<Text>{item.author}</Text>
						</Text>
						<Text style={styles.colorOrg}>
							{moment(item.updateDate)}
						</Text>
					</View>
					<Text numberOfLines={1} ellipsizeMode={"tail"} style={{ marginTop: 8, fontSize: 12 }}>
						{item.info}
					</Text>
				</View>
			</TouchableOpacity>
		);
		return <SectionList
			style={styles.section}
			renderItem={({ item, index, section }) => (
				<Text key={index}>{item}</Text>
			)}
			renderSectionHeader={this.renderSectionHeader}
			sections={[
				{
					title: "最近更新",
					data: this.state.recentData,
					renderItem: overrideRenderRecentItem
				}
			]}
			keyExtractor={(item, index) => item.id + index}
		/>;
	}

	spinning() {
		if (!this.state.loading) {
			return null;
		}
		return <ActivityIndicator size="large" color="#1abc9c" />;
	}

	swiper() {
		if (this.state.searchVisible) {
			return null;
		}
		let imgs = this.state.hotData.slice(0, 3).map(item => ({
			uri: item.cover
		}));
		if (imgs.length) {
			return <PageScrollView
				ref={(ps) => { this.pageScrollView = ps; }}
				didMount={() => { this.pageScrollView.manualScrollToPage(1); }}
				style={{ width: w, height: w / 16 * 9, backgroundColor: "#fff" }}
				imageStyle={{ backgroundColor: "#fff" }}
				builtinStyle={{ backgroundColor: "#fff" }}
				goToNextPageSpeed={5}
				infiniteInterval={4000}
				builtinStyle="sizeChangeMode"
				builtinWH={{ width: 120, height: 150 }}
				imageArr={imgs}/>;
		}
		return null;
	}

	hot() {
		if (this.state.searchVisible) {
			return null;
		}
		return <BookList navigation={this.props.navigation} books={this.state.hotData} title={"热门推荐"} type={"views"}/>;
	}

	searchBooks() {
		if (!this.state.searchVisible) {
			return null;
		}
		if (!this.state.searchData.length) {
			return <View style={{
				paddingVertical: 30,
				justifyContent: "center",
				alignItems: "center",
			}}>
				<Text>没有更多内容了</Text>
			</View>;
		}
		return <BookList navigation={this.props.navigation} books={this.state.searchData} title={"搜索结果"} type={"views"}/>;
	}

	async search(data = {}) {
		if (data.searchValue) {
			await this.setState({
				loading: true
			});
			await getBooks({
				sort: "-updateDate",
				like: {
					[data.searchType]: data.searchValue,
				},
			}).then((results) => {
				this.setState({
					searchData: results
				});
			}).catch((error) => {
				console.error(error);
			});
			return this.setState({
				loading: false,
				searchVisible: true,
			});
		}
		this.setState({
			searchVisible: false,
		});
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {
		return (
			<View style={{ paddingBottom: 40 }}>
				<Header
					search={this.search.bind(this)}
					navigation={this.props.navigation}
					type={0}
					title={"MoFunc"}/>
				<ScrollView
					ref="scrollView"
					style={styles.container}>
					<Nav navigation={this.props.navigation}/>
					{this.spinning()}
					{this.searchBooks()}
					{this.recSection()}
					{this.swiper()}
					{this.hot()}
					{this.recentSection()}
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
		backgroundColor: "#F5F5F5",
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
		margin: 5,
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
	hotItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 8,
		paddingRight: 10,
		paddingBottom: 8,
		paddingTop: 8,
		borderBottomWidth: 0.5,
		borderColor: "#e2e2e2"
	},
	colorOrg: {
		color: "#ff8040",
		flex: 0,
		fontSize: 12,
	},
	colorEm: {
		color: "#333",
		flex: 1,
	},
});


export default Index;
