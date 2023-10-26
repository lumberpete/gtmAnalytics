(function (dataLayer) {

	const gtmAnalytics = {

		connected: false,
		queue: [],

		clock: {
			intervalsPerSecond: 10,
			interval: 1,
			ticking: null,
			events: {},
			add: (name, event) => {
				gtmAnalytics.clock.events[name] = event;
				gtmAnalytics.clock.tick();
			},
			remove: (name) => {
				delete gtmAnalytics.clock.events[name];
			},
			tick: () => {
				console.log('tick ' + gtmAnalytics.clock.interval);
				let count = 0;
				for (const event in gtmAnalytics.clock.events) {
					if (gtmAnalytics.clock.events.hasOwnProperty(event)) {
						// if (typeof gtmAnalytics.clock.events[event].interval != "undefined") {
						// 	if (gtmAnalytics.clock.interval % gtmAnalytics.clock.events[event].interval !== 0) {
						// 		continue;
						// 	}
						// }
						if (typeof gtmAnalytics.clock.events[event] === "function") {
							count++;
							gtmAnalytics.clock.events[event](gtmAnalytics.clock);
						}
					}
				}
				gtmAnalytics.clock.interval++;
				if (gtmAnalytics.clock.interval > gtmAnalytics.clock.intervalsPerSecond) {
					gtmAnalytics.clock.interval = 1;
				}
				clearTimeout(gtmAnalytics.clock.ticking);
				if (count > 0) {
					gtmAnalytics.clock.ticking = setTimeout(() => { gtmAnalytics.clock.tick(); }, Math.round(1000 / gtmAnalytics.clock.intervalsPerSecond));
				}
			},
		},

		process: (input) => {
			let output = [].slice.call(input, 0);
			// process messages to fit the required structure
			output.forEach((message, index) => {
				if (typeof message.event != "undefined") {
					output[index]._event = 'gtmEvent';
				} else {
					output[index]._event = null;
				}
				if (
					typeof message.payload != "undefined" &&
					message.payload != null
				) {
					let structured = {
						_location: (typeof message.payload.url != "undefined")? message.payload.url : window.location.href,
						_title: (typeof message.payload.title != "undefined")? message.payload.title : window.document.title,
					};
					let num = 0;
					for (const param in message.payload) {
						if (message.payload.hasOwnProperty(param)) {
							structured[num] = {
								name: param,
								value: message.payload[param],
							};
							num++;
						}
					}
					output[index].payload = structured;
				}
			});
			if (gtmAnalytics.connected) {
				// dump the queue onto the output payload
				if (gtmAnalytics.queue.length > 0) {
					gtmAnalytics.queue.push(...output);
					output = gtmAnalytics.queue;
					gtmAnalytics.queue = [];
				}
				console.log('processing ' + JSON.stringify(output, null, 2));
			} else {
				// put the output payload on the queue
				gtmAnalytics.queue.push(...output);
				// clean up output to stop it from being put on the dataLayer
				console.log('queuing ' + JSON.stringify(output, null, 2));
				output = false;
			};
			return output;
		},

		init: () => {
			// gtmAnalytics.clock.tick();
		},
	}

	const _push = dataLayer.push;
	dataLayer.push = function() {
		try {
			if (
				typeof arguments[0].payload != "undefined" ||
				typeof arguments[0].event != "undefined"
			) {
				let processed = gtmAnalytics.process(arguments);
				if (processed !== false) {
					return _push.apply(dataLayer, processed);
				};
			} else {
				return _push.apply(dataLayer, arguments);
			}
		} catch (err) {
			return _push.apply(dataLayer, arguments);
		}
	};

	gtmAnalytics.init();

	window._gtmAnalytics = gtmAnalytics;

})(window.dataLayer);

// comment for active consent processing
_gtmAnalytics.connected = true;
// uncomment for cookie-based consent processing
// _gtmAnalytics.clock.add("update consent", (clock) => {
// 	const regexp = new RegExp("(^|\\s+|;)cookieConsent=([^;]+)", "i");
// 	let consent = (document.cookie.match(regexp) || [null]).pop();
// 	if (consent) {
// 		consent = decodeURIComponent(consent);
// 	}
// 	if (consent === "true") {
// 		_gtmAnalytics.connected = true;
// 		window.dataLayer.push({
// 			event: "consent",
// 			payload: {
// 				status: "true",
// 			}
// 		});
// 		_gtmAnalytics.clock.remove("update consent");
// 	}
// });

window.dataLayer.push({
	event: "page_view",
	payload: {
		title: window.document.title,
		url: window.location.href,
	}
});