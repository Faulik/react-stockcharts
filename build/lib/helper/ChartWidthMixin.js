"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import ReactDOM from "react-dom";

var ChartWidthMixin = {
	handleWindowResize: function handleWindowResize() {
		var el = _react2.default.findDOMNode(this);
		// console.log(this.refs, el, this);

		var w = el.parentNode.clientWidth;
		// console.log("width = ", w);
		this.setState({
			width: w
		});
	},
	componentWillUnmount: function componentWillUnmount() {
		// console.log("unmounting...")
		window.removeEventListener("resize", this.handleWindowResize);
	},
	componentDidMount: function componentDidMount() {
		window.addEventListener("resize", this.handleWindowResize);
		var el = _react2.default.findDOMNode(this);
		// console.log(this.refs, el);
		var w = el.parentNode.clientWidth;
		this.setState({
			width: w
		});
	}
};

exports.default = ChartWidthMixin;