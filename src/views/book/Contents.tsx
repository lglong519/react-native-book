import * as React from "react";

import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { Header, Footer } from "../../components";

class Contents extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {}
		};
	}

	fetchData() {
		if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.sid) {
			//
		} else {
			return;
		}
		const { sid } = this.props.navigation.state.params;
		// const sid = 3138457;
		fetch(`http://dev.mofunc.com/ws/books/sections/${sid}/contents`)
			.then(response => response.json())
			.then((result) => {
				this.setState({
					data: result
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	contents() {
		if (this.state.data && this.state.data.contents) {
			return this.state.data.contents.replace(/(<br>)+/g, "\n");
		}
		return "";
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

	spinning() {
		if (!this.state.data.id) {
			return <View>
				<ActivityIndicator size="large" color="#1abc9c" />
			</View>;
		}
		return null;
	}

	btnGroups() {
		if (!this.state.data.id) {
			return null;
		}
		return <View style={styles.buttonBox}>
			<TouchableOpacity activeOpacity={0.5}
				style={styles.button}
				onPress={() => this.toSections(this.state.data.book)}>
				<Text style={{ color: "#fff" }}>目录</Text>
			</TouchableOpacity>
			<TouchableOpacity activeOpacity={0.5}
				onPress={() => this.toContents(this.state.data.prev)}
				style={styles.button}>
				<Text style={{ color: "#fff" }}>上一章</Text>
			</TouchableOpacity>
			<TouchableOpacity activeOpacity={0.5}
				onPress={() => this.toContents(this.state.data.next)}
				style={styles.button}>
				<Text style={{ color: "#fff" }}>下一章</Text>
			</TouchableOpacity>
			<TouchableOpacity activeOpacity={0.5}
				style={styles.button}>
				<Text style={{ color: "#fff" }}>加书签</Text>
			</TouchableOpacity>
		</View>;
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {
		if (!this.state.data) {
			return null;
		}
		return <ScrollView style={styles.container}>
			<Header navigation={this.props.navigation} type={1}
				title={this.state.data.title} />
			{this.btnGroups()}
			{this.spinning()}
			<View style={styles.contents}>
				<Text>{this.contents()}</Text>
			</View>
			{this.btnGroups()}
			<Footer navigation={this.props.navigation}/>
		</ScrollView>;
	}
}


// styles
const styles = StyleSheet.create({
	container: {
		backgroundColor: "#e7f4fe"
	},
	contents: {
		padding: 10
	},
	buttonBox: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 8,
		marginBottom: 8,
	},
	button: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: 4,
		marginRight: 4,
		height: 32,
		backgroundColor: "#1abc9c",
		borderRadius: 2,
	}
});


export default Contents;
