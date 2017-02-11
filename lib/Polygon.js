'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var compareBoundaries = function compareBoundaries(boundary1, boundary2) {
    if (boundary1 == boundary2) {
        return true;
    } else if (boundary1 && !boundary2 || !boundary1 && boundary2) {
        return false;
    } else if (boundary1.length != boundary2.length) {
        return false;
    } else {
        return boundary1.every(function (x, idx) {
            var y = boundary2[idx];
            return x[0] == y[0] && x[1] == y[1];
        });
    }
};

var Polygon = function (_Component) {
    _inherits(Polygon, _Component);

    function Polygon(props) {
        _classCallCheck(this, Polygon);

        return _possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this, props));
    }

    _createClass(Polygon, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _props = this.props,
                externalBoundary = _props.externalBoundary,
                internalBoundary = _props.internalBoundary,
                properties = _props.properties,
                options = _props.options;

            this._ypolygon = new (_api2.default.getAPI().Polygon)([externalBoundary, internalBoundary], properties, options);

            this.context.mapController.appendGeoObject(this._ypolygon);

            if (this.props.drawing) {
                this._ypolygon.editor.startDrawing();
            }
            if (this.props.editing) {
                this._ypolygon.editor.startEditing();
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var _this2 = this;

            var _props2 = this.props,
                externalBoundary = _props2.externalBoundary,
                internalBoundary = _props2.internalBoundary,
                editing = _props2.editing,
                drawing = _props2.drawing,
                properties = _props2.properties,
                options = _props2.options;


            if (!compareBoundaries(prevProps.externalBoundary, externalBoundary) || !compareBoundaries(prevProps.internalBoundary, internalBoundary)) {
                this._ypolygon.geometry.setCoordinates([externalBoundary, internalBoundary]);
            }

            Object.keys(properties).forEach(function (propName) {
                if (!prevProps.properties || properties[propName] !== prevProps.properties[propName]) {
                    _this2._ypolygon.properties.set(propName, properties[propName]);
                }
            });

            Object.keys(options).forEach(function (optName) {
                if (!prevProps.options || options[optName] !== prevProps.options[optName]) {
                    _this2._ypolygon.options.set(optName, options[optName]);
                }
            });

            if (prevProps.drawing != drawing) {
                this._ypolygon.editor[drawing ? "startDrawing" : "stopDrawing"]();
            }
            if (prevProps.editing != editing) {
                this._ypolygon.editor[editing ? "startEditing" : "stopEditing"]();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.context.mapController.removeGeoObject(this._ypolygon);
        }
    }, {
        key: 'getExternalBoundary',
        value: function getExternalBoundary() {
            return this._ypolygon.geometry.getCoordinates()[0];
        }
    }, {
        key: 'getInternalBoundary',
        value: function getInternalBoundary() {
            return this._ypolygon.geometry.getCoordinates()[1];
        }
    }, {
        key: 'render',
        value: function render() {
            return null;
        }
    }]);

    return Polygon;
}(_react.Component);

Polygon.defaultProps = {
    internalBoundary: [],
    options: {},
    properties: {},
    drawing: false,
    editing: false
};
Polygon.propTypes = {
    externalBoundary: _react.PropTypes.arrayOf(_react.PropTypes.arrayOf(_react.PropTypes.number)).isRequired,
    internalBoundary: _react.PropTypes.arrayOf(_react.PropTypes.arrayOf(_react.PropTypes.number)),
    properties: _react.PropTypes.object,
    options: _react.PropTypes.object,
    drawing: _react.PropTypes.bool,
    editing: _react.PropTypes.bool
};
Polygon.contextTypes = {
    mapController: _react.PropTypes.object
};
exports.default = Polygon;