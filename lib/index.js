/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';
import { DataSet } from 'vis-data/esnext';
import { Network } from 'vis-network/esnext';
import PropTypes from 'prop-types';
var defaultOptions = {
  physics: {
    stabilization: false
  },
  autoResize: false,
  edges: {
    smooth: false,
    color: '#000000',
    width: 0.5,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5
      }
    }
  }
};
var Graph = function Graph(_ref) {
  var data = _ref.data,
    _ref$options = _ref.options,
    options = _ref$options === void 0 ? defaultOptions : _ref$options,
    _ref$events = _ref.events,
    events = _ref$events === void 0 ? {} : _ref$events,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {
      width: '100%',
      height: '100%'
    } : _ref$style,
    getNetwork = _ref.getNetwork,
    getNodes = _ref.getNodes,
    getEdges = _ref.getEdges;
  var nodes = useRef(new DataSet(data.nodes));
  var edges = useRef(new DataSet(data.edges));
  var network = useRef(null);
  var container = useRef(null);
  useEffect(function () {
    network.current = new Network(container.current, {
      nodes: nodes.current,
      edges: edges.current
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
  useEffect(function () {
    var nodesChange = !isEqual(nodes.current, data.nodes);
    var edgesChange = !isEqual(edges.current, data.edges);
    if (nodesChange) {
      var idIsEqual = function idIsEqual(n1, n2) {
        return n1.id === n2.id;
      };
      var nodesRemoved = differenceWith(nodes.current.get(), data.nodes, idIsEqual);
      var nodesAdded = differenceWith(data.nodes, nodes.current.get(), idIsEqual);
      var nodesChanged = differenceWith(differenceWith(data.nodes, nodes.current.get(), isEqual), nodesAdded);
      nodes.current.remove(nodesRemoved);
      nodes.current.add(nodesAdded);
      nodes.current.update(nodesChanged);
    }
    if (edgesChange) {
      var edgesRemoved = differenceWith(edges.current.get(), data.edges, isEqual);
      var edgesAdded = differenceWith(data.edges, edges.current.get(), isEqual);
      var edgesChanged = differenceWith(differenceWith(data.edges, edges.current.get(), isEqual), edgesAdded);
      edges.current.remove(edgesRemoved);
      edges.current.add(edgesAdded);
      edges.current.update(edgesChanged);
    }
    if ((nodesChange || edgesChange) && getNetwork) {
      getNetwork(network.current);
    }
    if (nodesChange && getNodes) {
      getNodes(nodes.current);
    }
    if (edgesChange && getEdges) {
      getEdges(edges.current);
    }
  }, [data]);
  useEffect(function () {
    network.current.setOptions(options);
  }, [options]);
  useEffect(function () {
    // Add user provied events to network
    // eslint-disable-next-line no-restricted-syntax
    for (var _i = 0, _Object$keys = Object.keys(events); _i < _Object$keys.length; _i++) {
      var eventName = _Object$keys[_i];
      network.current.on(eventName, events[eventName]);
    }
    return function () {
      // eslint-disable-next-line no-restricted-syntax
      for (var _i2 = 0, _Object$keys2 = Object.keys(events); _i2 < _Object$keys2.length; _i2++) {
        var _eventName = _Object$keys2[_i2];
        network.current.off(_eventName, events[_eventName]);
      }
    };
  }, [events]);
  return /*#__PURE__*/React.createElement("div", {
    ref: container,
    style: style
  });
};
Graph.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  events: PropTypes.object,
  style: PropTypes.object,
  getNetwork: PropTypes.func,
  getNodes: PropTypes.func,
  getEdges: PropTypes.func
};
export default Graph;
