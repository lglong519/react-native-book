import * as React from "react";

import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	Dimensions,
	ToastAndroid,
	PanResponder,
} from "react-native";
import { Header, Footer } from "../../components";
import { bookmark, footsteps, getContents } from "../../libs/api";

const { width, height } = Dimensions.get("window");
class Contents extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			pageY: 0,
		};
	}

	async bookmark() {
		try {
			await bookmark(this.state.data.book, this.state.data.id);
			await ToastAndroid.showWithGravity("加入书签成功！", ToastAndroid.SHORT, ToastAndroid.CENTER);
		} catch (e) {
			if (e === 401) {
				Alert.alert(
					"未登录",
					"前往登录?",
					[
						{ text: "取消" },
						{
							text: "确定",
							onPress: async () => this.props.navigation.navigate("Signin")
						},
					],
				);
			}
		}
	}

	fetchData() {
		if (this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.sid) {
			//
		} else {
			return;
		}
		const { sid } = this.props.navigation.state.params;
		getContents(sid).then((result) => {
			this.setState({
				data: result
			});
			return footsteps("section", {
				section: result.id,
				book: result.book,
				btitle: result.btitle,
				stitle: result.title,
			});
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
				style={[styles.button, this.state.data.prev ? null : styles.diabled]}>
				<Text style={{ color: "#fff" }}>上一章</Text>
			</TouchableOpacity>
			<TouchableOpacity activeOpacity={0.5}
				onPress={() => this.toContents(this.state.data.next)}
				style={[styles.button, this.state.data.next ? null : styles.diabled]}>
				<Text style={{ color: "#fff" }}>下一章</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => this.bookmark()}
				activeOpacity={0.5}
				style={styles.button}>
				<Text style={{ color: "#fff" }}>加书签</Text>
			</TouchableOpacity>
		</View>;
	}

	componentDidMount() {
		this.fetchData();
	}

	componentWillMount() {
		this._panResponder = PanResponder.create({
			// 要求成为响应者：
			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				// 上一页
				if (gestureState.dx < 10 && gestureState.dy < 10 && gestureState.y0 < height / 2) {
					this.refs.myScrollView.scrollTo({ x: 0, y: this.state.pageY - height + 35, animated: true });
				}
				// 下一页
				if (gestureState.dx < 10 && gestureState.dy < 10 && gestureState.y0 > height / 2) {
					this.refs.myScrollView.scrollTo({ x: 0, y: this.state.pageY + height - 35, animated: true });
				}
			},
			onShouldBlockNativeResponder: (evt, gestureState) => false
			// 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
			// 默认返回true。目前暂时只支持android。
			,
		});
	}

	render() {
		if (!this.state.data) {
			return null;
		}
		return <ScrollView
			style={styles.container}
			ref="myScrollView"
			onScroll = {(event) => {
				{
					this.setState({
						pageY: event.nativeEvent.contentOffset.y
					});
				}
			}}
			scrollEventThrottle = {200}
		>
			<Header navigation={this.props.navigation} type={1}
				ref={(view) => { this.header = view; }}
				onLayout={(event) => {
					this.layoutY = event.nativeEvent.layout.y;
				}}
				title={this.state.data.title} />
			{this.btnGroups()}
			{this.spinning()}

			<View
				style={styles.contents}
				{...this._panResponder.panHandlers}
			>
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
	},
	diabled: {
		opacity: 0.5
	}
});


export default Contents;
