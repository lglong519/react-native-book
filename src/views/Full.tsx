import * as React from "react";
import {
	ScrollView,
	StyleSheet,
} from "react-native";
import {
	Nav, Footer, Header, BookList
} from "../components";


class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fullData: [],
		};
	}

	fetchData() {
		fetch("http://dev.mofunc.com/ws/books/?q={\"status\":\"完本\"}&sort=-updateDate&p=1")
			.then(response => response.json())
			.then((results) => {
				this.setState({
					fullData: results
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<Header navigation={this.props.navigation} type={1} title={"完本小说"}/>
				<Nav navigation={this.props.navigation}/>
				<BookList navigation={this.props.navigation} books={this.state.fullData} title={"完本小说"} type={"full"}/>
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
});


export default Index;
