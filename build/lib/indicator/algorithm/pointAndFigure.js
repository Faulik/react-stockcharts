"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var reversal = _defaultOptions.PointAndFigure.reversal;
	var boxSize = _defaultOptions.PointAndFigure.boxSize;
	var source = _defaultOptions.PointAndFigure.source;
	var dateAccessor = _defaultOptions.PointAndFigure.dateAccessor;
	var dateMutator = _defaultOptions.PointAndFigure.dateMutator;
	var indexMutator = _defaultOptions.PointAndFigure.indexMutator;
	var indexAccessor = _defaultOptions.PointAndFigure.indexAccessor;


	function calculator(rawData) {
		var pricingMethod = source;

		var columnData = [];

		var column = {
			boxes: [],
			open: rawData[0].open
		},
		    box = createBox(rawData[0], dateAccessor, dateMutator);

		indexMutator(column, 0);
		columnData.push(column);

		rawData.forEach(function (d) {
			column.volume = (column.volume || 0) + d.volume;

			if (!box.startOfYear) {
				box.startOfYear = d.startOfYear;
				if (box.startOfYear) {
					dateMutator(box, dateAccessor(d));
					// box.displayDate = d.displayDate;
				}
			}

			if (!box.startOfYear && !box.startOfQuarter) {
				box.startOfQuarter = d.startOfQuarter;
				if (box.startOfQuarter && !box.startOfYear) {
					dateMutator(box, dateAccessor(d));
					// box.displayDate = d.displayDate;
				}
			}

			if (!box.startOfQuarter && !box.startOfMonth) {
				box.startOfMonth = d.startOfMonth;
				if (box.startOfMonth && !box.startOfQuarter) {
					dateMutator(box, dateAccessor(d));
					// box.displayDate = d.displayDate;
				}
			}
			if (!box.startOfMonth && !box.startOfWeek) {
				box.startOfWeek = d.startOfWeek;
				if (box.startOfWeek && !box.startOfMonth) {
					dateMutator(box, dateAccessor(d));
					// box.displayDate = d.displayDate;
				}
			}

			if (columnData.length === 1 && column.boxes.length === 0) {
				var upwardMovement = Math.max(pricingMethod(d).high - column.open, 0); // upward movement
				var downwardMovement = Math.abs(Math.min(column.open - pricingMethod(d).low, 0)); // downward movement
				column.direction = upwardMovement > downwardMovement ? 1 : -1;
				if (boxSize * reversal < upwardMovement || boxSize * reversal < downwardMovement) {
					// enough movement to trigger a reversal
					box.toDate = dateAccessor(d);
					box.open = column.open;
					var noOfBoxes = column.direction > 0 ? Math.floor(upwardMovement / boxSize) : Math.floor(downwardMovement / boxSize);
					for (var i = 0; i < noOfBoxes; i++) {
						box.close = box.open + column.direction * boxSize;
						var _prevBoxClose = box.close;
						column.boxes.push(box);
						box = createBox(box, dateAccessor, dateMutator);
						// box = cloneMe(box);
						box.open = _prevBoxClose;
					}
					box.fromDate = dateAccessor(d);
					box.date = dateAccessor(d);
				}
			} else {
				// one or more boxes already formed in the current column
				var _upwardMovement = Math.max(pricingMethod(d).high - box.open, 0); // upward movement
				var _downwardMovement = Math.abs(Math.min(pricingMethod(d).low - box.open, 0)); // downward movement

				if (column.direction > 0 && _upwardMovement > boxSize || /* rising column AND box can be formed */
				column.direction < 0 && _downwardMovement > boxSize /* falling column AND box can be formed */) {
						// form another box
						box.close = box.open + column.direction * boxSize;
						box.toDate = dateAccessor(d);
						var _prevBoxClose2 = box.close;
						column.boxes.push(box);
						box = createBox(d, dateAccessor, dateMutator);
						box.open = _prevBoxClose2;
						box.fromDate = dateAccessor(d);
						dateMutator(box, dateAccessor(d));
					} else if (column.direction > 0 && _downwardMovement > boxSize * reversal || /* rising column and there is downward movement to trigger a reversal */
				column.direction < 0 && _upwardMovement > boxSize * reversal /* falling column and there is downward movement to trigger a reversal */) {
						// reversal

						box.open = box.open + -1 * column.direction * boxSize;
						box.toDate = dateAccessor(d);
						// box.displayDate = d.displayDate;
						dateMutator(box, dateAccessor(d));
						// box.startOfYear = d.startOfYear;
						// box.startOfQuarter = d.startOfQuarter;
						// box.startOfMonth = d.startOfMonth;
						// box.startOfWeek = d.startOfWeek;
						// console.table(column.boxes);
						var idx = indexAccessor(column) + 1;
						column = {
							boxes: [],
							volume: 0,
							direction: -1 * column.direction
						};
						indexMutator(column, idx);
						var _noOfBoxes = column.direction > 0 ? Math.floor(_upwardMovement / boxSize) : Math.floor(_downwardMovement / boxSize);
						for (var _i = 0; _i < _noOfBoxes; _i++) {
							box.close = box.open + column.direction * boxSize;
							var prevBoxClose = box.close;
							column.boxes.push(box);
							box = createBox(d, dateAccessor, dateMutator);
							box.open = prevBoxClose;
						}

						columnData.push(column);
					}
			}
		});
		updateColumns(columnData, dateAccessor, dateMutator);

		return columnData;
	};
	calculator.reversal = function (x) {
		if (!arguments.length) return reversal;
		reversal = x;
		return calculator;
	};
	calculator.boxSize = function (x) {
		if (!arguments.length) return boxSize;
		boxSize = x;
		return calculator;
	};
	calculator.source = function (x) {
		if (!arguments.length) return source;
		source = x;
		return calculator;
	};
	calculator.dateMutator = function (x) {
		if (!arguments.length) return dateMutator;
		dateMutator = x;
		return calculator;
	};
	calculator.dateAccessor = function (x) {
		if (!arguments.length) return dateAccessor;
		dateAccessor = x;
		return calculator;
	};
	calculator.indexMutator = function (x) {
		if (!arguments.length) return indexMutator;
		indexMutator = x;
		return calculator;
	};
	calculator.indexAccessor = function (x) {
		if (!arguments.length) return indexAccessor;
		indexAccessor = x;
		return calculator;
	};

	return calculator;
};

