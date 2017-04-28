import React, { Component } from 'react';
import logo from './logo.svg';
import Graph from './Graph';
import GraphInput from './GraphInput';
import CrawlSimulator from './CrawlSimulator';
import StochasticBuilder from './StochasticBuilder';
import EigenvalueEstimator from './EigenvalueEstimator';
import * as d3 from "d3";
import './App.css';
import './Graph.css';

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
                <p>
                  In 1996 at Stanford University, future Google founders Larry Page and Sergey Brin began working on an improved search engine.
                  At the time, the web was in its infancy, and while it did have search engines, they were not anything like the ones we know today.
                  They mostly worked by matching search terms against the text in a webpage. They could find a list of pages including the search terms, but in what order would it present them?
                  If the search engine finds matches on a personal blog and on a large university webpage, the engine should know that the university is more credible and put it above the blog.
                  Determining a measure for a website's "credibility" is not easy, and it is the problem the Google solved with PageRank.
                </p>

                <p>
                  The key idea is to think of the internet as a network. 
                  Each website is a vertex in a graph, and there is a connection from website $A$ to website $B$ if there is a link to $B$ on page $A$.
                  Intuitively, it should make sense that a website that has a lot of other websites pointing to it is "credible":
                  there are an enormous amount of links across the web to Wikipedia while there are very few to someone's personal blog.
                </p>

                <p>
                  But how does the PageRank Algorithm actually take such a network and give each vertex an importance? Read on to find out.
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h2>Step 1: Create/Select Test Data</h2>
                <p>
                  It's easiest to understand PageRank using an example. You can either create your own example or select from ones we have already created.
                  Remember, each website is a node, and an edge from $A$ to $B$ means there is a link on page $A$ that goes to page $B$.
                </p>
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
                <p>
                  Okay, we now have our small version of the internet. To use the PageRank Algorithm, however, we must represent the internet in a data
                  form we can manipulate. We represent the graph using an adjacency matrix. For each node, we add each of its neighbors to the adjacency matrix
                  when we discover it. Then we iterate through each of its neighbors in a Depth First Search like manner.
                </p>
                <CrawlSimulator nodes={this.state.nodes} links={this.state.links} update={this.state.update} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h2>Step 3: Build the Stochastic Matrix</h2>
                <p>
                  Now we can use the adjaceny matrix to come up with a metric which measures the importance of a website.
                  The basic idea mentioned in the introduction is to give higher importance to those sites with more links going to them.
                  The actual method is more subtle. A website's importance is the probability a "random surfer" would come across the page by just
                  clicking on links across the web. This is called the "Random Surfer Model." Simply imagine a person going to webpages randomly clicking on links and sometimes putting a site in to the address bar. This is the "random surfer."
                </p>
                <p>
                  In order to calculate the probability that the random surfer is eventually on page $B$, we first say that the random surfer is equally likely to be on any of the pages we have discovered in the beginning.
                  Once the random surfer is on a page, there are then probabilities that the surfer will go to each of the other pages in our model.
                  For the purposes of our model, we say that the user goes to a page that is linked to on the current page with probability $C$. Of course, a surfer may not simply click a link on the page,
                  they may type a link in their address bar for instance. We assume this happens with probability $1-C$. 
                </p>

                <p>
                  Suppose you are on Page $A$, there are $N$ pages in our internet, and Page $A$ has $D$ many outgoing links. 
                  We set the probability of going from Page $A$ to Page $B$ is given by three cases:
                </p>
                <p>
                  First, if Page $A$ has no outgoing links, the random surfer must type a link into the address bar. We say we are equally likely to go to any page in the model, so the probability  of going from Page $A$ to Page $B$ is simply $$1/N$$
                </p>
                <p>
                  Second, if Page $B$ is not an outgoing link from $A$, though we know the random surfer can't reach the page via a link, he can enter it into the address bar.
                  We know we have probability $1-C$ of entering any page in our model with equal chance, so the probability is $$(1-C)/N$$
                </p>
                <p>
                  Lastly, if Page $B$ is an outgoing link from $A$, we have both the $1-C$ probability of going to it by typing in the address bar and the $C$ probability of getting it from clicking on a link.
                  Since the $1-C$ probability is evenly split among the $N$ pages and $C$ probability is evenly split among the $D$ pages (remember $D$ is the number of outgoing links), the probability of going from $A$ to $B$
                  is  $$(1-C)/N + C/D$$
                </p>
                <p>
                  So remembering that $A$<sub>$ij$</sub> is $1$ if there is a link from $i$ to $j$ (i.e $j$ is an outgoing link from $i$) and $0$ otherwise, the second and third case where $D$ is not zero reduce to:
                  {'$$(1-C)/N + C * A_{ij}/D$$'}
                </p>
                <p>
                  Using these formulas we build a "Stochastic Matrix" $S$ whose $i$th row and $j$th column has the probability of going from page $i$ to page $j$.
                </p>

                <StochasticBuilder nodes={this.state.nodes} links={this.state.links} update={this.state.update} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h2>Step 4: Estimate the Dominant Eigenvector</h2>
                <p>
                  Now we have a matrix $S$ which tells us the probability of going from one page to the next. How do we use this matrix to tell us the probability of our "random surfer" being on the page?
                </p>
                <p>
                  Suppose we only had two pages: Page $A$ and Page $B$, and our stochastic matrix $S$ was as follows
                </p>

                <center><table className="matrix">
                    <tbody>
                        <tr>
                          <td></td>
                          <td>A</td>
                          <td>B</td>
                        </tr>
                        <tr>
                            <td>A</td>
                            <td>.25</td>
                            <td>.75</td>
                        </tr>
                        <tr>
                            <td>B</td>
                            <td>.33</td>
                            <td>.66</td>
                        </tr>
                    </tbody>
                </table></center>

                <p>
                  We start of with an equal chance of being on page A and page B 50% each. This is given by the vector $R$
                </p>

                <center><table className="matrix">
                    <tbody>
                        <tr>
                          <td></td>
                          <td>A</td>
                          <td>B</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>.5</td>
                            <td>.5</td>
                        </tr>
                    </tbody>
                </table></center>

                <p>
                  Using this, we can find the probability of being at Page A in the next step. We are on A with a .5 chance and we have a .25 chance of going to A from A, .25 *.5 =.125.
                  We are on B with a .5 chance, and we have a .33 chance of going to A from B, .5*.33  = .165. Summing the two, we get .125+.165 = .29. So are chance of being on A is .29
                </p>

                <p>
                  We can do the same for B. We are on A with .5 chance and have a .75 chance of going from A to B, .75*.5 = .375. We are on B with .5 chance and have .66 chance of going to B from B, .5*.66 = .33.
                  Hence we have a .33 + .375 = .705 chance of being on B.
                </p>

                <p>
                  This new values, give us a new vector $R$ which reflects the probability of being on a page
                </p>

                <center><table className="matrix">
                    <tbody>
                        <tr>
                          <td></td>
                          <td>A</td>
                          <td>B</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>.29</td>
                            <td>.705</td>
                        </tr>
                    </tbody>
                </table></center>

                <p>
                  Looking back at the calculations we did to get the new value of $R$, we can realize that this is exactly the matrix product $R*S$, which greatly simplifies our notation.
                  Moreover, to get the probabilities at the next stage, we simply multiply by S again! Thus, the probabilities at the nth stage is simply given by $R*S^n$.
                </p>

                <p>
                  This matrix power formula has some very nice properties. Most significantly, the vector we get from repeated matrix multiplications actually converges! In linear algebra jargon, the resulting 
                  vector is called the "dominant eigenvector." Hence we can calculate the ultimate distribution by repeated multiplication until our error term is within a desired bound. (Here our "error" is given by the 
                  norm between each successive iteration of the algorithm.) This is all we do in this step!
                </p>


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
