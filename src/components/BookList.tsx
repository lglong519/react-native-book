import * as React from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	SectionList,
	TouchableOpacity
} from "react-native";
import { Moment } from "../lib";

const moment = new Moment("yyyy-MM-dd");

interface Props{
	title:string;
	books:any;
	type:string;// views,status,full
	navigation:any;
}
class BookList extends React.Component {
	constructor(props:Props) {
		super(props);
	}

	toSections(bid) {
		return this.props.navigation.navigate("Sections", { bid });
	}

	subTitle(item) {
		if (!this.props.type || this.props.type === "views") {
			return (
				<Text>
					<Text style={styles.colorOrg}>{item.views}</Text>人在看
				</Text>
			);
		}
		if (this.props.type === "status") {
			return (
				<Text>
					<Text style={styles.colorOrg}>{item.status}</Text>
				</Text>
			);
		}
		return (
			<Text>
				<Text style={styles.colorOrg}>{moment(item.updateDate)}完本</Text>
			</Text>
		);
	}

	render() {
		const overrideRenderBookItem = ({
			item,
			index,
			section: { title, data }
		}) => (
			<TouchableOpacity activeOpacity={0.5} key={index} style={styles.hotItem}
				onPress={() => this.toSections(item.id)}>
				<Image
					style={{ width: 35, height: 50 }}
					source={{ uri: item.cover }}
				/>
				<View style={styles.itemRight}>
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Text style={styles.colorEm}>{item.title}</Text>
						{this.subTitle(item)}
					</View>
					<Text>作者: {item.author}</Text>
					<Text numberOfLines={1} ellipsizeMode={"tail"}>
						{item.info}
					</Text>
				</View>
			</TouchableOpacity>
		);
		if (!this.props.books.length) {
			return null;
		}
		return (
			<SectionList
				style={styles.section}
				renderItem={({ item, index, section }) => (
					<Text key={index}>{item}</Text>
				)}
				renderSectionHeader={({ section: { title } }) => (
					<View style={styles.sectionHeader}>
						<Text style={styles.colorEm}>{title}</Text>
					</View>
				)}
				sections={[
					{
						title: this.props.title,
						data: this.props.books,
						renderItem: overrideRenderBookItem
					}
				]}
				keyExtractor={(item, index) => item.id + index}
			/>
		);
	}
}


// styles
const styles = StyleSheet.create({
	section: {
		margin: 5,
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
		borderColor: "#e2e2e2",
		backgroundColor: "#fff",
	},
	itemRight: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-around",
		paddingLeft: 8,
	},
	colorOrg: {
		color: "#ff8040"
	},
	colorEm: {
		color: "#333",
	},
});

export default BookList;