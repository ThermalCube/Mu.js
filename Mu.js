///Mu.js - 2016 © by Nikolai Leesker
//Managed by YuKay-Software-Development
//v0.02a
(function () {

	"use strict";

	//Establish µ and Mu
	window["Mu"] = window["µ"] = function () {

		if (!arguments) return new [];

		//Selector
		var objs = [];
		for (var i = 0, l = arguments.length; i < l; ++i) {

			var arg = arguments[i];
			if (arg === "" || arg === null || arg === undefined) continue;

			if (typeof arg === "object") {
				if (arg.length && arg.length > 0) {
					for (var idx in arg) {
						if (isNaN(idx)) continue;
						objs.push(arg[idx]);
					}
				} else {
					objs.push(arg);
				}
				

			} else {
				var temp = document.querySelectorAll(arg.toString());
				if (temp) {
					objs = objs.concat(Array.prototype.slice.call(temp));
				}
			}
		}

		//forEach
		objs.forEach = function (func) {
			if (!func || !typeof func === "function") return this;

			for (var idx in this) {
				if (isNaN(idx)) continue;
				func.call(null, idx, this[idx]);
			}

			return this;

		}

		//removeAll
		objs.removeAll = function (lambda) {
			if(!lambda || !typeof lambda === "function") return this;
			var spl = [];
			for (var idx in this) {
				if (isNaN(idx)) continue;
				
				if (lambda.call(null, this[idx]) == true) {
					spl.push(idx);
				}
			}
			for (var i = spl.length-1; i >= 0; --i) {
				this.splice(spl[i], 1);
			}
			return this;
		}
		
		//evt
		objs.evt = function (evtName, callback) {
			if (!evtName || !typeof evtName === "string" || !callback || !typeof callback === "function") return this;

			this.forEach(function (idx, elem) {
				elem.addEventListener(evtName, callback, true);
			})

		}

		//evtDel
		objs.evtDel = function (evtName, callback) {
			if (!evtName || !typeof evtName === "string" || !callback || !typeof callback === "function") return this;

			this.forEach(function (idx, elem) {
				elem.removeEventListener(evtName, callback, true);
			})

		}

		//find
		objs.find = function (selector) {

			if (!selector) return this;
			if(!(typeof selector === "string")) return this;

			var match = [];

			function traverse(elem) {
				if (elem.children.length == 0) return;
				for (var idx in elem.children) {
					if (isNaN(idx)) continue;
					if (elem.children[idx].matches(selector)) {
						match = match.concat(elem.children[idx]);
					}
					traverse(elem.children[idx]);
				}
			}

			this.forEach(function (idx, elem) {
				traverse(elem);
			})

			return µ(match);

		}

		return objs;

	};

	window["Mu"].Mu = window["Mu"];
	window["µ"].µ = window["µ"];

	//Variable declaration
	var µ = window["Mu"];//Use µ localy even in .noConflict() mode
	
	//Remove µ from glocal scope
	µ.noConflict = function () {
		delete window["µ"];
		return window["Mu"];
	};

	//List of custom Elements
	µ.custom = [];

	//INTERNAL: Check if browser supports registerElement and add Polyfill if needed
	µ.custom.__check = function () {
		if (!("registerElement" in document)) {
			var x = document.createElement("script");
			x.setAttribute("src", "//cdnjs.cloudflare.com/ajax/libs/document-register-element/0.5.3/document-register-element.js");
			µ("head")[0].appendChild(x);
			return x;
		}
	}

	µ.custom.add = function (name, proto, extend)
