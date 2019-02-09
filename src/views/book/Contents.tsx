import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

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
			bgType: "cyan",
			fontSize: 16,
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
			return this.state.data.contents.replace(/(<br>)+/g, "\n")
				.replace(/笔趣阁|(Ｗ|ｗ|W|w)\s*(Ｗ|ｗ|W|w)\s*(Ｗ|ｗ|W|w)(。|\.|．)*\s*(Ｂ|ｂ|b)\s*(ｉ|i|i)\s*(ｑ|q|q)\s*(ｕ|u|u)\s*(ｋ|k|k)\s*(ｅ|e|e)(。|\.|．)*\s*(Ｃ|ｃ|c)\s*(Ｏ|o|o)\s*(Ｍ|ｍ|m|m)/ig, "")
				.replace(/(\n){3}/g, "\n");
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
		let bgType;
		if (this.state.bgType === "dark") {
			bgType = { backgroundColor: "#999" };
		}
		return <View style={styles.buttonBox}>
			<TouchableOpacity activeOpacity={0.5}
				style={[styles.button, bgType]}
				onPress={() => this.toSections(this.state.data.book)}>
				<Text style={{ color: "#fff" }}>目录</Text>
			</TouchableOpacity>
			<TouchableOpacity activeOpacity={0.5}
				onPress={() => this.toContents(this.state.data.prev)}
				style={[styles.button, bgType, this.state.data.prev ? null : styles.diabled]}>
				<Text style={{ color: "#fff" }}>上一章</Text>
			</TouchableOpacity>
			<TouchableOpacity activeOpacity={0.5}
				onPress={() => this.toContents(this.state.data.next)}
				style={[styles.button, bgType, this.state.data.next ? null : styles.diabled]}>
				<Text style={{ color: "#fff" }}>下一章</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => this.bookmark()}
				activeOpacity={0.5}
				style={[styles.button, bgType]}>
				<Text style={{ color: "#fff" }}>加书签</Text>
			</TouchableOpacity>
		</View>;
	}

	setBg(type) {
		if (type === this.state.bgType) {
			return;
		}
		this.setState({
			bgType: type
		});
		global.storage.save({
			key: "bgType",
			data: type,
		});
	}

	readingSettings() {
		return <View style={styles.settingBox}>
			<View style={styles.settingCell}>
				<TouchableOpacity
					onPress={() => this.setBg("white")}
					activeOpacity={0.5}
					style={[styles.settingBtn, styles.white]}>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => this.setBg("yellow")}
					activeOpacity={0.5}
					style={[styles.settingBtn, styles.yellow]}>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => this.setBg("cyan")}
					activeOpacity={0.5}
					style={[styles.settingBtn, styles.cyan]}>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => this.setBg("dark")}
					activeOpacity={0.5}
					style={[styles.settingBtn, styles.dark]}>
					<Icon name={"moon-o"} size={16} style={{ color: "#A3A3A6" }}/>
				</TouchableOpacity>
			</View>
			<View style={styles.settingCell}>
				<TouchableOpacity
					onPress={() => this.setFontSize(-2)}
					activeOpacity={0.5}
					style={styles.settingBtn}>
					<Text style={{ color: "#999" }}>A-</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => this.setFontSize(2)}
					activeOpacity={0.5}
					style={styles.settingBtn}>
					<Text style={{ color: "#999" }}>A+</Text>
				</TouchableOpacity>
			</View>
		</View>;
	}

	setFontSize(num) {
		let fontSize = this.state.fontSize + num;
		if (fontSize < 14 || fontSize > 28) {
			return;
		}
		this.setState({
			fontSize
		});
		global.storage.save({
			key: "fontSize",
			data: fontSize
		});
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
					this.refs.scrollView.scrollTo({ x: 0, y: this.state.pageY - height + 35, animated: true });
				}
				// 下一页
				if (gestureState.dx < 10 && gestureState.dy < 10 && gestureState.y0 > height / 2) {
					this.refs.scrollView.scrollTo({ x: 0, y: this.state.pageY + height - 35, animated: true });
				}
			},
			onShouldBlockNativeResponder: (evt, gestureState) => false
			// 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
			// 默认返回true。目前暂时只支持android。
			,
		});
		global.storage.load({ key: "bgType" }).then((bgType) => {
			this.setBg(bgType);
		});
		global.storage.load({ key: "fontSize" }).then((fontSize) => {
			this.setState({
				fontSize
			});
		});
	}

	render() {
		if (!this.state.data) {
			return null;
		}
		return <ScrollView
			style={[styles.container, styles[this.state.bgType]]}
			ref="scrollView"
			onScroll = {(event) => {
				{
					this.setState({
						pageY: event.nativeEvent.contentOffset.y
					});
				}
			}}
			scrollEventThrottle = {200}
		>
			<Header
				navigation={this.props.navigation} type={1}
				bgType={this.state.bgType}
				ref={(view) => { this.header = view; }}
				onLayout={(event) => {
					this.layoutY = event.nativeEvent.layout.y;
				}}
				title={this.state.data.title} />
			{this.btnGroups()}
			{this.readingSettings()}
			{this.spinning()}
			<View
				style={styles.contents}
				{...this._panResponder.panHandlers}
			>
				<Text style={[styles[`${this.state.bgType}Text`], { fontSize: this.state.fontSize }]}>{this.contents()}</Text>
			</View>
			{this.btnGroups()}
			<Footer
				navigation={this.props.navigation}
				bgType={this.state.bgType}
				scrollView={this.refs.scrollView}/>
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
	},
	settingBox: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 5,
		marginTop: 8,
	},
	settingCell: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	settingBtn: {
		height: 22,
		width: 30,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#ccc",
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 2,
	},
	cyan: {
		backgroundColor: "#e7f4fe",
	},
	yellow: {
		backgroundColor: "#CFC0A9",
	},
	white: {
		backgroundColor: "#fff",
	},
	dark: {
		backgroundColor: "#4B4B4D",
	},
	cyanText: {
		color: "#777",
	},
	yellowText: {
		color: "#666",
	},
	whiteText: {
		color: "#666",
	},
	darkText: {
		color: "#BCBCBF",
	},

});


export default Contents;
