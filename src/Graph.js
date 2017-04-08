import React, { Component } from 'react';
import * as d3 from "d3";
import './Graph.css';

/* Code here is heavily based on implementation at http://bl.ocks.org/sxywu/61a4bd0cfc373cf08884 */

var width = 700;
var height = 500;

class Graph extends Component{


    render() {
        // use React to draw all the nodes, d3 calculates the x and y
        var node_items = [];
        var node;
        var link_items = [];
        var link;
        for (var i = 0; i < this.props.nodes.length; i++){
            node = this.props.nodes[i];
            var transform = 'translate(' + node.x + ',' + node.y + ')';
            node_items.push(
                <g className='node' key={node.id} transform={transform}>
                    <circle r={6} /> 
                    <text x={7} dy='.5em'>{node.id}</text>
                </g>
            );
        }

        
        for (i = 0; i < this.props.links.length; i++){
            link = this.props.links[i];
            link_items.push(
                <line className='link' key={link.id} strokeWidth={3}
                x1={link.source.x} x2={link.target.x} y1={link.source.y} y2={link.target.y} markerEnd="url(#arrow)"/>
            );
        }
        

        return (
            <svg width={width} height={height}>
                <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5.1" refY="1.5" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,3 L3,1.5 z"  fill="#848383"/>
                    </marker>
                </defs>
                <g>
                {node_items}
                {link_items}
                </g>
            </svg>
        );
  }
}
export default Graph;