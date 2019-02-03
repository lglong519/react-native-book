import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
	Button, FormInput, FormValidationMessage, FormLabel
} from "react-native-elements";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	ToastAndroid,
} from "react-native";
import * as _ from "lodash";
import { signup } from "../../libs/api";


import { Header, Nav, Footer } from "../../components";

export default class Signin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			username: "",
			usernameErr: "",
			password: "",
			passwordErr: "",
			repassword: "",
			repasswordErr: "",
			email: "",
			emailErr: "",
			client: "BOOK",
		};
	}

	checkAccount():void {
		this.refs.username.blur();
		if (!this.state.username.length) {
			return this.setState({
				usernameErr: "请输入帐号"
			});
		}
		if (!/^[A-Za-z_]\w{3}/.test(this.state.username)) {
			return this.setState({
				usernameErr: "帐号格式不正确: 至少四个字符,以下划线或字母开头"
			});
		}
	}

	checkPassword() {
		this.refs.password.blur();
		if (!this.state.password) {
			return this.setState({
				passwordErr: "请输入密码"
			});
		}
		if (!/^\w{6}/.test(this.state.password)) {
			return this.setState({
				passwordErr: "密码格式不正确: 至少六位由下划线、字母或数字组成"
			});
		}
	}


	checkRepassword() {
		this.refs.repassword.blur();
		if (!this.state.password) {
			return;
		}

		if (!this.state.repassword) {
			return this.setState({
				repasswordErr: "请再次输入密码"
			});
		}
		if (this.state.password !== this.state.repassword) {
			return this.setState({
				repasswordErr: "两次输入密码不一致"
			});
		}
	}


	checkEmail():void {
		this.refs.email.blur();
		if (this.state.email && !/@/.test(this.state.email)) {
			return this.setState({
				emailErr: "请输入正确的邮箱"
			});
		}
	}

	async signup() {
		try {
			if (this.state.loading) {
				return;
			}
			await this.checkAccount();
			await this.checkPassword();
			await this.checkRepassword();
			await this.checkEmail();
			if (this.state.usernameErr || this.state.passwordErr) {
				return;
			}
			await this.setState({ loading: true });
			const token = await signup(_.pick(this.state, ["username", "password", "email", "client"]));
			ToastAndroid.show("注册成功", ToastAndroid.SHORT);
			await global.storage.save({ key: "accessToken", data: token.accessToken });
			this.props.navigation.navigate("Bookshelf");
		} catch (e) {
			await this.setState({ loading: false });
		}
	}

	render() {
		return (
			<View>
				<Header navigation={this.props.navigation} type={1} title="注册"/>
				<Nav navigation={this.props.navigation}/>
				<View style={styles.spacer}/>
				<FormInput
					ref={"username"}
					autoFocus={true}
					placeholder='*帐号'
					underlineColorAndroid={"#1abc9c"}
					onChangeText={username => this.setState({ username, usernameErr: "" })}
					onSubmitEditing={() => this.checkAccount()}
					onBlur={() => this.checkAccount()}
				/>
				<FormValidationMessage>{this.state.usernameErr}</FormValidationMessage>
				<FormInput
					ref={"password"}
					placeholder='*密码'
					underlineColorAndroid={"#1abc9c"}
					secureTextEntry={true}
					onSubmitEditing={() => this.checkPassword()}
					onBlur={() => this.checkPassword()}
					onChangeText={password => this.setState({ password, passwordErr: "" })}
				/>
				<FormValidationMessage>{this.state.passwordErr}</FormValidationMessage>
				<FormInput
					ref={"repassword"}
					placeholder='*确认密码'
					underlineColorAndroid={"#1abc9c"}
					secureTextEntry={true}
					onSubmitEditing={() => this.checkRepassword()}
					onBlur={() => this.checkRepassword()}
					onChangeText={repassword => this.setState({ repassword, repasswordErr: "" })}
				/>
				<FormValidationMessage>{this.state.repasswordErr}</FormValidationMessage>
				<FormInput
					ref={"email"}
					placeholder='邮箱'
					underlineColorAndroid={"#1abc9c"}
					onChangeText={email => this.setState({ email, emailErr: "" })}
					onSubmitEditing={() => this.checkEmail()}
					onBlur={() => this.checkEmail()}
				/>
				<FormValidationMessage>{this.state.emailErr}</FormValidationMessage>
				<View style={styles.spacer}/>
				<Button
					loading={this.state.loading}
					raised
					backgroundColor="#1abc9c"
					borderRadius={2}
					onPress={() => this.signup()}
					title='注册' />
				<TouchableOpacity onPress={() => this.props.navigation.navigate("Signin")} style={styles.labelBtn}>
					<FormLabel labelStyle={{ color: "#1abc9c" }}>登录帐号</FormLabel>
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
