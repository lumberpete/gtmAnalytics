(function (undefined) {
	window.dataLayer = window.dataLayer || [];

	var _gtmAnalytics = window.gtmAnalytics || [];
	window.gtmAnalytics = {
		screen: "Path: " + window.location.pathname,
		ver: "20211109",
		debug: false,
		connected: false,
		appstate: {
			trackers: {},
		},
		push: function (object) {
			if (typeof object.command != "string") return;
			switch (object.command) {
				case "resetTrackers":
					if (typeof object.trackers != "undefined") {
						window.gtmAnalytics.push({
							command: "trackAppStates",
							trackers: object.trackers,
						});
					} else if (
						typeof window.gtmAnalytics.appstates.trackersLast != "undefined"
					) {
						window.gtmAnalytics.push({
							command: "trackAppStates",
							trackers: window.gtmAnalytics.appstates.trackersLast,
						});
					} else {
						window.gtmAnalytics.appstates.trackerNames = [];
						window.gtmAnalytics.appstates.trackers = [];
					}
					if (typeof object.controls != "undefined") {
						window.gtmAnalytics.push({
							command: "trackClicks",
							controls: object.controls,
						});
					} else if (
						typeof window.gtmAnalytics.click.controlsLast != "undefined"
					) {
						window.gtmAnalytics.push({
							command: "trackClicks",
							controls: window.gtmAnalytics.click.controlsLast,
						});
					} else {
						window.gtmAnalytics.click.controlsRules = [];
						window.gtmAnalytics.click.controls = [];
					}
					if (typeof object.timers != "undefined") {
						window.gtmAnalytics.push({
							command: "trackHeartBeat",
							timers: object.timers,
						});
					} else if (
						typeof window.gtmAnalytics.heartBeat.timersLast != "undefined"
					) {
						window.gtmAnalytics.push({
							command: "trackHeartBeat",
							timers: window.gtmAnalytics.heartBeat.timersLast,
						});
					} else {
						window.gtmAnalytics.heartBeat.timers = [];
					}
					if (typeof object.anchors != "undefined") {
						window.gtmAnalytics.push({
							command: "trackScrollAnchors",
							anchors: object.anchors,
						});
					} else if (
						typeof window.gtmAnalytics.scroll.anchorsLast != "undefined"
					) {
						window.gtmAnalytics.push({
							command: "trackScrollAnchors",
							anchors: window.gtmAnalytics.scroll.anchorsLast,
						});
					} else {
						window.gtmAnalytics.scroll.anchors = [];
					}
					break;

				case "setScreen":
					if (typeof object.screen != "undefined") {
						window.gtmAnalytics.oldScreen =
							window.gtmAnalytics.screen || "Unset";
						window.gtmAnalytics.screen = object.screen;
						setTimeout(function () {
							window.gtmAnalytics.oldScreen = false;
						}, 250);
					}
					break;

				case "sendEvent":
					if (
						typeof object.action != "undefined" &&
						typeof object.label != "undefined"
					) {
						window.gtmAnalytics.send({
							event: "gtmEvent",
							gtmCategory:
								object.context || window.gtmAnalytics.screen || "Unknown",
							gtmAction: object.action,
							gtmLabel: object.label,
							gtmValue: object.value || null,
							gtmNonInteraction:
								typeof object.interactive != "undefined"
									? !object.interactive
									: false,
						});
					}
					break;

				case "trackClicks":
					if (typeof object.controls != "undefined") {
						for (var i = 0; i < object.controls.length; i++) {
							if (
								window.gtmAnalytics.click.controlsRules.indexOf(
									object.controls[i].rule
								) === -1
							) {
								// extend flat elevate declaration to array
								if (
									typeof object.controls[i].elevate != "undefined" &&
									typeof object.controls[i].elevate[0] == "undefined"
								) {
									object.controls[i].elevate.name = "default";
									object.controls[i].elevate = [object.controls[i].elevate];
									if (window.gtmAnalytics.debug) {
										console.log(
											"INIT fixed elevation",
											object.controls[i].elevate
										);
									}
								}
								window.gtmAnalytics.click.controlsRules.push(
									object.controls[i].rule
								);
								window.gtmAnalytics.click.controls.push(object.controls[i]);
							}
						}
						window.gtmAnalytics.click.controlsLast =
							window.gtmAnalytics.click.controls.slice();
					}
					break;

				case "trackClick":
					if (typeof object.event != "undefined") {
						window.gtmAnalytics.click.track(object.event);
					}
					break;

				case "trackHeartBeat":
					if (typeof object.timers != "undefined") {
						for (var i = 0; i < object.timers.length; i++) {
							window.gtmAnalytics.heartBeat.timers.indexOf(object.timers[i]) ===
								-1 &&
								window.gtmAnalytics.heartBeat.timers.push(object.timers[i]);
						}
						window.gtmAnalytics.heartBeat.timers.sort(function (a, b) {
							return a - b;
						});
						window.gtmAnalytics.heartBeat.ticks = 0;
						window.gtmAnalytics.heartBeat.timersLast =
							window.gtmAnalytics.heartBeat.timers.slice();
						window.gtmAnalytics.heartBeat.tick();
					}
					break;

				case "trackScrollAnchors":
					if (typeof object.anchors != "undefined") {
						for (var i = 0; i < object.anchors.length; i++) {
							window.gtmAnalytics.scroll.anchors.indexOf(object.anchors[i]) ===
								-1 &&
								window.gtmAnalytics.scroll.anchors.push(object.anchors[i]);
						}
						window.gtmAnalytics.scroll.anchors.sort(function (a, b) {
							return a - b;
						});
						window.gtmAnalytics.scroll.anchorsLast =
							window.gtmAnalytics.scroll.anchors.slice();
					}
					break;

				case "trackAppStates":
					if (typeof object.trackers != "undefined") {
						for (var i = 0; i < object.trackers.length; i++) {
							if (
								window.gtmAnalytics.appstates.trackerNames.indexOf(
									object.trackers[i].name
								) === -1
							) {
								window.gtmAnalytics.appstates.trackerNames.push(
									object.trackers[i].name
								);
								window.gtmAnalytics.appstates.trackers.push(object.trackers[i]);
							}
						}
						window.gtmAnalytics.appstates.trackersLast =
							window.gtmAnalytics.appstates.trackers.slice();
						window.gtmAnalytics.appstates.tick();
					}
					break;

				case "setConfig":
					if (typeof object.appstateSampling != "undefined") {
						if (object.appstateSampling == false) {
							window.gtmAnalytics.appstates.sampling = false;
						} else {
							window.gtmAnalytics.appstates.sampling = Math.max(
								250,
								parseInt(object.appstateSampling, 10)
							);
						}
					}
					if (typeof object.debug != "undefined") {
						window.gtmAnalytics.debug = object.debug === true;
					}
					if (typeof object.connect != "undefined") {
						window.gtmAnalytics.connected = object.connect === true;
					}
					break;
			}
		},
		sendQueue: [],
		send: function (object) {
			// process appstate-driven system triggers
			if (
				typeof object.event != "undefined" &&
				object.event == "gtmAppStateUpdated"
			) {
				if (
					typeof object.gtmAppStateUpdated != "undefined" &&
					object.gtmAppStateUpdated == "gtmaConnectTracking" &&
					typeof object.gtmAppStateValue != "undefined" &&
					object.gtmAppStateValue == "true"
				) {
					window.gtmAnalytics.push({ command: "setConfig", connect: true });
				}
			}
			// process appstates if not ticking
			if (
				window.gtmAnalytics.appstates.trackers.length > 0 &&
				window.gtmAnalytics.appstates.sampling == false
			) {
				window.gtmAnalytics.appstates.tick();
			}
			// attach timestamp to event object
			if (
				typeof object.event != "undefined" &&
				typeof object.gtmRequestTimestamp == "undefined"
			) {
				object.gtmRequestTimestamp = +new Date();
			}
			if (window.gtmAnalytics.debug) {
				console.log(
					"SENDING " + (window.gtmAnalytics.connected ? "online" : "queue"),
					window.gtmAnalytics.appstate.trackers,
					"\n",
					object
				);
				if (typeof object["eventCallback"] == "function") {
					object["eventCallback"]();
				}
			} else if (window.gtmAnalytics.connected) {
				if (window.gtmAnalytics.sendQueue.length > 0) {
					var queued = {};
					for (var i = 0; i < window.gtmAnalytics.sendQueue.length; i++) {
						queued = window.gtmAnalytics.sendQueue.shift();
						window.dataLayer.push(queued);
						i--;
					}
				}
				window.dataLayer.push(object);
			} else {
				window.gtmAnalytics.sendQueue.push(object);
			}
		},
		appstates: {
			sampling: 250,
			trackers: [],
			trackerNames: [],
			ticking: null,
			tick: function () {
				var nodes = [],
					subject = null,
					tester = null,
					value = null,
					matches = [],
					count,
					remove = false;
				for (
					var i = 0;
					i < window.gtmAnalytics.appstates.trackers.length;
					i++
				) {
					if (
						typeof window.gtmAnalytics.appstates.trackers[i].name ==
							"undefined" ||
						(typeof window.gtmAnalytics.appstates.trackers[i].page !=
							"undefined" &&
							window.location.href.indexOf(
								window.gtmAnalytics.appstates.trackers[i].page
							) == -1)
					) {
						continue;
					}

					value = null;
					remove = false;

					nodes = [];
					subject = null;
					if (
						typeof window.gtmAnalytics.appstates.trackers[i]["id"] !=
						"undefined"
					) {
						nodes = [
							document.getElementById(
								window.gtmAnalytics.appstates.trackers[i]["id"]
							),
						];
					} else if (
						typeof window.gtmAnalytics.appstates.trackers[i]["class"] !=
						"undefined"
					) {
						nodes = document.getElementsByClassName(
							window.gtmAnalytics.appstates.trackers[i]["class"]
						);
					} else if (
						typeof window.gtmAnalytics.appstates.trackers[i]["type"] !=
						"undefined"
					) {
						if (
							window.gtmAnalytics.appstates.trackers[i]["type"] == "document"
						) {
							subject = document;
						} else if (
							window.gtmAnalytics.appstates.trackers[i]["type"] ==
								"localStorage" &&
							typeof window.localStorage != "undefined"
						) {
							subject = window.localStorage;
						} else {
							nodes = document.getElementsByTagName(
								window.gtmAnalytics.appstates.trackers[i]["type"]
							);
						}
					}
					if (nodes.length > 0) {
						for (var j = 0; j < nodes.length; j++) {
							if (
								nodes[j] &&
								(typeof window.gtmAnalytics.appstates.trackers[i]["id"] ==
									"undefined" ||
									(nodes[j].getAttribute("id") &&
										nodes[j]
											.getAttribute("id")
											.indexOf(
												window.gtmAnalytics.appstates.trackers[i]["id"]
											) > -1)) &&
								(typeof window.gtmAnalytics.appstates.trackers[i]["class"] ==
									"undefined" ||
									(nodes[j].getAttribute("class") &&
										nodes[j]
											.getAttribute("class")
											.indexOf(
												window.gtmAnalytics.appstates.trackers[i]["class"]
											) > -1)) &&
								(typeof window.gtmAnalytics.appstates.trackers[i]["type"] ==
									"undefined" ||
									(nodes[j].nodeName &&
										nodes[j].nodeName.toLowerCase() ==
											window.gtmAnalytics.appstates.trackers[i]["type"]))
							) {
								subject = nodes[j];
								break;
							}
						}
					}

					// if subject was found, test it for existing rules
					if (
						subject &&
						typeof window.gtmAnalytics.appstates.trackers[i].rules !=
							"undefined"
					) {
						tester = null;
						if (
							typeof window.gtmAnalytics.appstates.trackers[i].tester !=
							"undefined"
						) {
							tester = window.gtmAnalytics.appstates.trackers[i].tester;
							if (tester.indexOf("%%") > -1) {
								tester = gtmAnalytics.replaceWithProperties(tester, {
									default: subject,
								});
							}
						}
						for (
							var j = 0;
							j < window.gtmAnalytics.appstates.trackers[i].rules.length;
							j++
						) {
							if (
								typeof window.gtmAnalytics.appstates.trackers[i].rules[j]
									.tester != "undefined"
							) {
								tester =
									window.gtmAnalytics.appstates.trackers[i].rules[j].tester;
								if (tester.indexOf("%%") > -1) {
									tester = gtmAnalytics.replaceWithProperties(tester, {
										default: subject,
									});
								}
							}
							// if tester exists and resolves positively
							if (
								tester &&
								new RegExp(
									window.gtmAnalytics.appstates.trackers[i].rules[j].rule,
									window.gtmAnalytics.appstates.trackers[i].rules[j].flags || ""
								).test(tester)
							) {
								value =
									window.gtmAnalytics.appstates.trackers[i].rules[j].value;
								if (value.indexOf("%%") > -1) {
									value = gtmAnalytics.replaceWithProperties(value, {
										default: subject,
									});
								}
								if (value.indexOf("%%") > -1) {
									matches = tester.match(
										window.gtmAnalytics.appstates.trackers[i].rules[j].rule
									);
									if (matches && typeof matches.length != "undefined") {
										for (var k = 0; k < matches.length; k++) {
											value = value.replace("%%" + k + "%%", matches[k]);
										}
									}
								}
								// process disable tracker flag
								if (
									typeof window.gtmAnalytics.appstates.trackers[i].rules[j]
										.disable != "undefined" &&
									window.gtmAnalytics.appstates.trackers[i].rules[j].disable ==
										true
								) {
									remove = true;
								}
								// break tracker
								break;
							}
						}
					}

					if (
						value &&
						(typeof window.gtmAnalytics.appstate.trackers[
							window.gtmAnalytics.appstates.trackers[i].name
						] == "undefined" ||
							window.gtmAnalytics.appstate.trackers[
								window.gtmAnalytics.appstates.trackers[i].name
							] != value)
					) {
						count = false;
						if (
							typeof window.gtmAnalytics.appstates.trackers[i].count !=
							"undefined"
						) {
							window.gtmAnalytics.appstates.trackers[i].count++;
							count = window.gtmAnalytics.appstates.trackers[i].count;
						}
						window.gtmAnalytics.send({
							event: "gtmAppStateUpdated",
							gtmAppStateUpdated:
								window.gtmAnalytics.appstates.trackers[i].name,
							gtmAppStateUpdateType:
								typeof window.gtmAnalytics.appstate.trackers[
									window.gtmAnalytics.appstates.trackers[i].name
								] == "undefined"
									? "set"
									: "change",
							gtmAppStateValue: value,
							gtmAppStateNumber: count,
						});
						if (
							typeof window.gtmAnalytics.appstates.trackers[i].event !=
								"undefined" &&
							typeof window.gtmAnalytics.appstates.trackers[i].event.action !=
								"undefined"
						) {
							window.gtmAnalytics.push({
								command: "sendEvent",
								action: window.gtmAnalytics.appstates.trackers[i].event.action,
								label:
									(window.gtmAnalytics.appstates.trackers[i].event.value ||
										"") + value,
								value: count,
								interactive:
									window.gtmAnalytics.appstates.trackers[i].event.interactive ||
									false,
							});
						}
						window.gtmAnalytics.appstate.trackers[
							window.gtmAnalytics.appstates.trackers[i].name
						] = value;
					}

					if (remove) {
						window.gtmAnalytics.appstates.trackers.splice(i);
					}
				}

				clearTimeout(window.gtmAnalytics.appstates.ticking);
				if (
					window.gtmAnalytics.appstates.sampling &&
					window.gtmAnalytics.appstates.trackers.length > 0
				) {
					window.gtmAnalytics.appstates.ticking = setTimeout(function () {
						window.gtmAnalytics.appstates.tick();
					}, window.gtmAnalytics.appstates.sampling);
				}
			},
		},
		heartBeat: {
			timers: [],
			ticks: 0,
			ticking: null,
			tick: function () {
				if (
					window.gtmAnalytics.heartBeat.ticks >=
					window.gtmAnalytics.heartBeat.timers[0]
				) {
					var current = window.gtmAnalytics.heartBeat.timers[0];
					window.gtmAnalytics.push({
						command: "sendEvent",
						action: "HeartBeat",
						label: window.gtmAnalytics.heartBeat.timers[0] / 1000,
						value: window.gtmAnalytics.heartBeat.timers[0] / 1000,
						interactive: false,
					});
					while (window.gtmAnalytics.heartBeat.timers[0] <= current) {
						window.gtmAnalytics.heartBeat.timers.shift();
					}
				}
				window.gtmAnalytics.heartBeat.ticks += 1000;
				clearTimeout(window.gtmAnalytics.heartBeat.ticking);
				if (window.gtmAnalytics.heartBeat.timers.length > 0) {
					window.gtmAnalytics.heartBeat.ticking = setTimeout(function () {
						window.gtmAnalytics.heartBeat.tick();
					}, 1000);
				}
			},
		},
		scanForAttributes: function (node, expected, distance = 0) {
			if (
				distance < 0 ||
				typeof expected == "undefined" ||
				typeof node == "undefined" ||
				node === null ||
				node.parentNode === document.body ||
				typeof node.getAttribute != "function"
			)
				return { type: false, label: false, config: false };
			var type = node.getAttribute("data-analytics-type"),
				label = node.getAttribute("data-analytics-label"),
				config = node.getAttribute("data-analytics-config");
			if (
				typeof type == "string" &&
				type == expected &&
				typeof label == "string"
			) {
				return { type: type, label: label, config: config };
			}
			return window.gtmAnalytics.scanForAttributes(
				node.parentNode,
				expected,
				distance - 1
			);
		},
		elevateElement: function (nodes, attributes, distance = 0) {
			if (nodes.length < 1) return null;
			var node = nodes[nodes.length - 1];
			if (
				distance < 0 ||
				(typeof attributes["id"] == "undefined" &&
					typeof attributes["class"] == "undefined" &&
					typeof attributes["type"] == "undefined") ||
				typeof node == "undefined" ||
				node === null ||
				node.parentNode === document.body
			)
				return null;
			if (
				(typeof attributes["id"] == "undefined" ||
					(node.getAttribute("id") &&
						node.getAttribute("id").indexOf(attributes["id"]) > -1)) &&
				(typeof attributes["class"] == "undefined" ||
					(node.getAttribute("class") &&
						node.getAttribute("class").indexOf(attributes["class"]) > -1)) &&
				(typeof attributes["type"] == "undefined" ||
					(node.nodeName && node.nodeName.toLowerCase() == attributes["type"]))
			) {
				if (typeof attributes["level"] != "undefined") {
					if (
						typeof nodes[nodes.length - 1 - attributes["level"]] != "undefined"
					) {
						node = nodes[nodes.length - 1 - attributes["level"]];
					} else if (attributes["level"] < 0) {
						for (var i = attributes["level"]; i < 0; i++) {
							node = node.parentNode;
						}
					}
				}
				return node;
			}
			nodes.push(node.parentNode);
			return window.gtmAnalytics.elevateElement(
				nodes,
				attributes,
				distance - 1
			);
		},
		getAddress: function (address) {
			if (
				address["distance"] < 0 ||
				typeof address["path"] == "undefined" ||
				typeof address["node"] == "undefined" ||
				address["node"] === null ||
				typeof address["node"].parentNode === "undefined" ||
				typeof address["node"].nodeName == "undefined" ||
				typeof address["node"].nodeName != "string" ||
				address["node"] === document.body
			)
				return true;
			var type = address["node"].nodeName.toLowerCase(),
				id = address["node"].id,
				classes = address["node"].className,
				href = address["node"].href;
			if (typeof id == "string" && id != "") {
				id = "#" + id.trim();
			} else {
				id = "";
			}
			if (typeof classes == "string" && classes != "") {
				classes =
					"." + classes.replace(/\s\s+/g, " ").replace(/\s/g, ".").trim();
			} else {
				classes = "";
			}
			if (typeof href == "string" && href != "") {
				href = "[href=" + href.trim() + "]";
			} else {
				href = "";
			}
			address["path"] =
				type + id + classes + href + " " + address["path"].trim();
			address["distance"] = address["distance"] - 1;
			address["node"] = address["node"].parentNode;
			return window.gtmAnalytics.getAddress(address);
		},
		serializeForm: function (form, whitelist) {
			var field,
				value,
				data = [];
			if (typeof form == "object" && form.nodeName.toLowerCase() == "form") {
				for (var i = 0; i < form.elements.length; i++) {
					field = form.elements[i];
					value = "";
					if (
						field.name &&
						typeof whitelist[field.name] != "undefined" &&
						!field.disabled &&
						field.type.toLowerCase() != "file" &&
						field.type.toLowerCase() != "reset" &&
						field.type.toLowerCase() != "submit" &&
						field.type.toLowerCase() != "button"
					) {
						if (field.type.toLowerCase() == "select-multiple") {
							for (var j = field.options.length - 1; j >= 0; j--) {
								if (field.options[j].selected) {
									value = value + ", " + field.options[j].value;
								}
							}
						} else if (
							(field.type != "checkbox" && field.type != "radio") ||
							field.checked
						) {
							value = field.value;
						}
						if (new RegExp(whitelist[field.name], "").test(value)) {
							data[data.length] =
								encodeURIComponent(field.name) +
								"=" +
								encodeURIComponent(value);
						} else {
							return false;
						}
					}
				}
				return data.join("&").replace(/%20/g, "+");
			} else {
				return "FormSerializeError";
			}
		},
		replaceWithProperties: function (string, references, setup = {}) {
			var output = string,
				replacements = string.match(/%%[^%]+%%/g),
				replacement,
				replaced,
				reference,
				sibling,
				matches;
			if (
				replacements &&
				replacements.length > 0 &&
				typeof references["default"] != "undefined"
			) {
				for (var j = 0; j < replacements.length; j++) {
					replacement = replacements[j].match(/%%((([^%]+)::|)([^%]+))%%/);
					// (5) ["%%innerHTML%%", "innerHTML", "", undefined, "innerHTML"
					// (5) ["%%el-innerHTML%%", "el-innerHTML", "el-", "el", "innerHTML"
					replaced = replacement[0];
					reference = references["default"];
					if (
						typeof replacement[3] != "undefined" &&
						typeof references[replacement[3]] != "undefined"
					) {
						reference = references[replacement[3]];
					}
					if (replacement[4] == "nthSibling") {
						replaced = "UnknownIndex";
						if (
							typeof reference.parentNode != "undefined" &&
							reference.parentNode.firstChild != "undefined"
						) {
							replaced = 1;
							sibling = reference.parentNode.firstChild;
							while (sibling !== reference && sibling.nextSibling) {
								if (sibling.nodeName == reference.nodeName) {
									replaced++;
								}
								sibling = sibling.nextSibling;
							}
						}
						replaced = "" + replaced;
					} else if (replacement[4] == "formPayload") {
						replaced = window.gtmAnalytics.serializeForm(
							reference,
							setup["whitelist"] || {}
						);
						if (replaced == false) {
							// prevent firing
							params["type"] = false;
						}
					} else if (
						replacement.length == 5 &&
						typeof reference[replacement[4]] == "string"
					) {
						replaced = reference[replacement[4]].trim();
					}
					if (replaced != "" && typeof setup["translate"] != "undefined") {
						// regex match translate
						if (
							typeof setup["translate"]["regexMatch-" + replacement[1]] !=
								"undefined" &&
							setup["translate"]["regexMatch-" + replacement[1]].length > 1
						) {
							matches = replaced.match(
								setup["translate"]["regexMatch-" + replacement[1]][0]
							);
							if (matches && typeof matches.length != "undefined") {
								replaced =
									setup["translate"]["regexMatch-" + replacement[1]][1];
								for (var k = 0; k < matches.length; k++) {
									replaced = replaced.replace("%%" + k + "%%", matches[k]);
								}
							}
							// match is required to process with event report
							else if (
								typeof setup["translate"]["regexMatch-" + replacement[1]][2] !=
									"undefined" &&
								setup["translate"]["regexMatch-" + replacement[1]][2] === true
							) {
								// completely clears the input var
								return null;
							}
						}
						// exact translate
						if (typeof setup["translate"][replaced] != "undefined") {
							replaced = setup["translate"][replaced];
						}
					}
					output = output.replace(replacement[0], replaced);
				}
			}
			return output;
		},
		click: {
			controls: [],
			controlsRules: [],
			track: function (e) {
				var e = e || window.event,
					el = e.target || e.srcElement,
					params;
				if (el.nodeType === 3) el = el.parentNode; //Safari bug

				// scan for params in code, 10 lvls up
				params = window.gtmAnalytics.scanForAttributes(el, "Click", 10);

				// fallback to scripted triggers
				if (
					(window.gtmAnalytics.click.controls.length > 0 &&
						typeof params["type"] != "string") ||
					typeof params["label"] != "string"
				) {
					var address = { node: el, path: el.gtmPath || "", distance: 15 },
						references,
						elevated;
					window.gtmAnalytics.getAddress(address);
					if (window.gtmAnalytics.debug) {
						console.log("CLICK \n", address["path"], "\n", el.innerText);
					}
					if (window.gtmAnalytics.click.controls.length > 250) {
						window.gtmAnalytics.send({
							event: "gtmEvent",
							gtmCategory: "Debug",
							gtmAction: "Click tracking",
							gtmLabel: "Too many controls tracked in scripted triggers",
							gtmValue: false,
							gtmNonInteraction: true,
						});
					}
					for (var i = 0; i < window.gtmAnalytics.click.controls.length; i++) {
						// body condition test
						if (
							typeof window.gtmAnalytics.click.controls[i].body !=
								"undefined" &&
							document.body &&
							((typeof window.gtmAnalytics.click.controls[i].body.id !=
								"undefined" &&
								new RegExp(
									window.gtmAnalytics.click.controls[i].body.id,
									""
								).test(document.body.getAttribute("id")) === false) ||
								(typeof window.gtmAnalytics.click.controls[i].body.class !=
									"undefined" &&
									new RegExp(
										window.gtmAnalytics.click.controls[i].body.class,
										""
									).test(document.body.getAttribute("class")) === false))
						) {
							continue;
						}
						// page condition test
						if (
							typeof window.gtmAnalytics.click.controls[i].page !=
								"undefined" &&
							new RegExp(window.gtmAnalytics.click.controls[i].page, "").test(
								window.location.href
							) === false
						) {
							continue;
						}
						// path condition test
						if (
							new RegExp(
								window.gtmAnalytics.click.controls[i].rule,
								window.gtmAnalytics.click.controls[i].flags || ""
							).test(address["path"])
						) {
							if (
								typeof window.gtmAnalytics.click.controls[i].skip !=
									"undefined" &&
								new RegExp(window.gtmAnalytics.click.controls[i].skip, "").test(
									address["path"]
								)
							) {
								continue;
							}
							references = {
								el: el,
								default: el,
							};
							if (
								typeof window.gtmAnalytics.click.controls[i].elevate !=
								"undefined"
							) {
								// if (window.gtmAnalytics.debug) { console.log("CLICK elevate\n", window.gtmAnalytics.click.controls[i].elevate); };
								for (
									var j = 0;
									j < window.gtmAnalytics.click.controls[i].elevate.length;
									j++
								) {
									if (
										window.gtmAnalytics.click.controls[i].elevate[j].name !=
										"undefined"
									) {
										elevated = window.gtmAnalytics.elevateElement(
											[el],
											window.gtmAnalytics.click.controls[i].elevate[j],
											10
										);
										if (window.gtmAnalytics.debug) {
											console.log(
												"CLICK elevating\n",
												window.gtmAnalytics.click.controls[i].elevate[j],
												elevated
											);
										}
										if (elevated) {
											references[
												window.gtmAnalytics.click.controls[i].elevate[j].name
											] = elevated;
										}
									}
								}
							}
							if (window.gtmAnalytics.debug) {
								console.log("CLICK references", references);
							}
							params["type"] =
								window.gtmAnalytics.click.controls[i]["type"] || "Click";
							params["config"] =
								window.gtmAnalytics.click.controls[i]["config"] || "";
							params["label"] = window.gtmAnalytics.click.controls[i]["label"];
							if (params["label"].indexOf("%%") > -1) {
								params["label"] = gtmAnalytics.replaceWithProperties(
									params["label"],
									references,
									window.gtmAnalytics.click.controls[i]
								);
							}
							// el.setAttribute('data-analytics-type', params['type']);
							// el.setAttribute('data-analytics-label', params['label']);
							// el.setAttribute('data-analytics-config', params['config']);
							break;
						}
					}
				}

				// trigger event if found
				if (
					typeof params["type"] == "string" &&
					typeof params["label"] == "string"
				) {
					var screen = window.gtmAnalytics.screen;
					if (typeof window.gtmAnalytics.oldScreen == "string") {
						screen = window.gtmAnalytics.oldScreen;
						window.gtmAnalytics.oldScreen = false;
					}
					var object = {
						event: "gtmEvent",
						gtmCategory: screen,
						gtmAction: params["type"],
						gtmLabel: params["label"],
						gtmValue: false,
						gtmNonInteraction: false,
					};
					if (
						typeof params["config"] == "string" &&
						params["config"].indexOf(":outbound:") > -1 &&
						typeof el.href == "string" &&
						el.href != "" &&
						el.href != "#"
					) {
						e.preventDefault();
						var link = el.href;
						object["eventCallback"] = function () {
							window.location.href = link;
						};
						window.gtmAnalytics.send(object);
						setTimeout(function () {
							window.location.href = link;
						}, 5000);
						return false;
					} else if (
						typeof params["config"] == "string" &&
						params["config"].indexOf(":submit:") > -1 &&
						el.nodeName.toLowerCase() == "button" &&
						el.type.toLowerCase() == "submit"
					) {
						e.preventDefault();
						var form = window.gtmAnalytics.elevateElement(
							[el],
							{ type: "form" },
							10
						);
						object["eventCallback"] = function () {
							form.submit();
						};
						window.gtmAnalytics.send(object);
						setTimeout(function () {
							form.submit();
						}, 5000);
						return false;
					} else {
						window.gtmAnalytics.send(object);
					}
				}
				return;
			},
		},
		scroll: {
			anchors: [],
			track: function () {
				if (window.gtmAnalytics.freeze) return;
				var pageHeight = Math.max(
					document.body.scrollHeight,
					document.documentElement.scrollHeight,
					document.body.offsetHeight,
					document.documentElement.offsetHeight
				);
				if (pageHeight != window.gtmAnalytics.pageHeight) {
					window.gtmAnalytics.recount();
				} else {
					window.gtmAnalytics.pagePosition = window.pageYOffset;
				}

				if (window.gtmAnalytics.scroll.anchors.length > 0) {
					var scrollPercentage = Math.min(
						100,
						Math.round(
							(100 *
								(window.gtmAnalytics.pagePosition +
									window.gtmAnalytics.windowHeight)) /
								window.gtmAnalytics.pageHeight
						)
					);
					var i = 0;
					for (i = 0; i < window.gtmAnalytics.scroll.anchors.length; i++) {
						if (
							typeof window.gtmAnalytics.scroll.anchors[i - 1] != "undefined" &&
							window.gtmAnalytics.scroll.anchors[i - 1] ==
								window.gtmAnalytics.scroll.anchors[i]
						)
							continue;
						if (scrollPercentage < window.gtmAnalytics.scroll.anchors[i]) {
							break;
						}
						window.gtmAnalytics.push({
							command: "sendEvent",
							action: "Scroll",
							label: window.gtmAnalytics.scroll.anchors[i] + "%",
							value: window.gtmAnalytics.scroll.anchors[i],
							interactive: false,
						});
					}
					window.gtmAnalytics.scroll.anchors.splice(0, i);
				}
				setTimeout(function () {
					window.gtmAnalytics.freeze = false;
				}, 13);
			},
		},
		freeze: false,
		windowWidth: window.clientWidth,
		windowHeight: window.clientHeight,
		pageHeight: Math.max(
			document.body.scrollHeight,
			document.documentElement.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.offsetHeight
		),
		pagePosition: window.pageYOffset,
		recount: function () {
			if (window.gtmAnalytics.freeze) return;
			window.gtmAnalytics.freeze = true;
			window.gtmAnalytics.windowWidth = window.innerWidth;
			window.gtmAnalytics.windowHeight = window.innerHeight;
			window.gtmAnalytics.pageHeight = Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight,
				document.body.offsetHeight,
				document.documentElement.offsetHeight
			);
			window.gtmAnalytics.pagePosition = window.pageYOffset;
			setTimeout(function () {
				window.gtmAnalytics.freeze = false;
			}, 13);
		},
	};

	if (_gtmAnalytics.length > 0) {
		for (var i = 0; i < _gtmAnalytics.length; i++) {
			window.gtmAnalytics.push(_gtmAnalytics[i]);
		}
	}
	window.gtmAnalytics.recount();

	document.addEventListener("click", window.gtmAnalytics.click.track, false);
	window.addEventListener("scroll", window.gtmAnalytics.scroll.track, false);
	window.addEventListener("resize", window.gtmAnalytics.recount, false);
})();
