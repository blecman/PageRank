import React, { Component } from 'react';
import logo from './logo.svg';
import Graph from './Graph';
import GraphInput from './GraphInput';
import CrawlSimulator from './CrawlSimulator';
import StochasticBuilder from './StochasticBuilder';
import EigenvalueEstimator from './EigenvalueEstimator';
import * as d3 from "d3";
import './App.css';

var width = 960;
var height = 500;

class App extends Component {
  
  constructor(){
    super();
    this.state = {
      nodes: [
              {"id": "Alice"},
              {"id": "Bob"},
              {"id": "Carol"}
            ],
      links: [
              {"source": 0, "target": 1},
              {"source": 1, "target": 2}
            ],
      update: 0
    };

    this.updateGraph = this.updateGraph.bind(this);
    this.updateNodePositions = this.updateNodePositions.bind(this);
    this.makeSimulation = this.makeSimulation.bind(this);

  }

  updateGraph(nodes, links){
    var update = this.state.update + 1;
    this.makeSimulation({links: links, nodes:nodes});
    this.setState({
      nodes: nodes,
      links: links,
      update: update
    });
  }

  componentWillMount(){
      this.makeSimulation(this.state);
  }

  makeSimulation (props){
        this.simulation = d3.forceSimulation(props.nodes)
                            .force("link", d3.forceLink(props.links).distance(100))
                            .force("charge", d3.forceManyBody())
                            .force("center", d3.forceCenter(width / 2, height / 2));

        this.simulation.on('tick', () => {
            // after force calculation starts, call
            // forceUpdate on the React component on each tick
            this.setState({
              nodes: this.state.nodes
            })
        });
    }

  updateNodePositions(nodes){
    console.log("hello");
    this.setState({
      nodePostitions: nodes,
      updatedGraph: false
    })
  }

  render() {
    return (
      <span>
    
        <nav className="navbar navbar-custom navbar-static-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">PageRank</a>
            </div>
          </div>
        </nav>


        <div className="row">
          <div className= "col-md-10 col-md-offset-1">

            <div className="row">
              <div className="col-md-12">
                <h2>What is PageRank?</h2>
                <p>Lorem ipsum dolor sit amet.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h2>Step 1: Create/Select Test Data</h2>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <GraphInput updateGraph={this.updateGraph}/>
              </div>
              <div className="col-md-8">
                <Graph nodes={this.state.nodes} links={this.state.links} updateNodePositions={this.updateNodePositions}/>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h2>Step 2: Build the Adjacency Matrix (Crawl)</h2>
                <CrawlSimulator nodes={this.state.nodes} links={this.state.links} update={this.state.update} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h2>Step 3: Build the Stochastic Matrix</h2>
                <StochasticBuilder nodes={this.state.nodes} links={this.state.links} update={this.state.update} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h2>Step 4: Estimate the Dominant Eigenvector</h2>
                <EigenvalueEstimator nodes={this.state.nodes} links={this.state.links} update={this.state.update} />
              </div>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

export default App;
