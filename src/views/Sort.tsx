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
	Header, Nav, Footer, BookList
} from "../components";

const blocks = [
	{
		name: "玄幻小说",
		sort: "xuanhuan",
	},
	{
		name: "修真小说",
		sort: "xiuzhen",
	},
	{
		name: "都市小说",
		sort: "dushi",
	},
	{
		name: "穿越小说",
		sort: "chuanyue",
	},
	{
		name: "网游小说",
		sort: "wangyou",
	},
	{
		name: "科幻小说",
		sort: "kehuan",
	},
];

class Sort extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			enthusiasmLevel: props.enthusiasmLevel || 1,
			sortData: [],
			sort: "",
		};
	}

	queryBooks(item) {
		this.setState({
			sort: item.name
		});
		fetch(`http://dev.mofunc.com/ws/books/?q={"sort":"${item.sort}"}&sort=-updateDate&p=0`)
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
				<Header navigation={this.props.navigation} type={1} title={"小说分类"}/>
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
				<BookList navigation={this.props.navigation} books={this.state.sortData} title={this.state.sort} type={"status"}/>
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


export default Sort;
