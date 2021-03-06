"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _EdgeCoordinate = require("./EdgeCoordinate");

var _EdgeCoordinate2 = _interopRequireDefault(_EdgeCoordinate);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CrossHair = function (_Component) {
	_inherits(CrossHair, _Component);

	function CrossHair() {
		_classCallCheck(this, CrossHair);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(CrossHair).apply(this, arguments));
	}

	_createClass(CrossHair, [{
		key: "shouldComponentUpdate",
		value: function shouldComponentUpdate(nextProps) {
			return nextProps.mouseXY !== this.props.mouseXY;
		}
	}, {
		key: "render",
		value: function render() {
			var result = CrossHair.helper(this.props);
			var line = result.line;
			var edges = result.edges;

			var svgLine = (0, _utils.isDefined)(line) ? _react2.default.createElement("line", { className: "react-stockcharts-cross-hair", opacity: line.opacity, stroke: line.stroke,
				x1: line.x1, y1: line.y1,
				x2: line.x2, y2: line.y2 }) : null;

			return _react2.default.createElement(
				"g",
				{ className: "crosshair " },
				svgLine,
				edges.map(function (edge, idx) {
					return _react2.default.createElement(_EdgeCoordinate2.default, _extends({
						key: idx,
						className: "horizontal"
					}, edge));
				})
			);
		}
	}]);

	return CrossHair;
}(_react.Component);

CrossHair.propTypes = {
	yAxisPad: _react.PropTypes.number.isRequired,
	height: _react.PropTypes.number.isRequired,
	width: _react.PropTypes.number.isRequired,
	mouseXY: _react.PropTypes.array.isRequired,
	xDisplayValue: _react.PropTypes.string.isRequired,
	edges: _react.PropTypes.array.isRequired
};

CrossHair.defaultProps = {
	yAxisPad: 5
};

CrossHair.helper = function (props) {
	var width = props.width;
	var edges = props.edges;
	var yAxisPad = props.yAxisPad;
	var mouseXY = props.mouseXY;
	var xDisplayValue = props.xDisplayValue;
	var height = props.height;
	var stroke = props.stroke;
	var opacity = props.opacity;
	var textStroke = props.textStroke;
	var textBGFill = props.textBGFill;
	var textBGopacity = props.textBGopacity;
	var fontFamily = props.fontFamily;
	var fontSize = props.fontSize;

	var x1 = 0,
	    x2 = width;

	var edges = edges.map(function (edge) {
		if (edge.at === "left") {
			x1 = -yAxisPad;
		}
		if (edge.at === "right") {
			x2 = width + yAxisPad;
		}

		return _extends({}, edge, {
			type: "horizontal",
			show: true,
			x1: 0,
			y1: mouseXY[1],
			x2: 0,
			y2: mouseXY[1],
			coordinate: edge.yDisplayValue,
			edgeAt: edge.at === "left" ? x1 : x2,
			orient: edge.at,
			hideLine: true,
			lineStroke: stroke,
			lineOpacity: opacity,
			textFill: textStroke,
			fill: textBGFill,
			opacity: textBGopacity,
			fontFamily: fontFamily, fontSize: fontSize
		});
	});
	edges.push(_extends({}, props, {
		type: "vertical",
		show: true,
		x1: mouseXY[0],
		y1: 0,
		x2: mouseXY[0],
		y2: height,
		coordinate: xDisplayValue,
		edgeAt: height,
		orient: "bottom",
		lineStroke: stroke,
		lineOpacity: opacity,
		textFill: textStroke,
		fill: textBGFill,
		opacity: textBGopacity,
		fontFamily: fontFamily, fontSize: fontSize
	}));

	var line;
	if (edges.length > 1) {
		line = {
			opacity: opacity,
			stroke: stroke,
			x1: x1,
			y1: mouseXY[1],
			x2: x2,
			y2: mouseXY[1]
		};
	}
	return { edges: edges, line: line };
};

CrossHair.drawOnCanvasStatic = function (ctx, props) {
	props = _extends({}, CrossHair.defaultProps, props);
	var result = CrossHair.helper(props);
	var line = result.line;
	var edges = result.edges;


	edges.forEach(function (edge) {
		return _EdgeCoordinate2.default.drawOnCanvasStatic(ctx, edge);
	});

	if (line) {
		ctx.strokeStyle = (0, _utils.hexToRGBA)(line.stroke, line.opacity);

		ctx.beginPath();
		ctx.moveTo(line.x1, line.y1);
		ctx.lineTo(line.x2, line.y2);
		ctx.stroke();
	}
};

exports.default = CrossHair;