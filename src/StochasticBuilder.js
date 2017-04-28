import React, { Component } from 'react';
import './Graph.css';

var c = .85;

class StochasticBuilder extends Component{

    constructor(){  
        super();

        this.state = {
            adjacencyMatrix: [],
            stochasticMatrix: [],
            currentRow: 0,
            currentColumn: 0
        };

        this.advance = this.advance.bind(this);

    }

    componentWillMount(){
        this.clear(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.update != this.props.update){
            this.clear(nextProps);
        }
    }

    clear(props){
        var adjacencyMatrix = [];
        var stochasticMatrix = [];
        var i;

        for (i = 0; i < props.nodes.length; i++){
            adjacencyMatrix.push([]);
            stochasticMatrix.push([]);
            for(var j = 0; j < props.nodes.length; j++){
                adjacencyMatrix[i].push(0);
                stochasticMatrix[i].push("_");
            }
        }

        for (i=0; i < props.links.length; i++){
            var edge = props.links[i];
            var source = edge.source.index;
            var target = edge.target.index;
            adjacencyMatrix[source][target] = 1;
        }

        this.setState({
            adjacencyMatrix: adjacencyMatrix,
            stochasticMatrix: stochasticMatrix
        });
    }

    advance(){
        var row = this.state.currentRow;
        var col = this.state.currentColumn;
        var n = this.state.adjacencyMatrix.length;
        var aMatrix = this.state.adjacencyMatrix;
        var sMatrix = this.state.stochasticMatrix;

        if (row < n && col < n){
            var d = 0;
            for (var j = 0; j < n; j++){
                d += aMatrix[row][j];
            }
            var p;
            if (d === 0){
                p = 1/n;
            } else {
                p = c * aMatrix[row][col]/d + (1-c)/n;
            }
            p = Math.round(p *100)/100;
            sMatrix[row][col] = p;
        }

        col += 1;
        if (col >= n){
            col = 0;
            row += 1;
        }

        this.setState({
            stochasticMatrix: sMatrix,
            currentRow: row,
            currentColumn: col
        });

    }

    render(){
        var adjacency_rows = [];
        var i;
        var j;
        var adjacency_row = [(<td></td>)];
        for (i = 0; i < this.props.nodes.length; i++){
            adjacency_row.push((<td><b>{this.props.nodes[i].id}</b></td>));
        }
        adjacency_rows.push(<tr>{adjacency_row}</tr>)

        for (i=0; i < this.state.adjacencyMatrix.length; i++){
            var cols = [<td><b>{this.props.nodes[i].id}</b></td>];
            if (this.state.adjacencyMatrix[i].length == 0){
                for (j=0; j<this.props.nodes.length; j++){
                    cols.push(<td>_</td>);
                }
            } else {
                for (j=0; j<this.state.adjacencyMatrix[i].length; j++){
                    cols.push((<td>{this.state.adjacencyMatrix[i][j]}</td>));
                }
            }
            adjacency_rows.push((<tr>{cols}</tr>));
        }

        var stochastic_rows = [<tr>{adjacency_row}</tr>];
        for (i=0; i < this.state.stochasticMatrix.length; i++){
            var cols = [<td><b>{this.props.nodes[i].id}</b></td>];
            for (j=0; j<this.state.stochasticMatrix[i].length; j++){
                cols.push((<td>{this.state.stochasticMatrix[i][j]}</td>));
            }
            stochastic_rows.push((<tr>{cols}</tr>));
        }
            
        var d = "";
        var a_i_j = "";
        var a_over_d = "";
        var n_inverse = "";
        var c_over_n = "";
        if (this.state.currentRow < this.state.adjacencyMatrix.length){
            d = 0;
            for (i=0; i < this.state.adjacencyMatrix.length; i++){
                d += this.state.adjacencyMatrix[this.state.currentRow][i];
            }
            a_i_j = this.state.adjacencyMatrix[this.state.currentRow][this.state.currentColumn];

            if (d != 0){
                a_over_d = Math.round(c*a_i_j/d *100) / 100;
                c_over_n = Math.round((1-c)/this.state.adjacencyMatrix.length * 1000)/1000;
            } else {
                n_inverse = Math.round(1/this.state.adjacencyMatrix.length *100) / 100;
            }
        }

        return (
            <div>
                <button onClick={this.advance}> Advance </button>
                <div className="row">
                    <div className="col-md-5 col-md-offset-1">
                        $A$
                        <table className="matrix">
                            <tbody>
                                {adjacency_rows}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        $S$
                        <table className="matrix">
                            <tbody>
                                {stochastic_rows}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-2">
                        <center><b>$D$</b> = {d}</center>
                        <center><b>$C$</b> = {c}</center> <br/>
                        <center><b>{'$A_{ij}$'}</b> = {a_i_j}</center>
                        <center><b>{'$C*A_{ij}/D$'}</b> = {a_over_d}</center>
                        <center><b>$(1-C)/N$</b> = {c_over_n}</center> <br/>
                        <center><b>$1/N$</b> = {n_inverse}</center>
                    </div>
                </div>
            </div>
        )
    }
}

export default StochasticBuilder;