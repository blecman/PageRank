import React, { Component } from 'react';
import Select from 'react-select';

class GraphInput extends Component{

    constructor(){
        super();
        this.state = {
            nodeCount : 3,
            edges : ["","",""]
        }

        this.updateNodeCount = this.updateNodeCount.bind(this);
        this.updateEdge = this.updateEdge.bind(this);

        this.nodeCountOptions = [];
        for (var i = 1; i <= 26; i++){
            this.nodeCountOptions.push({
                'value': i,
                'label': i
            })
        }
    }

    updateNodeCount (newValue){
        var edges = [];
        for (var i = 0; i < newValue; i++){
            edges.push("");
        }
        this.setState({
            nodeCount:newValue,
            edges: edges
        })
    }

    updateEdge(i){
        var func =  function(newValue){
            var edges = this.state.edges;
            edges[i] = newValue;
            this.setState({
                edges:edges
            });
            console.log(JSON.stringify(this.state.edges));
            this.outputGraph();
        }
        func = func.bind(this);
        return func;
    }

    outputGraph(){
        var nodes = [];
        var links = [];
        var capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXY";
        for (var i = 0; i < this.state.nodeCount; i++){
            nodes.push({'id':capitalLetters[i]});
            var outNodes = this.state.edges[i].split(',');
            for (var j = 0; j < outNodes.length; j++){
                var outLetter = outNodes[j];
                if (outLetter !== ""){
                    var outNumber = capitalLetters.indexOf(outLetter);
                    links.push({
                        "source": i,
                        "target": outNumber
                    });
                }
            
            }
        }
        this.props.updateGraph(nodes, links);
    }

    render(){
         var capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXY";
         var edgeSelectors = [];
         for(var i = 0; i < this.state.nodeCount; i++){
             var letter = capitalLetters[i];
             var options = [];
             for (var j = 0; j < this.state.nodeCount; j++){
                 var aletter = capitalLetters[j];
                 if (aletter !== letter){
                     options.push({
                         'value': aletter,
                         'label': aletter
                     });
                 }
             }
             edgeSelectors.push(
                 <tr>
                    <td>
                        <center><h3>{letter}</h3></center>
                    </td>

                    <td>
             <Select multi simpleValue value={this.state.edges[i]} options={options} onChange={this.updateEdge(i)} />
                    </td>
                </tr>
             );
         }
        return (
            <div>
                <div className="row">

                    <div className="col-md-12">
                        <b>Number of Nodes: </b>
                        <Select
                            simpleValue
                            name="form-field-name"
                            value={this.state.nodeCount}
                            options={this.nodeCountOptions}
                            onChange={this.updateNodeCount} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <table width="100%">
                            <tbody>
                                {edgeSelectors}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default GraphInput;