var _utils = require("../../utils");

var _defaultOptions = require("../defaultOptions");

function createBox(d, dateAccessor, dateMutator) {
	var box = {
		open: d.open,
		fromDate: dateAccessor(d),
		toDate: dateAccessor(d),
		startOfYear: d.startOfYear,
		startOfQuarter: d.startOfQuarter,
		startOfMonth: d.startOfMonth,
		startOfWeek: d.startOfWeek
	};
	dateMutator(box, dateAccessor(d));
	return box;
}

function updateColumns(columnData, dateAccessor, dateMutator) {
	columnData.forEach(function (d) {
		// var lastBox = d.boxes[d.boxes.length - 1];

		d.startOfYear = false;
		d.startOfQuarter = false;
		d.startOfMonth = false;
		d.startOfWeek = false;

		d.boxes.forEach(function (eachBox) {
			if ((0, _utils.isNotDefined)(d.open)) d.open = eachBox.open;
			d.close = eachBox.close;
			d.high = Math.max(d.open, d.close);
			d.low = Math.min(d.open, d.close);

			if ((0, _utils.isNotDefined)(d.fromDate)) d.fromDate = eachBox.fromDate;
			if ((0, _utils.isNotDefined)(d.date)) d.date = eachBox.date;
			d.toDate = eachBox.toDate;

			if (eachBox.startOfYear) {
				d.startOfYear = d.startOfYear || eachBox.startOfYear;
				d.startOfQuarter = eachBox.startOfQuarter;
				d.startOfMonth = eachBox.startOfMonth;
				d.startOfWeek = eachBox.startOfWeek;

				dateMutator(d, dateAccessor(eachBox));
			}
			if (d.startOfQuarter !== true && eachBox.startOfQuarter) {
				d.startOfQuarter = eachBox.startOfQuarter;
				d.startOfMonth = eachBox.startOfMonth;
				d.startOfWeek = eachBox.startOfWeek;
				// d.displayDate = eachBox.displayDate;
				dateMutator(d, dateAccessor(eachBox));
			}
			if (d.startOfMonth !== true && eachBox.startOfMonth) {
				d.startOfMonth = eachBox.startOfMonth;
				d.startOfWeek = eachBox.startOfWeek;
				// d.displayDate = eachBox.displayDate;
				dateMutator(d, dateAccessor(eachBox));
			}
			if (d.startOfWeek !== true && eachBox.startOfWeek) {
				d.startOfWeek = eachBox.startOfWeek;
				// d.displayDate = eachBox.displayDate;
				dateMutator(d, dateAccessor(eachBox));
			}
		});
	});

	// console.table(columnData);
	// console.table(rawData);
	return columnData;
}