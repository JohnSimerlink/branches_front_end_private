let Vue = require("vue").default; // for webpack
if (!Vue) {
	Vue = require("vue"); // for ava-ts tests
}

import moment from "moment";

export function timeFromNow(utcTimestamp) {
	return moment(utcTimestamp).fromNow();
}

Vue.filter("timeFromNow", timeFromNow);
Vue.filter("dateTime", utcTimestamp => {
	return moment(utcTimestamp).format("MM/DD/YY, h:mm:ss a");
});
Vue.filter("round", Math.round);
Vue.filter("sortByNextReviewTime", arr => {
	return arr.sort((a, b) => a.nextReviewTime > b.nextReviewTime);
});
Vue.filter("truncate", Math.floor);
Vue.filter("mult10", x => Math.floor(10 * x));
Vue.filter("pad0", (str) => {
	// console.log('pad0, str ', str, ' lenght is', str.length)
	if (("" + str).length == 1) {
		return "0" + str;
	} else {
		return str;
	}
});

export function secondsToPretty(seconds = 0) {
	let minutes = Math.floor(seconds / 60);
	seconds = seconds % 60;
	let hours = Math.floor(minutes / 60);
	minutes = minutes % 60;
	let days = Math.floor(hours / 24);
	hours = hours % 24;
	let value, unit;
	let result = "";
	if (days) {
		result += days + " d ";
	}
	if (hours) {
		result += hours + " h ";
	}
	if (minutes) {
		result += minutes + " m ";
	}
	if (seconds) {
		result += seconds + " s ";
	}
	return result;
}

Vue.filter("secondsToPretty", secondsToPretty);
