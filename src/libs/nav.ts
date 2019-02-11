let timer:any;

export function toSections(props:any, bid:number) {
	if (!bid) {
		return;
	}
	if (timer) {
		return;
	}
	timer = setTimeout(() => {
		clearTimeout(timer);
		timer = null;
	}, 1000);
	return props.navigation.navigate("Sections", { bid });
}

export function toContents(props:any, sid:number) {
	if (!sid) {
		return;
	}
	if (timer) {
		return;
	}
	timer = setTimeout(() => {
		clearTimeout(timer);
		timer = null;
	}, 1000);
	return props.navigation.navigate("Contents", { sid });
}

export async function navTo(props:any, route:string, options:any = {}) {
	if (props.route === route) {
		return;
	}
	if (timer) {
		return;
	}
	timer = setTimeout(() => {
		clearTimeout(timer);
		timer = null;
	}, 1000);
	if (route === "Bookshelf") {
		const accessToken = await global.storage.load({ key: "accessToken" });
		if (!accessToken) {
			return props.navigation.navigate("Signin", options);
		}
	}
	return props.navigation.navigate(route, options);
}
