import React, { Component } from 'react';
import './Graph.css';

function linkCompare(link1,link2){
    var source_1 = link1['source']['index'];
    var source_2 = link2['source']['index'];
    if (source_1 !== source_2){
        return source_1 - source_2;
    }

    var target_1 = link1['target']['index'];
    var target_2 = link2['target']['index'];

    return target_1 - target_2;
}

var width = 960;
var height = 500;

class CrawlSimulator extends Component{

    constructor(){
        super();
        this.componentWillMount = this.componentWillMount.bind(this);
        this.clear = this.clear.bind(this);   
        this.advance = this.advance.bind(this);

        this.state = {
            matrix: [],
            currentEdge: 0,
            edgeList: []
        };

    }

    componentWillMount(){
        this.clear(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.update != this.props.update){
            this.clear(nextProps);
            this.forceUpdate();
        }
    }

    clear(props){

        if(this.props.nodes.length == 0) return;

        //create matrix initialized to zero
        var matrix = [];
        for (var i = 0; i < props.nodes.length; i++){
            matrix.push([]);
        }

        var adjacencyList = this.adjacencyList(props.nodes, props.links);

        var edgeList = this.dfs(props.nodes, adjacencyList); 
        
        this.setState({
            matrix: matrix,
            edgeList: edgeList,
            currentEdge: 0
        })
        
    }

    adjacencyList(nodes, links){
        //make empty list
        var adjacencyList = [];
        var i;
        for (i = 0; i < nodes.length; i++){
            adjacencyList.push([]);
        }

        //add edges to list
        for (i = 0; i < links.length; i++){
            var source_id = links[i]['source']['index'];
            adjacencyList[source_id].push(links[i]);
        }

        //sort edges within each list
        for (i = 0; i < adjacencyList.length; i++){
            adjacencyList[i].sort(linkCompare);
        }
        return adjacencyList;
    }

    dfs(nodes, adjacencyList){
        //create visited array initialized to false
        var visited = [];
        var i;
        var j;
        for (i = 0; i < nodes.length; i++){
            visited.push(false);
        }

        //make stack and array for list of visisted
        var stack = [];
        var edgeList = [];


        //run DFS
        for (i = 0; i < nodes.length; i++){
            if (!visited[i]){
                stack.push(i);

                while (stack.length !== 0){
                    var v = stack.pop();
                    visited[v] = true;
                    //add neighbors to edge list in alphabetical order
                    for (j = 0; j < adjacencyList[v].length; j++){
                        edgeList.push(adjacencyList[v][j]);
                        
                    }
                    //add neighbors to stack in reverse alphabetical order
                    for (j = adjacencyList[v].length - 1; j >= 0; j--){
                        var target_id = adjacencyList[v][j]['target']['index'];
                        if (!visited[target_id]){
                            stack.push(target_id);
                        }
                    }
                }
            }
        }
        return edgeList;
    }

    advance(){
        console.log("advanced");
        if (this.state.currentEdge < this.state.edgeList.length){
            var edge = this.state.edgeList[this.state.currentEdge];
            var source = edge['source'].index;
            var target = edge['target'].index;

            if (this.state.matrix[source].length === 0){
                for (var i = 0; i < this.props.nodes.length; i++){
                    this.state.matrix[source].push(0);
                }
            }

            this.state.matrix[source][target] = 1;

            this.setState((prevState, props) => ({
                currentEdge: prevState.currentEdge + 1,
            }));
        } else {
             console.log("full");
             for (var i = 0; i < this.state.matrix.length; i++){
                 console.log(this.state.matrix[i].length);
                if (this.state.matrix[i].length === 0){
                    for (var j = 0; j < this.props.nodes.length; j++){
                        this.state.matrix[i].push(0);
                    }
                }
            }
            this.setState({
                matrix: this.state.matrix
            });
        }
    }

    render(){
        if (this.props.nodes.length == 0){
            return (
                <div></div>
            );
        }
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
        
        for (i = 0; i < this.state.currentEdge; i++){
            link = this.state.edgeList[i];
            link_items.push(
                <line className='link' key={link.id} strokeWidth={3}
                x1={link.source.x} x2={link.target.x} y1={link.source.y} y2={link.target.y} markerEnd="url(#arrow)"/>
            );
        }

        var rows = [];
        var i;
        var row = [(<td></td>)];
        for (i = 0; i < this.props.nodes.length; i++){
            row.push((<td><b>{this.props.nodes[i].id}</b></td>));
        }
        rows.push(<tr>{row}</tr>)

        for (i=0; i < this.state.matrix.length; i++){
            var cols = [<td><b>{this.props.nodes[i].id}</b></td>];
            if (this.state.matrix[i].length == 0){
                for (var j=0; j<this.props.nodes.length; j++){
                    cols.push(<td>_</td>);
                }
            } else {
                for (var j=0; j<this.state.matrix[i].length; j++){
                    cols.push((<td>{this.state.matrix[i][j]}</td>));
                }
            }
            rows.push((<tr>{cols}</tr>));
        }

        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <button onClick={this.advance}> Advance </button>
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
                    </div>

                    <div className="col-md-6">
                        <table className="matrix">
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>

                
            </div>
        )
    }
}

export default CrawlSimulator;