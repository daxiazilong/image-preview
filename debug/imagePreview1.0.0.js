/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "2c1f4bdf411e9a062f5b";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "imagePreview";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/ts/index.ts")(__webpack_require__.s = "./src/ts/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/index.ts":
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar ImagePreview = (function () {\r\n    function ImagePreview(options) {\r\n        this.options = options;\r\n        this.showTools = true;\r\n        this.lastClick = -Infinity;\r\n        this.curIndex = 0;\r\n        this.imgContainerMoveX = 0;\r\n        this.imgContainerMoveY = 0;\r\n        this.screenWidth = window.innerWidth;\r\n        this.slideTime = 300;\r\n        this.zoomScale = 0.05;\r\n        this.isZooming = false;\r\n        this.isAnimating = false;\r\n        this.isMotionless = true;\r\n        this.prefix = \"__\";\r\n        this.operateMaps = {\r\n            rotateLeft: 'handleRotateLeft',\r\n            rotateRight: 'handleRotateRight'\r\n        };\r\n        if (options.selector) {\r\n            this.bindTrigger();\r\n        }\r\n        this.genFrame();\r\n        this.handleReausetAnimate();\r\n        this.threshold = this.screenWidth / 4;\r\n        this.imgContainer = this.ref.querySelector(\".\" + this.prefix + \"imgContainer\");\r\n        this.imgItems = this.imgContainer.querySelectorAll(\".\" + this.prefix + \"item\");\r\n        this.reCordInitialData(this.imgItems);\r\n        this.maxMoveX = this.screenWidth / 2;\r\n        this.minMoveX = -this.screenWidth * (this.imgsNumber - 0.5);\r\n        this.ref.addEventListener('touchstart', this.handleTouchStart.bind(this));\r\n        this.ref.addEventListener('touchmove', this.handleMove.bind(this));\r\n        this.ref.addEventListener('touchend', this.handleToucnEnd.bind(this));\r\n        this.ref.querySelector(\".\" + this.prefix + \"close\").addEventListener('click', this.close.bind(this));\r\n    }\r\n    ImagePreview.prototype.bindTrigger = function () {\r\n        var images = [];\r\n        var triggerItems = document.querySelectorAll(this.options.selector);\r\n        if (!triggerItems.length) {\r\n        }\r\n        triggerItems.forEach(function (element, index) {\r\n            images.push(element.dataset.src);\r\n        });\r\n        this.options.curImg = images[0];\r\n        this.options.imgs = images;\r\n        var imgPreviewer = this;\r\n        triggerItems.forEach(function (element, index) {\r\n            element.addEventListener('click', function (e) {\r\n                imgPreviewer.show(index);\r\n            });\r\n        });\r\n    };\r\n    ImagePreview.prototype.reCordInitialData = function (els) {\r\n        var _this = this;\r\n        var imgContainerRect = this.imgContainer.getBoundingClientRect();\r\n        var imgContainerHeight = imgContainerRect.height;\r\n        els.forEach(function (el, key, parent) {\r\n            var img = el.querySelector('img');\r\n            var imgRect = img.getBoundingClientRect();\r\n            if (img.complete) {\r\n                var imgContainerRect_1 = _this.imgContainer.getBoundingClientRect();\r\n                var imgContainerHeight_1 = imgContainerRect_1.height;\r\n                var imgContainerWidth = imgContainerRect_1.width;\r\n                var styleObj = el.getBoundingClientRect();\r\n                if (imgContainerHeight_1 < styleObj.height) {\r\n                    el.style.cssText = \"\\n                        height: 100%;\\n                        width: auto;\\n                    \";\r\n                    img.style.cssText = \"\\n                        height: 100%;\\n                        width: auto;\\n                    \";\r\n                }\r\n                styleObj = el.getBoundingClientRect();\r\n                var top_1 = (imgContainerHeight_1 - styleObj.height) / 2;\r\n                var left = (imgContainerWidth - styleObj.width) / 2;\r\n                el.dataset.initialWidth = styleObj.width.toString();\r\n                el.dataset.initialHeight = styleObj.height.toString();\r\n                el.dataset.top = top_1.toString();\r\n                el.dataset.initialTop = top_1.toString();\r\n                el.dataset.left = left.toString();\r\n                el.dataset.initialLeft = left.toString();\r\n                el.dataset.loaded = \"true\";\r\n                el.style.top = top_1 + \"px\";\r\n                el.style.left = left + \"px\";\r\n            }\r\n            else {\r\n                el.dataset.loaded = \"false\";\r\n                img.onload = (function (el) {\r\n                    return function () {\r\n                        var imgContainerRect = this.imgContainer.getBoundingClientRect();\r\n                        var imgContainerHeight = imgContainerRect.height;\r\n                        var imgContainerWidth = imgContainerRect.width;\r\n                        var styleObj = el.getBoundingClientRect();\r\n                        if (imgContainerHeight < styleObj.height) {\r\n                            el.style.cssText = \"\\n                                height: 100%;\\n                                width: auto;\\n                            \";\r\n                            img.style.cssText = \"\\n                                height: 100%;\\n                                width: auto;\\n                            \";\r\n                        }\r\n                        styleObj = el.getBoundingClientRect();\r\n                        var top = (imgContainerHeight - styleObj.height) / 2;\r\n                        var left = (imgContainerWidth - styleObj.width) / 2;\r\n                        el.dataset.initialWidth = styleObj.width.toString();\r\n                        el.dataset.initialHeight = styleObj.height.toString();\r\n                        el.dataset.top = top.toString();\r\n                        el.dataset.initialTop = top.toString();\r\n                        el.dataset.left = left.toString();\r\n                        el.dataset.initialLeft = left.toString();\r\n                        el.dataset.loaded = \"true\";\r\n                        el.style.top = top + \"px\";\r\n                        el.style.left = left + \"px\";\r\n                    };\r\n                })(el).bind(_this);\r\n                img.onerror = (function (el) {\r\n                    return function (e) {\r\n                        var imgContainerRect = this.imgContainer.getBoundingClientRect();\r\n                        var imgContainerHeight = imgContainerRect.height;\r\n                        var styleObj = el.getBoundingClientRect();\r\n                        var top = (imgContainerHeight - styleObj.height) / 2;\r\n                        el.dataset.initialWidth = styleObj.width.toString();\r\n                        el.dataset.initialHeight = styleObj.height.toString();\r\n                        el.dataset.top = top.toString();\r\n                        el.dataset.initialTop = top.toString();\r\n                        el.dataset.loaded = \"false\";\r\n                        el.style.top = top + \"px\";\r\n                        (e.currentTarget).alt = \"图片加载错误\";\r\n                    };\r\n                })(el).bind(_this);\r\n            }\r\n        });\r\n    };\r\n    ImagePreview.prototype.handleTouchStart = function (e) {\r\n        switch (e.touches.length) {\r\n            case 1:\r\n                this.handleOneStart(e);\r\n                break;\r\n            case 2:\r\n                this.handleTwoStart(e);\r\n                break;\r\n            default:\r\n                break;\r\n        }\r\n    };\r\n    ImagePreview.prototype.handleTwoStart = function (e) {\r\n        this.curPoint1 = {\r\n            x: e.touches[0].clientX,\r\n            y: e.touches[0].clientY\r\n        };\r\n        this.curPoint2 = {\r\n            x: e.touches[1].clientX,\r\n            y: e.touches[1].clientY\r\n        };\r\n    };\r\n    ImagePreview.prototype.handleOneStart = function (e) {\r\n        var _this = this;\r\n        var type = (e.target).dataset.type;\r\n        if (this.operateMaps[type]) {\r\n            this[this.operateMaps[type]](e);\r\n            return;\r\n        }\r\n        this.touchStartX = this.startX = Math.round(e.touches[0].clientX);\r\n        this.touchStartY = this.startY = Math.round(e.touches[0].clientY);\r\n        var now = (new Date()).getTime();\r\n        if (now - this.lastClick < 300) {\r\n            clearTimeout(this.performerClick);\r\n            this.handleDoubleClick(e);\r\n        }\r\n        else {\r\n            this.performerClick = setTimeout(function () {\r\n                _this.handleClick(e);\r\n            }, 300);\r\n        }\r\n        this.lastClick = (new Date()).getTime();\r\n    };\r\n    ImagePreview.prototype.handleRotateLeft = function (e) {\r\n        var _this = this;\r\n        var curItem = this.imgItems[this.curIndex];\r\n        var rotateDeg;\r\n        if (curItem.dataset.loaded == 'false') {\r\n            return;\r\n        }\r\n        if (curItem.dataset.rotateDeg) {\r\n            rotateDeg = Number(curItem.dataset.rotateDeg);\r\n        }\r\n        else {\r\n            rotateDeg = 0;\r\n        }\r\n        rotateDeg -= 90;\r\n        this.isAnimating = true;\r\n        curItem.style.cssText += \"\\n            transition: transform 0.5s;\\n            transform: rotateZ( \" + rotateDeg + \"deg );\\n        \";\r\n        curItem.dataset.rotateDeg = rotateDeg.toString();\r\n        setTimeout(function () {\r\n            _this.isAnimating = false;\r\n        }, 550);\r\n    };\r\n    ImagePreview.prototype.handleRotateRight = function (e) {\r\n        var _this = this;\r\n        var curItem = this.imgItems[this.curIndex];\r\n        var rotateDeg;\r\n        if (curItem.dataset.loaded == 'false') {\r\n            return;\r\n        }\r\n        if (curItem.dataset.rotateDeg) {\r\n            rotateDeg = Number(curItem.dataset.rotateDeg);\r\n        }\r\n        else {\r\n            rotateDeg = 0;\r\n        }\r\n        rotateDeg += 90;\r\n        this.isAnimating = true;\r\n        curItem.style.cssText += \"\\n            transition: transform 0.5s;\\n            transform: rotateZ( \" + rotateDeg + \"deg );\\n        \";\r\n        curItem.dataset.rotateDeg = rotateDeg.toString();\r\n        setTimeout(function () {\r\n            _this.isAnimating = false;\r\n        }, 550);\r\n    };\r\n    ImagePreview.prototype.handleClick = function (e) {\r\n        var close = (this.ref.querySelector(\".\" + this.prefix + \"close\"));\r\n        var bottom = (this.ref.querySelector(\".\" + this.prefix + \"bottom\"));\r\n        this.showTools = !this.showTools;\r\n        if (this.showTools) {\r\n            close.style.display = 'block';\r\n            bottom.style.display = 'block';\r\n        }\r\n        else {\r\n            close.style.display = 'none';\r\n            bottom.style.display = 'none';\r\n        }\r\n    };\r\n    ImagePreview.prototype.handleDoubleClick = function (e) {\r\n        if (this.isAnimating)\r\n            return;\r\n        this.isAnimating = true;\r\n        var curItem = this.imgItems[this.curIndex];\r\n        var curImg = curItem.querySelector('img');\r\n        if (curItem.dataset.loaded == 'false') {\r\n            this.isAnimating = false;\r\n            return;\r\n        }\r\n        var curItemWidth = curItem.getBoundingClientRect().width;\r\n        var curItemHeight = curItem.getBoundingClientRect().height;\r\n        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');\r\n        var toWidth;\r\n        var toHeight;\r\n        if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {\r\n            if (curImg.naturalWidth > curItemHeight) {\r\n                toWidth = curImg.naturalHeight;\r\n            }\r\n            else {\r\n                toWidth = curItemHeight;\r\n            }\r\n            if (curImg.naturalHeight > curItemWidth) {\r\n                toHeight = curImg.naturalWidth;\r\n            }\r\n            else {\r\n                toHeight = curItemWidth;\r\n            }\r\n        }\r\n        else {\r\n            if (curImg.naturalWidth > curItemWidth) {\r\n                toWidth = curImg.naturalWidth;\r\n            }\r\n            else {\r\n                toWidth = curItemWidth;\r\n            }\r\n            if (curImg.naturalHeight > curItemHeight) {\r\n                toHeight = curImg.naturalHeight;\r\n            }\r\n            else {\r\n                toHeight = curItemHeight;\r\n            }\r\n        }\r\n        var scaleX;\r\n        var scaleY;\r\n        var isBigSize = curItem.dataset.isEnlargement == \"enlargement\";\r\n        if (isBigSize) {\r\n            switch (Math.abs(rotateDeg % 360)) {\r\n                case 0:\r\n                case 180:\r\n                    scaleX = Number(curItem.dataset.initialWidth) / curItemWidth;\r\n                    scaleY = Number(curItem.dataset.initialHeight) / curItemHeight;\r\n                    break;\r\n                case 90:\r\n                case 270:\r\n                    scaleX = Number(curItem.dataset.initialWidth) / curItemHeight;\r\n                    scaleY = Number(curItem.dataset.initialHeight) / curItemWidth;\r\n                    break;\r\n                default:\r\n                    break;\r\n            }\r\n        }\r\n        else {\r\n            scaleX = toWidth / curItemWidth;\r\n            scaleY = toHeight / curItemHeight;\r\n        }\r\n        ;\r\n        if (scaleX > 1 && scaleY > 1) {\r\n            this.setToNaturalImgSize(scaleX, scaleY, e);\r\n        }\r\n        else if (scaleX < 1 && scaleY < 1) {\r\n            this.setToInitialSize(scaleX, scaleY, e);\r\n        }\r\n        else {\r\n            this.isAnimating = false;\r\n        }\r\n    };\r\n    ImagePreview.prototype.setToNaturalImgSize = function (scaleX, scaleY, e) {\r\n        var _this = this;\r\n        var mouseX = e.touches[0].clientX;\r\n        var mouseY = e.touches[0].clientY;\r\n        var curItem = this.imgItems[this.curIndex];\r\n        var curImg = curItem.querySelector('img');\r\n        var curItemViewTop = curItem.getBoundingClientRect().top;\r\n        var curItemViewLeft = curItem.getBoundingClientRect().left;\r\n        var curItemTop = Number(curItem.dataset.top) || 0;\r\n        var curItemLeft = Number(curItem.dataset.left) || 0;\r\n        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');\r\n        var centerX = Number(curItem.dataset.initialWidth) / 2;\r\n        var centerY = Number(curItem.dataset.initialHeight) / 2;\r\n        var toWidth;\r\n        var toHeight;\r\n        if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {\r\n            toWidth = curImg.naturalHeight;\r\n            toHeight = curImg.naturalWidth;\r\n        }\r\n        else {\r\n            toWidth = curImg.naturalWidth;\r\n            toHeight = curImg.naturalHeight;\r\n        }\r\n        curItem.dataset.viewTopInitial = curItemViewTop.toString();\r\n        curItem.dataset.viewLeftInitial = curItemViewLeft.toString();\r\n        switch (rotateDeg % 360) {\r\n            case 0:\r\n                curItem.style.cssText = \";\\n                    top:\" + curItemTop + \"px;\\n                    left:\" + curItemLeft + \"px;\\n                    transform-origin: \" + centerX + \"px \" + centerY + \"px;\\n                    transform: \\n                        rotateZ(\" + rotateDeg + \"deg) \\n                        scale3d(\" + scaleX + \",\" + scaleY + \",1) \\n                        translateY(\" + (-(mouseY - curItemViewTop - centerY) * (scaleY - 1)) / scaleY + \"px) \\n                        translateX(\" + (-(mouseX - curItemViewLeft - centerX) * (scaleX - 1)) / scaleX + \"px) \\n                    ;\\n                \";\r\n                break;\r\n            case -180:\r\n            case 180:\r\n                curItem.style.cssText = \";\\n                    top:\" + curItemTop + \"px;\\n                    left: \" + curItemLeft + \"px;\\n                    transform-origin: \" + centerX + \"px \" + centerY + \"px;\\n                    transform: \\n                        rotateZ(\" + rotateDeg + \"deg) scale3d(\" + scaleX + \",\" + scaleY + \",1) \\n                        translateY(\" + ((mouseY - curItemViewTop - centerY) * (scaleY - 1)) / scaleY + \"px) \\n                        translateX(\" + ((mouseX - curItemViewLeft - centerX) * (scaleX - 1)) / scaleX + \"px) \\n                    ;\\n                \";\r\n                break;\r\n            case -90:\r\n            case 270:\r\n                curItem.style.cssText = \";\\n                    top: \" + curItemTop + \"px;\\n                    left: \" + curItemLeft + \"px;\\n                    transform-origin: \" + centerX + \"px \" + centerY + \"px ; \\n                    transform: \\n                        rotateZ(\" + rotateDeg + \"deg) \\n                        scale3d(\" + scaleX + \",\" + scaleY + \",1) \\n                        translateX(\" + ((mouseY - curItemViewTop - centerX) * (scaleX - 1)) / scaleX + \"px) \\n                        translateY(\" + (-(mouseX - curItemViewLeft - centerY) * (scaleY - 1)) / scaleY + \"px) \\n                    ;\\n                    \\n                \";\r\n                break;\r\n            case -270:\r\n            case 90:\r\n                curItem.style.cssText = \";\\n                        top: \" + curItemTop + \"px;\\n                        left: \" + curItemLeft + \"px;\\n                        transform-origin: \" + centerX + \"px \" + centerY + \"px ; \\n                        transform: \\n                            rotateZ(\" + rotateDeg + \"deg) \\n                            scale3d(\" + scaleX + \",\" + scaleY + \",1) \\n                            translateX(\" + (-(mouseY - curItemViewTop - centerX) * (scaleX - 1)) / scaleX + \"px) \\n                            translateY(\" + ((mouseX - curItemViewLeft - centerY) * (scaleY - 1)) / scaleY + \"px) \\n                        ;\\n                        \\n                    \";\r\n                break;\r\n            default:\r\n                break;\r\n        }\r\n        curItem.dataset.isEnlargement = 'enlargement';\r\n        var scaledX;\r\n        var scaledY;\r\n        if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {\r\n            scaledX = (mouseX - curItemLeft) * scaleY;\r\n            scaledY = (mouseY - curItemTop) * scaleX;\r\n        }\r\n        else {\r\n            scaledX = (mouseX - curItemLeft) * scaleX;\r\n            scaledY = (mouseY - curItemTop) * scaleY;\r\n        }\r\n        setTimeout(function () {\r\n            if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {\r\n                curItem.style.cssText = \";\\n                    transform: rotateZ(\" + rotateDeg + \"deg);\\n                    width: \" + toHeight + \"px;\\n                    height: \" + toWidth + \"px;\\n                    left: \" + -(scaledX - mouseX) + \"px;\\n                    top: \" + -(scaledY - mouseY) + \"px;\\n                    transition: none;\\n                \";\r\n            }\r\n            else {\r\n                curItem.style.cssText = \";\\n                    transform: rotateZ(\" + rotateDeg + \"deg);\\n                    width: \" + toWidth + \"px;\\n                    height: \" + toHeight + \"px;\\n                    left: \" + -(scaledX - mouseX) + \"px;\\n                    top: \" + -(scaledY - mouseY) + \"px;\\n                    transition: none;\\n                \";\r\n            }\r\n            curItem.dataset.top = \"\" + -(scaledY - mouseY);\r\n            curItem.dataset.left = \"\" + -(scaledX - mouseX);\r\n            _this.isAnimating = false;\r\n        }, 550);\r\n    };\r\n    ImagePreview.prototype.setToInitialSize = function (scaleX, scaleY, e) {\r\n        var _this = this;\r\n        var curItem = this.imgItems[this.curIndex];\r\n        var curItemWidth = curItem.getBoundingClientRect().width;\r\n        var curItemHeight = curItem.getBoundingClientRect().height;\r\n        var curItemViewTop = curItem.getBoundingClientRect().top;\r\n        var curItemViewLeft = curItem.getBoundingClientRect().left;\r\n        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');\r\n        var toWidth;\r\n        var toHeight;\r\n        if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {\r\n            toWidth = curItemHeight;\r\n            toHeight = curItemWidth;\r\n        }\r\n        else {\r\n            toWidth = curItemWidth;\r\n            toHeight = curItemHeight;\r\n        }\r\n        switch (rotateDeg % 360) {\r\n            case 0:\r\n                var centerX = curItemWidth / 2;\r\n                var centerY = curItemHeight / 2;\r\n                var top_2 = Number(curItem.dataset.top);\r\n                var left = Number(curItem.dataset.left) || 0;\r\n                var viewTopInitial = Number(curItem.dataset.initialTop);\r\n                var viewLeftInitial = Number(curItem.dataset.initialLeft);\r\n                var disteanceY = curItemViewTop + (centerY) * (1 - scaleY) - top_2 - viewTopInitial;\r\n                var distanceX = curItemViewLeft + (centerX) * (1 - scaleX) - left - viewLeftInitial;\r\n                curItem.style.cssText = \";\\n                    top:\" + curItem.dataset.top + \"px;\\n                    left:\" + curItem.dataset.left + \"px;\\n                    width: \" + toWidth + \"px;\\n                    height: \" + toHeight + \"px;\\n                    transform-origin: \" + centerX + \"px \" + centerY + \"px;\\n                    transform: \\n                        rotateZ(\" + rotateDeg + \"deg) \\n                        scale3d(\" + scaleX + \",\" + scaleY + \",1) \\n                        translateX(\" + -(left + distanceX) / scaleX + \"px) \\n                        translateY(\" + -(top_2 + disteanceY) / scaleY + \"px)\\n                    ;\\n                \";\r\n                break;\r\n            case 180:\r\n            case -180:\r\n                {\r\n                    var centerX_1 = curItemWidth / 2;\r\n                    var centerY_1 = curItemHeight / 2;\r\n                    var viewTopInitial_1 = Number(curItem.dataset.initialTop);\r\n                    var viewLeftInitial_1 = Number(curItem.dataset.initialLeft);\r\n                    var top_3 = Number(curItem.dataset.top);\r\n                    var left_1 = Number(curItem.dataset.left) || 0;\r\n                    var disteanceY_1 = curItemViewTop + (centerY_1) * (1 - scaleY) - top_3 - viewTopInitial_1;\r\n                    var distanceX_1 = curItemViewLeft + (centerX_1) * (1 - scaleX) - left_1 - viewLeftInitial_1;\r\n                    curItem.style.cssText = \";\\n                        top:\" + top_3 + \"px;\\n                        left:\" + left_1 + \"px;\\n                        width: \" + toWidth + \"px;\\n                        height: \" + toHeight + \"px;\\n                        transform-origin: \" + centerX_1 + \"px \" + centerY_1 + \"px;\\n                        transform: \\n                            rotateZ(\" + rotateDeg + \"deg) \\n                            scale3d(\" + scaleX + \",\" + scaleY + \",1) \\n                            translateX(\" + (left_1 + distanceX_1) / scaleX + \"px) \\n                            translateY(\" + (top_3 + disteanceY_1) / scaleY + \"px)\\n                        ;\\n                    \";\r\n                }\r\n                break;\r\n            case -90:\r\n            case 270:\r\n                {\r\n                    var centerX_2 = curItemHeight / 2;\r\n                    var centerY_2 = curItemWidth / 2;\r\n                    var viewTopInitial_2 = Number(curItem.dataset.viewTopInitial);\r\n                    var viewLeftInitial_2 = Number(curItem.dataset.viewLeftInitial);\r\n                    var top_4 = Number(curItem.dataset.top);\r\n                    var left_2 = Number(curItem.dataset.left);\r\n                    var disteanceY_2 = curItemViewTop + (centerX_2) * (1 - scaleY) - top_4 - viewTopInitial_2;\r\n                    var distanceX_2 = curItemViewLeft + (centerY_2) * (1 - scaleX) - left_2 - viewLeftInitial_2;\r\n                    curItem.style.cssText = \";\\n                        top:\" + top_4 + \"px;\\n                        left:\" + left_2 + \"px;\\n                        width: \" + toWidth + \"px;\\n                        height: \" + toHeight + \"px;\\n                        transform-origin: \" + centerX_2 + \"px \" + centerY_2 + \"px 0;\\n                        transform: \\n                            rotateZ(\" + rotateDeg + \"deg) \\n                            scale3d(\" + scaleX + \",\" + scaleY + \",1) \\n                            translateX(\" + (top_4 + disteanceY_2) / scaleY + \"px) \\n                            translateY(\" + -(left_2 + distanceX_2) / scaleX + \"px)\\n                        ;\\n\\n                    \";\r\n                }\r\n                break;\r\n            case 90:\r\n            case -270:\r\n                {\r\n                    var centerX_3 = curItemHeight / 2;\r\n                    var centerY_3 = curItemWidth / 2;\r\n                    var viewTopInitial_3 = Number(curItem.dataset.viewTopInitial);\r\n                    var viewLeftInitial_3 = Number(curItem.dataset.viewLeftInitial);\r\n                    var top_5 = Number(curItem.dataset.top);\r\n                    var left_3 = Number(curItem.dataset.left);\r\n                    var disteanceY_3 = curItemViewTop + (centerX_3) * (1 - scaleY) - top_5 - viewTopInitial_3;\r\n                    var distanceX_3 = curItemViewLeft + (centerY_3) * (1 - scaleX) - left_3 - viewLeftInitial_3;\r\n                    curItem.style.cssText = \";\\n                        top:\" + top_5 + \"px;\\n                        left:\" + left_3 + \"px;\\n                        width: \" + toWidth + \"px;\\n                        height: \" + toHeight + \"px;\\n                        transform-origin: \" + centerX_3 + \"px \" + centerY_3 + \"px 0;\\n                        transform: \\n                            rotateZ(\" + rotateDeg + \"deg) \\n                            scale3d(\" + scaleX + \",\" + scaleY + \",1) \\n                            translateX(\" + -(top_5 + disteanceY_3) / scaleY + \"px) \\n                            translateY(\" + (left_3 + distanceX_3) / scaleX + \"px)\\n                        ;\\n\\n                    \";\r\n                }\r\n                break;\r\n            default:\r\n                break;\r\n        }\r\n        curItem.dataset.top = curItem.dataset.initialTop;\r\n        curItem.dataset.left = curItem.dataset.initialLeft;\r\n        curItem.dataset.isEnlargement = 'shrink';\r\n        setTimeout(function () {\r\n            curItem.style.cssText = \";\\n                                transform: rotateZ(\" + rotateDeg + \"deg);\\n                                top:\" + Number(curItem.dataset.initialTop) + \"px;\\n                                left: \" + Number(curItem.dataset.initialLeft) + \"px;\\n                                width: \" + curItem.dataset.initialWidth + \"px;\\n                                height: \" + curItem.dataset.initialHeight + \"px;\\n                                transition: none;\\n                                \";\r\n            _this.isAnimating = false;\r\n        }, 550);\r\n    };\r\n    ImagePreview.prototype.handleMove = function (e) {\r\n        e.preventDefault();\r\n        clearTimeout(this.performerClick);\r\n        if (this.isAnimating) {\r\n            return;\r\n        }\r\n        if (e.touches.length == 2) {\r\n            this.handleZoom(e);\r\n            return;\r\n        }\r\n        var curItem = this.imgItems[this.curIndex];\r\n        var isBoundaryLeft = curItem.dataset.toLeft == 'true';\r\n        var isBoundaryRight = curItem.dataset.toRight == 'true';\r\n        var direction = e.touches[0].clientX - this.startX > 0 ? 'right' : 'left';\r\n        this.isMotionless = false;\r\n        if (curItem.dataset.isEnlargement == 'enlargement') {\r\n            if ((isBoundaryLeft && direction == 'right') || (isBoundaryRight && direction == 'left')) {\r\n                this.handleMoveNormal(e);\r\n            }\r\n            else {\r\n                this.handleMoveEnlage(e);\r\n            }\r\n        }\r\n        else {\r\n            this.handleMoveNormal(e);\r\n        }\r\n    };\r\n    ImagePreview.prototype.handleMoveNormal = function (e) {\r\n        var curX = Math.round(e.touches[0].clientX);\r\n        var offset = curX - this.startX;\r\n        this.imgContainerMoveX += offset;\r\n        if (this.imgContainerMoveX > this.maxMoveX) {\r\n            this.imgContainerMoveX = this.maxMoveX;\r\n        }\r\n        else if (this.imgContainerMoveX < this.minMoveX) {\r\n            this.imgContainerMoveX = this.minMoveX;\r\n        }\r\n        this.startX = curX;\r\n        this.imgContainer.style.transform = \"translateX(\" + this.imgContainerMoveX + \"px)\";\r\n    };\r\n    ImagePreview.prototype.handleMoveEnlage = function (e) {\r\n        var imgContainerRect = this.imgContainer.getBoundingClientRect();\r\n        var conWidth = imgContainerRect.width;\r\n        var conHeight = imgContainerRect.height;\r\n        var curItem = this.imgItems[this.curIndex];\r\n        if (curItem.dataset.loaded == 'false') {\r\n            return;\r\n        }\r\n        var curItemWidth = curItem.getBoundingClientRect().width;\r\n        var curItemHeihgt = curItem.getBoundingClientRect().height;\r\n        var curX = Math.round(e.touches[0].clientX);\r\n        var curY = Math.round(e.touches[0].clientY);\r\n        var offsetX = curX - this.startX;\r\n        var offsetY = curY - this.startY;\r\n        var curItemTop = Number(curItem.dataset.top);\r\n        var curItemLeft = Number(curItem.dataset.left);\r\n        var curTop;\r\n        var curLeft;\r\n        if (curItemWidth > conWidth) {\r\n            curLeft = curItemLeft + offsetX;\r\n        }\r\n        else {\r\n            curLeft = curItemLeft;\r\n        }\r\n        if (curItemHeihgt > conHeight) {\r\n            curTop = curItemTop + offsetY;\r\n        }\r\n        else {\r\n            curTop = curItemTop;\r\n        }\r\n        curItem.style.cssText += \"\\n            top: \" + curTop + \"px;\\n            left: \" + curLeft + \"px;\\n        \";\r\n        curItem.dataset.top = (curTop).toString();\r\n        curItem.dataset.left = (curLeft).toString();\r\n        this.startX = curX;\r\n        this.startY = curY;\r\n    };\r\n    ImagePreview.prototype.handleZoom = function (e) {\r\n        if (!this.isZooming) {\r\n            this.curStartPoint1 = {\r\n                x: this.curPoint1.x,\r\n                y: this.curPoint1.y\r\n            };\r\n            this.curStartPoint2 = {\r\n                x: this.curPoint2.x,\r\n                y: this.curPoint2.y\r\n            };\r\n        }\r\n        this.isZooming = true;\r\n        this.isAnimating = true;\r\n        var curItem = this.imgItems[this.curIndex];\r\n        if (curItem.dataset.loaded == 'false') {\r\n            this.isAnimating = false;\r\n            return;\r\n        }\r\n        if (curItem.dataset.isEnlargement !== 'enlargement') {\r\n            var curItemViewTop = curItem.getBoundingClientRect().top;\r\n            var curItemViewLeft = curItem.getBoundingClientRect().left;\r\n            curItem.dataset.viewTopInitial = curItemViewTop.toString();\r\n            curItem.dataset.viewLeftInitial = curItemViewLeft.toString();\r\n        }\r\n        var curItemWidth = curItem.getBoundingClientRect().width;\r\n        var curItemHeihgt = curItem.getBoundingClientRect().height;\r\n        var distaceBefore = Math.sqrt(Math.pow(this.curPoint1.x - this.curPoint2.x, 2) + Math.pow(this.curPoint1.y - this.curPoint2.y, 2));\r\n        var distanceNow = Math.sqrt(Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) + Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2));\r\n        var top = Number(curItem.dataset.top) || 0;\r\n        var left = Number(curItem.dataset.left) || 0;\r\n        var centerX = (this.curStartPoint1.x + this.curStartPoint2.x) / 2 - left;\r\n        var centerY = (this.curStartPoint1.y + this.curStartPoint2.y) / 2 - top;\r\n        this.curPoint1.x = e.touches[0].clientX;\r\n        this.curPoint1.y = e.touches[0].clientY;\r\n        this.curPoint2.x = e.touches[1].clientX;\r\n        this.curPoint2.y = e.touches[1].clientY;\r\n        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');\r\n        if (distaceBefore > distanceNow) {\r\n            var centerX_4 = (this.curStartPoint1.x + this.curStartPoint2.x) / 2 - left;\r\n            var centerY_4 = (this.curStartPoint1.y + this.curStartPoint2.y) / 2 - top;\r\n            curItem.dataset.top = (top + (this.zoomScale) * centerY_4).toString();\r\n            curItem.dataset.left = (left + (this.zoomScale) * centerX_4).toString();\r\n            var width = curItemWidth * (1 - this.zoomScale);\r\n            var height = curItemHeihgt * (1 - this.zoomScale);\r\n            switch (Math.abs(rotateDeg % 360)) {\r\n                case 0:\r\n                case 180:\r\n                    if (width <= Number(curItem.dataset.initialWidth)) {\r\n                        width = Number(curItem.dataset.initialWidth);\r\n                        height = Number(curItem.dataset.initialHeight);\r\n                        curItem.dataset.top = curItem.dataset.initialTop;\r\n                        curItem.dataset.left = curItem.dataset.initialLeft;\r\n                        curItem.dataset.isEnlargement = 'shrink';\r\n                    }\r\n                    break;\r\n                case 90:\r\n                case 270:\r\n                    if (height <= Number(curItem.dataset.initialWidth)) {\r\n                        width = Number(curItem.dataset.initialHeight);\r\n                        height = Number(curItem.dataset.initialWidth);\r\n                        curItem.dataset.top = curItem.dataset.initialTop;\r\n                        curItem.dataset.left = curItem.dataset.initialLeft;\r\n                        curItem.dataset.isEnlargement = 'shrink';\r\n                    }\r\n                    break;\r\n            }\r\n            switch (Math.abs(rotateDeg % 360)) {\r\n                case 0:\r\n                case 180:\r\n                    curItem.style.cssText = \"\\n                            transform: rotateZ(\" + rotateDeg + \"deg); \\n                            width: \" + width + \"px;\\n                            height: \" + height + \"px;\\n                            top: \" + curItem.dataset.top + \"px;\\n                            left: \" + curItem.dataset.left + \"px;\\n                    \";\r\n                    break;\r\n                case 90:\r\n                case 270:\r\n                    curItem.style.cssText = \"\\n                            transform: rotateZ(\" + rotateDeg + \"deg); \\n                            height: \" + width + \"px;\\n                            width: \" + height + \"px;\\n                            left: \" + curItem.dataset.left + \"px;\\n                            top: \" + curItem.dataset.top + \"px;\\n                    \";\r\n                    break;\r\n                default:\r\n                    break;\r\n            }\r\n        }\r\n        else if (distaceBefore < distanceNow) {\r\n            curItem.dataset.isEnlargement = 'enlargement';\r\n            curItem.dataset.top = (top - (this.zoomScale) * centerY).toString();\r\n            curItem.dataset.left = (left - (this.zoomScale) * centerX).toString();\r\n            switch (Math.abs(rotateDeg % 360)) {\r\n                case 0:\r\n                case 180:\r\n                    curItem.style.cssText += \"\\n                            width: \" + curItemWidth * (1 + this.zoomScale) + \"px;\\n                            height: \" + curItemHeihgt * (1 + this.zoomScale) + \"px;\\n                            top: \" + curItem.dataset.top + \"px;\\n                            left: \" + curItem.dataset.left + \"px;\\n                    \";\r\n                    break;\r\n                case 90:\r\n                case 270:\r\n                    curItem.style.cssText += \"\\n                            height: \" + curItemWidth * (1 + this.zoomScale) + \"px;\\n                            width: \" + curItemHeihgt * (1 + this.zoomScale) + \"px;\\n                            left: \" + curItem.dataset.left + \"px;\\n                            top: \" + curItem.dataset.top + \"px;\\n                    \";\r\n                    break;\r\n                default:\r\n                    break;\r\n            }\r\n        }\r\n        this.isAnimating = false;\r\n    };\r\n    ImagePreview.prototype.handleToucnEnd = function (e) {\r\n        if (this.isAnimating || e.changedTouches.length !== 1 || this.isMotionless) {\r\n            return;\r\n        }\r\n        var type = (e.target).dataset.type;\r\n        if (this.operateMaps[type]) {\r\n            return;\r\n        }\r\n        if (e.touches.length == 0) {\r\n            this.isZooming = false;\r\n        }\r\n        var curItem = this.imgItems[this.curIndex];\r\n        this.isMotionless = true;\r\n        var isBoundary = curItem.dataset.toLeft == 'true' || curItem.dataset.toRight == 'true';\r\n        if (curItem.dataset.isEnlargement == 'enlargement') {\r\n            if (isBoundary) {\r\n                this.handleTEndEnNormal(e);\r\n                curItem.dataset.toLeft = 'false';\r\n                curItem.dataset.toRight = 'false';\r\n            }\r\n            else {\r\n                this.handleTEndEnlarge(e);\r\n            }\r\n        }\r\n        else {\r\n            this.handleTEndEnNormal(e);\r\n        }\r\n    };\r\n    ImagePreview.prototype.handleTEndEnlarge = function (e) {\r\n        var imgContainerRect = this.imgContainer.getBoundingClientRect();\r\n        var conWidth = imgContainerRect.width;\r\n        var conHeight = imgContainerRect.height;\r\n        var curItem = this.imgItems[this.curIndex];\r\n        var curImg = curItem.querySelector('img');\r\n        var curItemWidth = curItem.getBoundingClientRect().width;\r\n        var curItemHeihgt = curItem.getBoundingClientRect().height;\r\n        var offsetX = 0;\r\n        var offsetY = 0;\r\n        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');\r\n        switch (Math.abs(rotateDeg % 360)) {\r\n            case 90:\r\n            case 270:\r\n                offsetX = (curItemWidth - curItemHeihgt) / 2;\r\n                offsetY = (curItemHeihgt - curItemWidth) / 2;\r\n                break;\r\n            default:\r\n                break;\r\n        }\r\n        var maxTop = offsetY;\r\n        var minTop = conHeight - curItemHeihgt + offsetY;\r\n        var maxLeft = offsetX;\r\n        var minLeft = conWidth - curItemWidth + offsetX;\r\n        var curItemTop = Number(curItem.dataset.top);\r\n        var curItemLeft = Number(curItem.dataset.left);\r\n        var recoverY = false;\r\n        var recoverX = false;\r\n        var vy;\r\n        var stepY;\r\n        var vx;\r\n        var stepX;\r\n        var startX;\r\n        var endX;\r\n        var startY;\r\n        var endY;\r\n        if (curItemLeft > maxLeft) {\r\n            stepX = this.computeStep(curItemLeft - maxLeft, this.slideTime);\r\n            startX = curItemLeft;\r\n            endX = maxLeft;\r\n            recoverX = true;\r\n        }\r\n        else if (curItemLeft < minLeft) {\r\n            stepX = this.computeStep(curItemLeft - minLeft, this.slideTime);\r\n            startX = curItemLeft;\r\n            endX = minLeft;\r\n            recoverX = true;\r\n        }\r\n        if (curItemTop > maxTop) {\r\n            stepY = this.computeStep((curItemTop - maxTop), this.slideTime);\r\n            startY = curItemTop;\r\n            endY = maxTop;\r\n            recoverY = true;\r\n        }\r\n        else if (curItemTop < minTop) {\r\n            stepY = this.computeStep((curItemTop - minTop), this.slideTime);\r\n            startY = curItemTop;\r\n            endY = minTop;\r\n            recoverY = true;\r\n        }\r\n        if (curItemWidth <= conWidth) {\r\n            recoverX = false;\r\n            curItem.dataset.toLeft = 'true';\r\n            curItem.dataset.toRight = 'true';\r\n        }\r\n        if (curItemHeihgt <= conHeight) {\r\n            recoverY = false;\r\n            curItem.dataset.toTop = 'true';\r\n            curItem.dataset.toBottom = 'true';\r\n        }\r\n        if (recoverX && recoverY) {\r\n            this.animateMultiValue(curItem, [\r\n                {\r\n                    prop: 'left',\r\n                    start: startX,\r\n                    end: endX,\r\n                    step: -stepX\r\n                }, {\r\n                    prop: 'top',\r\n                    start: startY,\r\n                    end: endY,\r\n                    step: -stepY\r\n                }\r\n            ]);\r\n            curItem.dataset.left = \"\" + endX;\r\n            curItem.dataset.top = \"\" + endY;\r\n            if (endX == maxLeft) {\r\n                curItem.dataset.toLeft = 'true';\r\n                curItem.dataset.toRight = 'false';\r\n            }\r\n            else if (endX == minLeft) {\r\n                curItem.dataset.toLeft = 'false';\r\n                curItem.dataset.toRight = 'true';\r\n            }\r\n            if (endY == maxTop) {\r\n                curItem.dataset.toTop = 'true';\r\n                curItem.dataset.toBottom = 'false';\r\n            }\r\n            else if (endY == minTop) {\r\n                curItem.dataset.toTop = 'false';\r\n                curItem.dataset.toBottom = 'true';\r\n            }\r\n        }\r\n        else if (recoverX) {\r\n            this.animate(curItem, 'left', startX, endX, -stepX);\r\n            curItem.dataset.left = \"\" + endX;\r\n            if (endX == maxLeft) {\r\n                curItem.dataset.toLeft = 'true';\r\n                curItem.dataset.toRight = 'false';\r\n            }\r\n            else if (endX == minLeft) {\r\n                curItem.dataset.toLeft = 'false';\r\n                curItem.dataset.toRight = 'true';\r\n            }\r\n        }\r\n        else if (recoverY) {\r\n            this.animate(curItem, 'top', startY, endY, -stepY);\r\n            curItem.dataset.top = \"\" + endY;\r\n            if (endY == maxTop) {\r\n                curItem.dataset.toTop = 'true';\r\n                curItem.dataset.toBottom = 'false';\r\n            }\r\n            else if (endY == minTop) {\r\n                curItem.dataset.toTop = 'false';\r\n                curItem.dataset.toBottom = 'true';\r\n            }\r\n        }\r\n        else {\r\n            curItem.dataset.toLeft = 'false';\r\n            curItem.dataset.toRight = 'false';\r\n            curItem.dataset.toTop = 'false';\r\n            curItem.dataset.toBottom = 'false';\r\n        }\r\n    };\r\n    ImagePreview.prototype.handleTEndEnNormal = function (e) {\r\n        var endX = Math.round(e.changedTouches[0].clientX);\r\n        if (endX - this.touchStartX >= this.threshold) {\r\n            if (this.curIndex == 0) {\r\n                this.slideSelf();\r\n                return;\r\n            }\r\n            this.curIndex--;\r\n            this.slidePrev();\r\n        }\r\n        else if (endX - this.touchStartX <= -this.threshold) {\r\n            if (this.curIndex + 1 == this.imgsNumber) {\r\n                this.slideSelf();\r\n                return;\r\n            }\r\n            this.curIndex++;\r\n            this.slideNext();\r\n        }\r\n        else {\r\n            this.slideSelf();\r\n        }\r\n    };\r\n    ImagePreview.prototype.slideNext = function () {\r\n        var endX = -(this.curIndex * this.screenWidth);\r\n        if (endX < -(this.screenWidth * this.imgsNumber - 1)) {\r\n            endX = -(this.screenWidth * this.imgsNumber - 1);\r\n            this.curIndex = this.imgsNumber - 1;\r\n        }\r\n        var step = this.computeStep(Math.abs(endX - this.imgContainerMoveX), this.slideTime);\r\n        this.animate(this.imgContainer, 'transform', this.imgContainerMoveX, endX, -step);\r\n    };\r\n    ImagePreview.prototype.slidePrev = function () {\r\n        var endX = -(this.curIndex * this.screenWidth);\r\n        if (endX > 0) {\r\n            endX = 0;\r\n            this.curIndex = 0;\r\n        }\r\n        var step = this.computeStep(Math.abs(endX - this.imgContainerMoveX), this.slideTime);\r\n        this.animate(this.imgContainer, 'transform', this.imgContainerMoveX, endX, step);\r\n    };\r\n    ImagePreview.prototype.slideSelf = function () {\r\n        var endX = -(this.curIndex * this.screenWidth);\r\n        if (endX < this.imgContainerMoveX) {\r\n            var step = this.computeStep(Math.abs(endX - this.imgContainerMoveX), this.slideTime);\r\n            this.animate(this.imgContainer, 'transform', this.imgContainerMoveX, endX, -step);\r\n        }\r\n        else {\r\n            var step = this.computeStep(Math.abs(endX - this.imgContainerMoveX), this.slideTime);\r\n            this.animate(this.imgContainer, 'transform', this.imgContainerMoveX, endX, step);\r\n        }\r\n    };\r\n    ImagePreview.prototype.animate = function (el, prop, start, end, step) {\r\n        var _this = this;\r\n        if (this.isAnimating) {\r\n            return;\r\n        }\r\n        this.isAnimating = true;\r\n        if (Math.abs(end - start) < Math.abs(step)) {\r\n            step = end - start;\r\n        }\r\n        function processStyle() {\r\n            switch (prop) {\r\n                case 'transform':\r\n                    el.style.transform = \"translateX( \" + (start + step) + \"px )\";\r\n                    ;\r\n                    break;\r\n                case 'top':\r\n                    el.style.top = start + step + \"px\";\r\n                    break;\r\n                case 'left':\r\n                    el.style.left = start + step + \"px\";\r\n                    break;\r\n                default:\r\n                    break;\r\n            }\r\n        }\r\n        processStyle();\r\n        start += step;\r\n        var move = function () {\r\n            if (Math.abs(end - start) < Math.abs(step)) {\r\n                step = end - start;\r\n            }\r\n            processStyle();\r\n            start += step;\r\n            if (start !== end) {\r\n                requestAnimationFrame(move);\r\n            }\r\n            else {\r\n                if (prop == 'transform') {\r\n                    _this.imgContainerMoveX = end;\r\n                }\r\n                _this.isAnimating = false;\r\n            }\r\n        };\r\n        if (start !== end) {\r\n            requestAnimationFrame(move);\r\n        }\r\n        else {\r\n            if (prop == 'transform') {\r\n                this.imgContainerMoveX = end;\r\n            }\r\n            this.isAnimating = false;\r\n        }\r\n    };\r\n    ImagePreview.prototype.animateMultiValue = function (el, options) {\r\n        var _this = this;\r\n        if (this.isAnimating) {\r\n            return;\r\n        }\r\n        this.isAnimating = true;\r\n        for (var i = 0, L = options.length; i < L; i++) {\r\n            var item = options[i];\r\n        }\r\n        var processStyle = function () {\r\n            var isFullFilled = true;\r\n            for (var i = 0, L = options.length; i < L; i++) {\r\n                var item = options[i];\r\n                if (Math.abs(item.start - item.end) < Math.abs(item.step)) {\r\n                    item.step = item.end - item.start;\r\n                }\r\n                item.start += item.step;\r\n                el.style[item.prop] = item.start + \"px\";\r\n                if (item.start !== item.end) {\r\n                    isFullFilled = false;\r\n                }\r\n            }\r\n            if (isFullFilled) {\r\n                _this.isAnimating = false;\r\n            }\r\n            else {\r\n                requestAnimationFrame(processStyle);\r\n            }\r\n        };\r\n        processStyle();\r\n    };\r\n    ImagePreview.prototype.computeStep = function (displacement, time) {\r\n        var v = displacement / time;\r\n        var frequency = 1000 / 60;\r\n        return v * frequency;\r\n    };\r\n    ImagePreview.prototype.genFrame = function () {\r\n        var _this = this;\r\n        var curImg = this.options.curImg;\r\n        var images = this.options.imgs;\r\n        if (!images || !images.length) {\r\n            console.error(\"没图，玩你麻痹\");\r\n            return;\r\n        }\r\n        this.imgsNumber = images.length;\r\n        var index = images.indexOf(curImg);\r\n        var imagesHtml = '';\r\n        if (index == -1) {\r\n            index = 0;\r\n        }\r\n        this.curIndex = index;\r\n        this.imgContainerMoveX = -(index * this.screenWidth);\r\n        images.forEach(function (src) {\r\n            imagesHtml += \"\\n            <div class=\\\"\" + _this.prefix + \"itemWraper\\\">\\n                <div class=\\\"\" + _this.prefix + \"item\\\">\\n                    <img src=\\\"\" + src + \"\\\">\\n                </div>\\n            </div>\\n            \";\r\n        });\r\n        var html = \"\\n                <div class=\\\"\" + this.prefix + \"close\\\">\\n                    <svg t=\\\"1563161688682\\\" class=\\\"icon\\\" viewBox=\\\"0 0 1024 1024\\\" version=\\\"1.1\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" p-id=\\\"5430\\\">\\n                        <path d=\\\"M10.750656 1013.12136c-13.822272-13.822272-13.822272-36.347457 0-50.169729l952.200975-952.200975c13.822272-13.822272 36.347457-13.822272 50.169729 0 13.822272 13.822272 13.822272 36.347457 0 50.169729l-952.200975 952.200975c-14.334208 14.334208-36.347457 14.334208-50.169729 0z\\\" fill=\\\"#ffffff\\\" p-id=\\\"5431\\\"></path><path d=\\\"M10.750656 10.750656c13.822272-13.822272 36.347457-13.822272 50.169729 0L1013.633296 963.463567c13.822272 13.822272 13.822272 36.347457 0 50.169729-13.822272 13.822272-36.347457 13.822272-50.169729 0L10.750656 60.920385c-14.334208-14.334208-14.334208-36.347457 0-50.169729z\\\" fill=\\\"#ffffff\\\" p-id=\\\"5432\\\">\\n                        </path>\\n                    </svg>\\n                </div>\\n                <div class=\\\"\" + this.prefix + \"imgContainer\\\">\\n                    \" + imagesHtml + \"\\n                </div>\\n                <div class=\\\"\" + this.prefix + \"bottom\\\">\\n                    <div class=\\\"\" + this.prefix + \"item \\\">\\n                        <svg data-type=\\\"rotateLeft\\\" t=\\\"1563884004339\\\" class=\\\"icon\\\" viewBox=\\\"0 0 1024 1024\\\" version=\\\"1.1\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" p-id=\\\"1099\\\" width=\\\"200\\\" height=\\\"200\\\"><path d=\\\"M520.533333 285.866667c140.8 12.8 251.733333 132.266667 251.733334 277.333333 0 153.6-123.733333 277.333333-277.333334 277.333333-98.133333 0-192-55.466667-238.933333-140.8-4.266667-8.533333-4.266667-21.333333 8.533333-29.866666 8.533333-4.266667 21.333333-4.266667 29.866667 8.533333 42.666667 72.533333 119.466667 119.466667 204.8 119.466667 128 0 234.666667-106.666667 234.666667-234.666667s-98.133333-230.4-226.133334-234.666667l64 102.4c4.266667 8.533333 4.266667 21.333333-8.533333 29.866667-8.533333 4.266667-21.333333 4.266667-29.866667-8.533333l-89.6-145.066667c-4.266667-8.533333-4.266667-21.333333 8.533334-29.866667L597.333333 187.733333c8.533333-4.266667 21.333333-4.266667 29.866667 8.533334 4.266667 8.533333 4.266667 21.333333-8.533333 29.866666l-98.133334 59.733334z\\\" p-id=\\\"1100\\\" fill=\\\"#ffffff\\\"></path></svg>\\n                    </div>\\n                    <div class=\\\"\" + this.prefix + \"item\\\">\\n                        <svg data-type=\\\"rotateRight\\\" t=\\\"1563884064737\\\" class=\\\"icon\\\" viewBox=\\\"0 0 1024 1024\\\" version=\\\"1.1\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" p-id=\\\"1251\\\" width=\\\"200\\\" height=\\\"200\\\"><path d=\\\"M503.466667 285.866667L405.333333 226.133333c-8.533333-8.533333-12.8-21.333333-8.533333-29.866666 8.533333-8.533333 21.333333-12.8 29.866667-8.533334l145.066666 89.6c8.533333 4.266667 12.8 17.066667 8.533334 29.866667l-89.6 145.066667c-4.266667 8.533333-17.066667 12.8-29.866667 8.533333-8.533333-4.266667-12.8-17.066667-8.533333-29.866667l64-102.4c-123.733333 4.266667-226.133333 106.666667-226.133334 234.666667s106.666667 234.666667 234.666667 234.666667c85.333333 0 162.133333-46.933333 204.8-119.466667 4.266667-8.533333 17.066667-12.8 29.866667-8.533333 8.533333 4.266667 12.8 17.066667 8.533333 29.866666-51.2 85.333333-140.8 140.8-238.933333 140.8-153.6 0-277.333333-123.733333-277.333334-277.333333 0-145.066667 110.933333-264.533333 251.733334-277.333333z\\\" p-id=\\\"1252\\\" fill=\\\"#ffffff\\\"></path></svg>\\n                    </div>\\n                </div>\\n        \";\r\n        var style = \"\\n            .\" + this.prefix + \"imagePreviewer{\\n                position: fixed;\\n                top: 100% ;\\n                left: 100%;\\n                width: 100%;\\n                height: 100%;\\n                background: rgba(0,0,0,1);\\n                color:#fff;\\n                transform: translate3d(0,0,0);\\n                transition: left 0.5s;\\n                overflow:hidden;\\n            }\\n            .\" + this.prefix + \"imagePreviewer .\" + this.prefix + \"close{\\n                position: absolute;\\n                top: 20px;\\n                right: 20px;\\n                z-index: 1;\\n                box-sizing: border-box;\\n                width: 22px;\\n                height: 22px;\\n                cursor:pointer;\\n            }\\n            .\" + this.prefix + \"imagePreviewer .\" + this.prefix + \"close svg{\\n                width: 100%;\\n                height: 100%;             \\n            }\\n            .\" + this.prefix + \"imagePreviewer svg{\\n                overflow:visible;\\n            }\\n            .\" + this.prefix + \"imagePreviewer svg path{\\n                stroke: #948888;\\n                stroke-width: 30px;\\n            }\\n            \\n            .\" + this.prefix + \"imagePreviewer \" + this.prefix + \".close.\" + this.prefix + \"scroll{\\n                height: 0;\\n            }\\n            .\" + this.prefix + \"imagePreviewer .\" + this.prefix + \"imgContainer{\\n                position: relative;\\n                transform: translateX( \" + this.imgContainerMoveX + \"px );\\n                height: 100%;\\n                font-size: 0;\\n                white-space: nowrap;\\n            }\\n            .\" + this.prefix + \"imagePreviewer .\" + this.prefix + \"itemWraper{\\n                box-sizing:border-box;\\n                position: relative;\\n                display:inline-block;\\n                width: 100%;\\n                height: 100%;\\n                overflow:hidden;\\n            }\\n            .\" + this.prefix + \"imagePreviewer .\" + this.prefix + \"imgContainer .\" + this.prefix + \"item{\\n                box-sizing:border-box;\\n                position: absolute;\\n                width: 100%;\\n                height: auto;\\n                font-size: 14px;\\n                white-space: normal;\\n                transition: transform 0.5s;\\n                border: 1px solid red;\\n            }\\n            .\" + this.prefix + \"imagePreviewer .\" + this.prefix + \"item img{\\n                width: 100%;\\n                height: auto;\\n            }\\n            .\" + this.prefix + \"imagePreviewer .\" + this.prefix + \"bottom{\\n                position: absolute;\\n                bottom: 0;\\n                left: 20px;\\n                right: 20px;\\n                padding:10px;\\n                text-align: center;\\n                border-top: 1px solid rgba(255, 255, 255, .2);\\n            }\\n            .\" + this.prefix + \"imagePreviewer .\" + this.prefix + \"bottom .\" + this.prefix + \"item{\\n                display:inline-block;\\n                width: 22px;\\n                height: 22px;\\n                margin-right: 10px;\\n                cursor:pointer;\\n            }\\n            .\" + this.prefix + \"imagePreviewer .\" + this.prefix + \"bottom .\" + this.prefix + \"item svg{\\n                width: 100%;\\n                height: 100%;\\n            }\\n        \";\r\n        this.ref = document.createElement('div');\r\n        this.ref.className = this.prefix + \"imagePreviewer\";\r\n        this.ref.innerHTML = html;\r\n        var styleElem = document.createElement('style');\r\n        styleElem.innerHTML = style;\r\n        document.querySelector('head').appendChild(styleElem);\r\n        document.body.appendChild(this.ref);\r\n    };\r\n    ImagePreview.prototype.handleReausetAnimate = function () {\r\n        if (!window['requestAnimationFrame']) {\r\n            window['requestAnimationFrame'] = (function () {\r\n                return window['webkitRequestAnimationFrame'] ||\r\n                    function (callback) {\r\n                        window.setTimeout(callback, 1000 / 60);\r\n                        return 0;\r\n                    };\r\n            })();\r\n        }\r\n    };\r\n    ImagePreview.prototype.close = function (e) {\r\n        e.stopImmediatePropagation();\r\n        clearTimeout(this.performerClick);\r\n        this.ref.style.cssText = \"\\n            left: 100%;\\n            top:0%;\\n        \";\r\n    };\r\n    ImagePreview.prototype.show = function (index) {\r\n        this.curIndex = index;\r\n        this.imgContainerMoveX = -index * this.screenWidth;\r\n        this.imgContainer.style.transform = \"translateX( \" + this.imgContainerMoveX + \"px )\";\r\n        this.ref.style.cssText = \"\\n            top: 0%;\\n            left: 0%;\\n        \";\r\n    };\r\n    return ImagePreview;\r\n}());\r\nexports.default = ImagePreview;\r\nfunction showDebugger(msg) {\r\n    var stat = document.getElementById('stat');\r\n    stat.innerHTML = \"<pre>\" + msg + \"</pre>\";\r\n}\r\n\n\n//# sourceURL=webpack:///./src/ts/index.ts?");

/***/ })

/******/ });