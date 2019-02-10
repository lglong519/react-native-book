import * as React from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	ToastAndroid,
	ActivityIndicator,
} from "react-native";
import {
	Nav, Footer, Header, BookList
} from "../components";
import { queryBooks } from "../libs/api";

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fullData: [],
			pages: 0,
			currentPage: 0,
			pageSize: 20,
			loading: true,
		};
	}

	async fetchData() {
		await this.setState({ loading: true });
		await queryBooks({
			q: "{\"status\":\"完本\"}",
			sort: "-updateDate",
			pageSize: this.state.pageSize,
			p: this.state.currentPage,
		}).then((res) => {
			this.setState({
				fullData: this.state.fullData.concat(res.data._55),
				pages: res.headers.get("x-total-pages"),
				loading: false,
			});
		}).catch((error) => {
			console.error(error);
			this.setState({ loading: false });
		});
	}

	async loadMore(e: Object) {
		if (this.state.pages && this.state.currentPage >= this.state.pages - 1) {
			return;
		}
		let offsetY = e.nativeEvent.contentOffset.y; // 滑动距离
		let contentSizeHeight = e.nativeEvent.contentSize.height; // scrollView contentSize高度
		let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; // scrollView高度
		if (Math.abs(offsetY + oriageScrollHeight - contentSizeHeight) < 10) {
			await this.setState({ currentPage: this.state.currentPage + 1 });
			this.fetchData();
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

	componentDidMount() {
		this.fetchData();
	}

	render() {
		return (
			<ScrollView
				ref="scrollView"
				onMomentumScrollEnd = {this.loadMore.bind(this)}
				style={styles.container}>
				<Header navigation={this.props.navigation} type={1} title={"完本小说"}/>
				<Nav navigation={this.props.navigation}/>
				<BookList navigation={this.props.navigation} books={this.state.fullData} title={"完本小说"} type={"full"}/>
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
});


export default Index;
