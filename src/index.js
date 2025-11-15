/* eslint-disable react/require-default-props */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';
import { DataSet } from 'vis-data/esnext';
import { Network } from 'vis-network/esnext';

/**
 * @typedef {Object} GraphData
 * @property {Array} nodes - Array of node objects
 * @property {Array} edges - Array of edge objects
 */

/**
 * @typedef {Object} GraphProps
 * @property {GraphData} data - The graph data containing nodes and edges
 * @property {Object} [options] - vis-network options object
 * @property {Object} [events] - Event handlers object with event names as keys
 * @property {Object} [style] - CSS style object for the container
 * @property {Function} [getNetwork] - Callback function to receive the network instance
 * @property {Function} [getNodes] - Callback function to receive the nodes DataSet
 * @property {Function} [getEdges] - Callback function to receive the edges DataSet
 */

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

/**
 * Graph component for rendering vis-network graphs
 * @param {GraphProps} props - Component props
 * @returns {React.Element} The graph container element
 */
const Graph = ({
  data,
  options = defaultOptions,
  events = {},
  style = { width: '100%', height: '100%' },
  getNetwork,
  getNodes,
  getEdges,
}) => {
  const nodes = useRef(new DataSet(data.nodes));
  const edges = useRef(new DataSet(data.edges));
  const network = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    network.current = new Network(
      container.current,
      { nodes: nodes.current, edges: edges.current },
      options,
    );

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

  useEffect(() => {
    const nodesChange = !isEqual(nodes.current, data.nodes);
    const edgesChange = !isEqual(edges.current, data.edges);

    if (nodesChange) {
      const idIsEqual = (n1, n2) => n1.id === n2.id;
      const nodesRemoved = differenceWith(
        nodes.current.get(),
        data.nodes,
        idIsEqual,
      );
      const nodesAdded = differenceWith(
        data.nodes,
        nodes.current.get(),
        idIsEqual,
      );
      const nodesChanged = differenceWith(
        differenceWith(data.nodes, nodes.current.get(), isEqual),
        nodesAdded,
      );

      nodes.current.remove(nodesRemoved);
      nodes.current.add(nodesAdded);
      nodes.current.update(nodesChanged);
    }

    if (edgesChange) {
      const edgesRemoved = differenceWith(
        edges.current.get(),
        data.edges,
        isEqual,
      );
      const edgesAdded = differenceWith(
        data.edges,
        edges.current.get(),
        isEqual,
      );
      const edgesChanged = differenceWith(
        differenceWith(data.edges, edges.current.get(), isEqual),
        edgesAdded,
      );
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

  useEffect(() => {
    network.current.setOptions(options);
  }, [options]);

  useEffect(() => {
    // Add user provied events to network
    // eslint-disable-next-line no-restricted-syntax
    for (const eventName of Object.keys(events)) {
      network.current.on(eventName, events[eventName]);
    }

    return () => {
      // eslint-disable-next-line no-restricted-syntax
      for (const eventName of Object.keys(events)) {
        network.current.off(eventName, events[eventName]);
      }
    };
  }, [events]);

  return <div ref={container} style={style} />;
};


export default Graph;
