export default class {
	constructor(formatString:string = "YYYY-MM-DD HH:mm:SS") {
		this.formatString = formatString;
		return this.format.bind(this);
	}

	format(dateTime:string|number):string {
		const time = new Date(dateTime);
		const year = this.pad(time.getFullYear());
		const month = this.pad(time.getMonth() + 1);
		const date = this.pad(new Date(time).getDate());
		const hours = this.pad(new Date(time).getHours());
		const minutes = this.pad(new Date(time).getMinutes());
		const seconds = this.pad(new Date(time).getSeconds());
		return this.formatString.replace(/YYYY/ig, year)
			.replace(/MM/g, month)
			.replace(/DD/ig, date)
			.replace(/HH/ig, hours)
			.replace(/mm/g, minutes)
			.replace(/SS/ig, seconds);
	}

	pad(value) {
		return (Number(value) < 10 ? `0${value}` : value);
	}
}
