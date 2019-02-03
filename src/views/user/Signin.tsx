import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
	Button, FormInput, FormValidationMessage, FormLabel,
} from "react-native-elements";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	ToastAndroid,
	CheckBox,
	Alert,
} from "react-native";
import * as _ from "lodash";
import { signin } from "../../libs/api";


import { Header, Nav, Footer } from "../../components";

export default class Signin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			login: "",
			loginErr: "",
			password: "",
			passwordErr: "",
			client: "BOOK",
			checked: false,
		};
	}

	async checkLogin():void {
		this.refs.login.blur();
		if (!this.state.login) {
			return this.setState({
				loginErr: "请输入帐号/邮箱"
			});
		}
		await global.storage.save({
			key: "login",
			data: this.state.login,
		});
		if (this.state.login.length < 3) {
			return this.setState({
				loginErr: "登录帐号长度不对"
			});
		}
	}

	async checkPassword() {
		this.refs.password.blur();
		if (!this.state.password) {
			return this.setState({
				passwordErr: "请输入密码"
			});
		}
		// await global.storage.save({
		// 	key: "password",
		// 	data: this.state.password,
		// });
		if (this.state.password.length < 6) {
			return this.setState({
				passwordErr: "密码至少六位数"
			});
		}
	}

	async signin() {
		try {
			if (this.state.loading) {
				return;
			}
			await this.checkLogin();
			await this.checkPassword();
			if (this.state.loginErr || this.state.passwordErr) {
				return;
			}
			await this.setState({ loading: true });
			const token = await signin(_.pick(this.state, ["login", "password", "client"]));
			await ToastAndroid.show("登录成功", ToastAndroid.SHORT);
			await global.storage.save({ key: "accessToken", data: token.accessToken });
			this.props.navigation.navigate("Bookshelf");
		} catch (e) {
			await this.setState({ loading: false });
		}
	}

	async componentDidMount() {
		const login = await global.storage.load({
			key: "login",
		});
		this.setState({ login });
	}

	render() {
		return (
			<View>
				<Header navigation={this.props.navigation} type={1} title="登录"/>
				<Nav navigation={this.props.navigation}/>
				<View style={styles.spacer}/>
				<FormInput
					ref={"login"}
					autoFocus={true}
					placeholder='帐号/邮箱'
					underlineColorAndroid={"#1abc9c"}
					onChangeText={login => this.setState({ login, loginErr: "" })}
					onSubmitEditing={() => this.checkLogin()}
					onBlur={() => this.checkLogin()}
					leftIcon={ <Icon name='user' size={24} color='black' /> }
				/>
				<FormValidationMessage>{this.state.loginErr}</FormValidationMessage>
				<FormInput
					ref={"password"}
					placeholder='密码'
					underlineColorAndroid={"#1abc9c"}
					secureTextEntry={true}
					onSubmitEditing={() => this.checkPassword()}
					onBlur={() => this.checkPassword()}
					onChangeText={password => this.setState({ password, passwordErr: "" })}
				/>
				<FormValidationMessage>{this.state.passwordErr}</FormValidationMessage>
				<View style={styles.spacer}/>
				<Button
					loading={this.state.loading}
					raised
					backgroundColor="#1abc9c"
					borderRadius={2}
					onPress={() => this.signin()}
					title='登录' />
				<TouchableOpacity onPress={() => this.props.navigation.navigate("Signup")} style={styles.labelBtn}>
					<FormLabel labelStyle={{ color: "#1abc9c" }}>注册帐号</FormLabel>
				</TouchableOpacity>
				<Footer navigation={this.props.navigation}/>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	labelBtn: {
		marginTop: 10,
		alignItems: "flex-end",
	},
	spacer: {
		marginTop: 20,
	}
});
