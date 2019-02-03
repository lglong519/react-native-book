import * as React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	Image,
	SectionList,
	TouchableOpacity,
	ActivityIndicator
} from "react-native";
import {
	Header, Nav, Footer, BookList
} from "../components";
import { Moment } from "../libs";
import { getBooks } from "../libs/api";

const moment = new Moment("MM-dd hh:mm:ss");

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			hotData: [],
			recentData: []
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
		const overrideRenderRecBox = ({ item }) => (
			<View style={styles.recContent}>
				{item.map((data, i) => this.renderRecSubCell(data, i))}
			</View>
		);
		if (!this.state.hotData.length) {
			return null;
		}
		return <SectionList
			style={styles.section}
			renderItem={({ item, index, section }) => (
				<Text key={index}>{item}</Text>
			)}
			renderSectionHeader={this.renderSectionHeader}
			sections={[
				{
					title: "本站推荐",
					data: [this.state.hotData.slice(0, 3)],
					renderItem: overrideRenderRecBox
				}
			]}
			keyExtractor={(item, index) => item.id + index}
		/>;
	}

	recentSection() {
		const overrideRenderRecentItem = ({
			item,
			index,
			section: { title, data }
		}) => (
			<TouchableOpacity activeOpacity={0.5}
				onPress={() => this.toSections(item.id)}
				key={index} style={styles.hotItem}>
				<Text style={{ alignSelf: "flex-start" }}>{index + 1}.</Text>
				<View style={{ flex: 1 }}>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Text style={styles.colorEm}>
							{item.title}
					&nbsp; - &nbsp;
							<Text>{item.author}</Text>
						</Text>
						<Text style={styles.colorOrg}>
							{moment(item.updateDate)}
						</Text>
					</View>
					<Text numberOfLines={1} ellipsizeMode={"tail"} style={{ marginTop: 5 }}>
						{item.info}
					</Text>
				</View>
			</TouchableOpacity>
		);
		if (!this.state.recentData.length) {
			return null;
		}
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
		return <View>
			<ActivityIndicator size="large" color="#1abc9c" />
		</View>;
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<Header navigation={this.props.navigation} type={0} title={"MoFunc"}/>
				<Nav navigation={this.props.navigation}/>
				{this.spinning()}
				{this.recSection()}
				<BookList navigation={this.props.navigation} books={this.state.hotData} title={"热门推荐"} type={"views"}/>
				{this.recentSection()}
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
	colorOrg: {
		color: "#ff8040"
	},
	colorEm: {
		color: "#333",
	},
});


export default Index;
