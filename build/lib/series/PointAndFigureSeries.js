"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _wrap = require("./wrap");

var _wrap2 = _interopRequireDefault(_wrap);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PointAndFigureSeries = function (_Component) {
	_inherits(PointAndFigureSeries, _Component);

	function PointAndFigureSeries() {
		_classCallCheck(this, PointAndFigureSeries);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(PointAndFigureSeries).apply(this, arguments));
	}

	_createClass(PointAndFigureSeries, [{
		key: "render",
		value: function render() {
			var props = this.props;
			var xScale = props.xScale;
			var xAccessor = props.xAccessor;
			var yScale = props.yScale;
			var yAccessor = props.yAccessor;
			var plotData = props.plotData;


			var columns = PointAndFigureSeries.getColumns(xScale, xAccessor, yScale, yAccessor, plotData);
			var stroke = props.stroke;
			var fill = props.fill;
			var strokeWidth = props.strokeWidth;
			var className = props.className;


			return _react2.default.createElement(
				"g",
				{ className: className },
				columns.map(function (col, idx) {
					return _react2.default.createElement(
						"g",
						{ key: idx, className: col.className, transform: "translate(" + col.offset[0] + ", " + col.offset[1] + ")" },
						col.boxes.map(function (box, i) {
							if (col.direction > 0) {
								return _react2.default.createElement(
									"g",
									{ key: idx + "-" + i },
									_react2.default.createElement("line", { className: "up", strokeWidth: strokeWidth, stroke: stroke.up, fill: fill.up,
										x1: 0, y1: box.open, x2: box.columnWidth, y2: box.close }),
									_react2.default.createElement("line", { className: "up", strokeWidth: strokeWidth, stroke: stroke.up, fill: fill.up,
										x1: 0, y1: box.close, x2: box.columnWidth, y2: box.open })
								);
							}
							return _react2.default.createElement("ellipse", { key: idx + "-" + i,
								className: "down", strokeWidth: strokeWidth, stroke: stroke.down, fill: fill.down,
								cx: box.columnWidth / 2, cy: (box.open + box.close) / 2,
								rx: box.columnWidth / 2, ry: box.boxHeight / 2 });
						})
					);
				})
			);
		}
	}]);

	return PointAndFigureSeries;
}(_react.Component);

PointAndFigureSeries.defaultProps = {
	className: "react-stockcharts-point-and-figure",
	strokeWidth: 1,
	stroke: {
		up: "#6BA583",
		down: "#FF0000"
	},
	fill: {
		up: "none",
		down: "none"
	}
};

PointAndFigureSeries.yAccessor = function (d) {
	return { open: d.open, high: d.high, low: d.low, close: d.close };
};

PointAndFigureSeries.drawOnCanvas = function (props, ctx, xScale, yScale, plotData) {
	var xAccessor = props.xAccessor;
	var yAccessor = props.yAccessor;


	var columns = PointAndFigureSeries.getColumns(xScale, xAccessor, yScale, yAccessor, plotData);
	var stroke = props.stroke;
	var fill = props.fill;
	var strokeWidth = props.strokeWidth;


	ctx.lineWidth = strokeWidth;

	columns.forEach(function (col) {
		var _col$offset = _slicedToArray(col.offset, 2);

		var offsetX = _col$offset[0];
		var offsetY = _col$offset[1];

		col.boxes.forEach(function (box) {
			if (col.direction > 0) {
				ctx.fillStyle = fill.up;
				ctx.strokeStyle = stroke.up;

				ctx.beginPath();

				ctx.moveTo(offsetX, offsetY + box.open);
				ctx.lineTo(offsetX + box.columnWidth, offsetY + box.close);
				ctx.moveTo(offsetX, offsetY + box.close);
				ctx.lineTo(offsetX + box.columnWidth, offsetY + box.open);

				ctx.stroke();
			} else {
				ctx.fillStyle = fill.down;
				ctx.strokeStyle = stroke.down;

				ctx.beginPath();

				var x = offsetX + box.columnWidth / 2;
				var y = offsetY + box.open + box.boxHeight / 2;
				var rx = box.columnWidth / 2;
				var ry = box.boxHeight / 2;


				ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
				ctx.stroke();
			}
		});
	});

	ctx.stroke();
};

PointAndFigureSeries.getColumns = function (xScale, xAccessor, yScale, yAccessor, plotData) {

	var width = xScale(xAccessor(plotData[plotData.length - 1])) - xScale(xAccessor(plotData[0]));

	var columnWidth = width / (plotData.length - 1);

	var anyBox,
	    j = 0;
	while ((0, _utils.isNotDefined)(anyBox)) {
		if ((0, _utils.isDefined)(plotData[j].close)) {
			anyBox = plotData[j].boxes[0];
		}
		j++;
	}

	var boxHeight = Math.abs(yScale(anyBox.open) - yScale(anyBox.close));

	var columns = plotData.filter(function (d) {
		return (0, _utils.isDefined)(d.close);
	}).map(function (d) {
		var boxes = d.boxes.map(function (box) {
			return {
				columnWidth: columnWidth,
				boxHeight: boxHeight,
				open: yScale(box.open),
				close: yScale(box.close)
			};
		});

		var xOffset = xScale(xAccessor(d)) - columnWidth / 2;
		return {
			boxes: boxes,
			direction: d.direction,
			offset: [xOffset, 0]
		};
	});
	return columns;
};

exports.default = (0, _wrap2.default)(PointAndFigureSeries);