"use strict";

/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/calculator/relativeStrengthIndex.js

The MIT License (MIT)

Copyright (c) 2014-2015 Scott Logic Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var windowSize = _defaultOptions.RSI.period;

	var source = _utils.identity;

	function calculator(data) {

		var prevAvgGain, prevAvgLoss;
		var rsiAlgorithm = (0, _utils.slidingWindow)().windowSize(windowSize).accumulator(function (values) {

			var avgGain = (0, _utils.isDefined)(prevAvgGain) ? (prevAvgGain * (windowSize - 1) + (0, _utils.last)(values).gain) / windowSize : _d2.default.mean(values, function (each) {
				return each.gain;
			});

			var avgLoss = (0, _utils.isDefined)(prevAvgLoss) ? (prevAvgLoss * (windowSize - 1) + (0, _utils.last)(values).loss) / windowSize : _d2.default.mean(values, function (each) {
				return each.loss;
			});

			var relativeStrength = avgGain / avgLoss;
			var rsi = 100 - 100 / (1 + relativeStrength);

			prevAvgGain = avgGain;
			prevAvgLoss = avgLoss;

			return rsi;
		});

		var gainsAndLossesCalculator = (0, _utils.slidingWindow)().windowSize(2).undefinedValue(function () {
			return [0, 0];
		}).accumulator(function (tuple) {
			var prev = tuple[0];
			var now = tuple[1];
			var change = source(now) - source(prev);
			return {
				gain: Math.max(change, 0),
				loss: Math.abs(Math.min(change, 0))
			};
		});

		var gainsAndLosses = gainsAndLossesCalculator(data);

		var rsiData = rsiAlgorithm(gainsAndLosses);

		return rsiData;
	};

	calculator.windowSize = function (x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return calculator;
	};
	calculator.source = function (x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return calculator;
	};

	return calculator;
};

var _d = require("d3");

var _d2 = _interopRequireDefault(_d);

var _utils = require("../../utils");

var _defaultOptions = require("../defaultOptions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }