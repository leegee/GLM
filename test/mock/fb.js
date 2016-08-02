'use strict';

/* Mock fb.api requests */

var fb = require('fb');

const fbApi = fb.api;

fb.api = function (url) {
	console.trace('here with ' + url);
	return new Promise((resolve, reject) => {
		console.log('url=', url);
		if (url === '/127824130594191_1126071777436083') {
			console.log('*********** Mocked /127824130594191_1126071777436083');
			return resolve({
				"created_time": "2016-07-18T07:48:00+0000",
				"message": "14-year-old Muawiya Alqam was sentenced to six-and-a-half years in prison by an Israeli military court on Sunday. Prisoners' rights organisation Addameer says that of the 7000 Palestinian political prisoners held by Israel, 414 are children. The systematic detention of Palestinian children, often accompanied by physical abuse, is in violation of international law.",
				"id": "127824130594191_1126071777436083"
			});
		}

		else if (url === '/127824130594191/posts') {
			console.log('*********** Mocked /127824130594191/posts');
			return resolve({
				"data": [
					{
						"message": "Palestinians are facing increasingly severe water shortages as Israel caps or obstructs Palestinian access to water. As the temperature rises in the summer, Palestinians have less and less access to water. Some cities and villages have gone as long as 40 days without running water this summer, forcing the families who can afford to do so to haul in water tanks. This shortage is not due to a natural water scarcity in the West Bank, but induced scarcity, due to the occupation.",
						"created_time": "2016-08-01T18:00:00+0000",
						"id": "127824130594191_1134897399886854"
					},
					{
						"message": "On Sunday Israeli forces opened fire at farmlands and fishing boats in Gaza. These instances are common despite a ceasefire agreement in 2014.",
						"created_time": "2016-08-01T16:00:00+0000",
						"id": "127824130594191_1134892306554030"
					}
				]
			});
		}

		else {
			console.log('????? No mock for ',url);
		}

		fbApi.apply(this, arguments).then(() => {
			console.log('-'.repeat(80));
			console.log(rv);
			console.log('-'.repeat(80));
			console.log('Done', url);
			return resolve(rv);
		});
	});
}