function _typeof(obj) {
  '@babel/helpers - typeof';

  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj; }; } return _typeof(obj);
}

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _react = _interopRequireWildcard(require('react'));

const _isEqual = _interopRequireDefault(require('lodash/isEqual'));

const _differenceWith = _interopRequireDefault(require('lodash/differenceWith'));

const _visData = require('vis-data/peer/esm/vis-data');

const _visNetwork = require('vis-network/peer/esm/vis-network');

const _propTypes = _interopRequireDefault(require('prop-types'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== 'function') return null; const cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') { return { default: obj }; } const cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } const newObj = {}; const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (const key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { const desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable linebreak-style */

/* eslint-disable react/jsx-filename-extension */
const defaultOptions = {
  physics: {
    stabilization: false,
  },
  autoResize: false,
  edges: {
    smooth: false,
    color: '#000000',
    width: 0.5,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      },
    },
  },
};

const Graph = function Graph(_ref) {
  const { data } = _ref;
  const _ref$options = _ref.options;
  const options = _ref$options === void 0 ? defaultOptions : _ref$options;
  const _ref$events = _ref.events;
  const events = _ref$events === void 0 ? {} : _ref$events;
  const _ref$style = _ref.style;
  const style = _ref$style === void 0 ? {
    width: '100%',
    height: '100%',
  } : _ref$style;
  const { getNetwork } = _ref;
  const { getNodes } = _ref;
  const { getEdges } = _ref;
  const nodes = (0, _react.useRef)(new _visData.DataSet(data.nodes));
  const edges = (0, _react.useRef)(new _visData.DataSet(data.edges));
  const network = (0, _react.useRef)(null);
  const container = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    network.current = new _visNetwork.Network(container.current, {
      nodes: nodes.current,
      edges: edges.current,
    }, options);

    if (getNetwork) {
      getNetwork(network.current);
    }

    if (getNodes) {
      getNodes(nodes.current);
    }

    if (getEdges) {
      getEdges(edges.current);
    }
  }, []);
  (0, _react.useEffect)(() => {
    const nodesChange = !(0, _isEqual.default)(nodes.current, data.nodes);
    const edgesChange = !(0, _isEqual.default)(edges.current, data.edges);

    if (nodesChange) {
      const idIsEqual = function idIsEqual(n1, n2) {
        return n1.id === n2.id;
      };

      const nodesRemoved = (0, _differenceWith.default)(nodes.current.get(), data.nodes, idIsEqual);
      const nodesAdded = (0, _differenceWith.default)(data.nodes, nodes.current.get(), idIsEqual);
      const nodesChanged = (0, _differenceWith.default)((0, _differenceWith.default)(data.nodes, nodes.current.get(), _isEqual.default), nodesAdded);
      nodes.current.remove(nodesRemoved);
      nodes.current.add(nodesAdded);
      nodes.current.update(nodesChanged);
    }

    if (edgesChange) {
      const edgesRemoved = (0, _differenceWith.default)(edges.current.get(), data.edges, _isEqual.default);
      const edgesAdded = (0, _differenceWith.default)(data.edges, edges.current.get(), _isEqual.default);
      const edgesChanged = (0, _differenceWith.default)((0, _differenceWith.default)(data.edges, edges.current.get(), _isEqual.default), edgesAdded);
      edges.current.remove(edgesRemoved);
      edges.current.add(edgesAdded);
      edges.current.update(edgesChanged);
    }
  }, [data]);
  (0, _react.useEffect)(() => {
    network.current.setOptions(options);
  }, [options]);
  (0, _react.useEffect)(() => {
    // Add user provied events to network
    // eslint-disable-next-line no-restricted-syntax
    for (let _i = 0, _Object$keys = Object.keys(events); _i < _Object$keys.length; _i++) {
      const eventName = _Object$keys[_i];
      network.current.on(eventName, events[eventName]);
    }
  }, [events]);
  return /* #__PURE__ */_react.default.createElement('div', {
    ref: container,
    style,
  });
};

Graph.propTypes = {
  data: _propTypes.default.object,
  options: _propTypes.default.object,
  events: _propTypes.default.object,
  style: _propTypes.default.object,
  getNetwork: _propTypes.default.func,
  getNodes: _propTypes.default.func,
  getEdges: _propTypes.default.func,
};
const _default = Graph;
exports.default = _default;
