import React, { Component } from 'react';
import './Graph.css';

var c = .85;

class EigenvalueEstimator extends Component{

    constructor(){
        super();

        this.state = {
            stochasticMatrix: [],
            vector: [],
            difference: ""
        };

        this.advance = this.advance.bind(this);

    }

    advance(){
        var v = this.state.vector;
        var v_ = [];
        var S = this.state.stochasticMatrix;

        for (var i = 0; i < S.length; i++){
            var t = 0;
            for (var j = 0; j < S[i].length; j++){
                t += v[j]*S[j][i];
            }
            v_.push(t);
        }

        var d = 0;
        for (var i = 0; i < v.length; i++){
            d += Math.pow(v[i] - v_[i], 2);
        }
        this.setState({
            error: Math.pow(d, .5),
            vector: v_
        }); 
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
        var j;

        for (i = 0; i < props.nodes.length; i++){
            adjacencyMatrix.push([]);
            stochasticMatrix.push([]);
            for(var j = 0; j < props.nodes.length; j++){
                adjacencyMatrix[i].push(0);
            }
        }
        var n = adjacencyMatrix.length;

        for (i=0; i < props.links.length; i++){
            var edge = props.links[i];
            var source = edge.source.index;
            var target = edge.target.index;
            adjacencyMatrix[source][target] = 1;
        }
        
        for (i = 0; i < adjacencyMatrix.length; i++){
            var d = 0;
            for (j = 0; j < adjacencyMatrix[i].length; j++){
                d += adjacencyMatrix[i][j];
            }

            for (j = 0; j < adjacencyMatrix[i].length; j++){
                if (d === 0){
                    stochasticMatrix[i].push(1/n);
                } else {
                    stochasticMatrix[i].push(c*adjacencyMatrix[i][j]/d + (1-c)/n);
                }
            }
        }

        var vector = [];
        for (i = 0; i < adjacencyMatrix.length; i++){
            vector.push(1/n);
        }

        this.setState({
            stochasticMatrix: stochasticMatrix,
            vector: vector,
            error: ""
        });
    }

     render(){
        var vector = [];
        for (var i = 0; i < this.state.vector.length; i++){
            vector.push(Math.round(this.state.vector[i]*100)/100);
        }

        var row = [];
        for (var i = 0; i < vector.length; i++){
            row.push(<td>{vector[i]}</td>);
        }

        var error = "";
        if (this.state.error !=""){
           error = Math.round(this.state.error * 10000)/10000;
        } 

        return (
            <div>
                <button onClick={this.advance}> Advance </button>
                <div className="row">
                    <div className="col-md-5 col-md-offset-1">
                        <table className="matrix">
                            <tbody>
                                <tr>
                                    {row}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-6">
                        <b>Error: </b> {error}
                    </div>
                </div>
            </div>
        )
    }
}

export default EigenvalueEstimator;