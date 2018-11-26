import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import DeletedMessage from './DeletedMessage';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label
} from 'recharts';

class App extends Component {
  constructor() {
    super();
    this.state = {
      sensor1: 0,
      sensor1alldata: [],
      errors: '',
      sensor2: 0,
      sensor2alldata: [],
      showDeletedMessage: false
    };
  }

  dofilter(inarray) {
    var array = [];
    var i = 0;
    inarray.forEach(obj => {
      array.push({
        seq: ++i,
        name: obj.name,
        value: obj.value
      });
    });
    this.setState({ sensor1alldata: array });
    this.setState({ sensor2alldata: array });
  }

  componentDidMount() {
    setInterval(() => {
      axios
        .get('https://assign307crserver.herokuapp.com/getsensor1')
        .then(result => {
          this.setState({ sensor1: result.data });
        })
        .catch(err => {
          this.setState({ errors: err.response.data });
        });
      axios
        .get('https://assign307crserver.herokuapp.com/getsensor2')
        .then(result => {
          this.setState({ sensor2: result.data });
        })
        .catch(err => {
          this.setState({ errors: err.response.data });
        });
    }, 3000);
    setInterval(() => {
      axios
        .get('https://assign307crserver.herokuapp.com/getallsensor1')
        .then(result => {
          this.dofilter(result.data);
        })
        .catch(err => {
          this.setState({ errors: err.response.data });
        });
      axios
        .get('https://assign307crserver.herokuapp.com/getallsensor2')
        .then(result => {
          this.dofilter(result.data);
        })
        .catch(err => {
          this.setState({ errors: err.response.data });
        });
    }, 5000);
  }

  deleteAllHandler = () => {
    axios
      .get('https://glacial-citadel-67468.herokuapp.com/deleteall')
      .then(result => {
        this.setState({ showDeletedMessage: true });
      })
      .catch(err => {
        console.log('unable to delete: ', err);
      });
  };

  alertDismissHandler = () => {
    this.setState({ showDeletedMessage: false });
  };


  render() {
    return (
      <div>
        <div className="jumbotron text-center header">
          <h1>Sensors Data</h1>
          <p>Displays sensors data received from NodeMCU</p>
        </div>

        <div className="container">
          <DeletedMessage
            show={this.state.showDeletedMessage}
            alertDismiss={this.alertDismissHandler}
          />
          <div className="row">
            <div className="text-center container col-sm-4">
              <div className="row">
              <div className="text-center container col-sm-6">
                 <div id="deleteall">
                   <br />
                   <button
                     className="btn btn-primary"
                     onClick={this.deleteAllHandler}
                   >
                     <h4>Delete All</h4>
                   </button>
                 </div>
               </div>
               <div className="text-center container col-sm-6">
                <div className="sensorvalue">
                  <label>
                    <h4>Virbration Sensor Value</h4>
                  </label>
                  <br />
                  <label>
                    <h4>{this.state.sensor1} </h4>
                  </label>
                </div>
              </div>
              <div>
                <label />
              </div>
              <div className="row">
                <div className="sensortable">
                  <label>
                    <h4>Vibration Sensor Table</h4>
                  </label>
                  <br />
                  <div>
                    <ReactTable
                      data={this.state.sensor1alldata}
                      columns={[
                        {
                          Header: 'Sequence',
                          accessor: 'seq'
                        },
                        {
                          Header: 'Value',
                          accessor: 'value'
                        }
                      ]}
                      defaultPageSize={5}
                      className="-striped -highlight"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center container col-sm-8">
              <div className="sensorgraph">
                <label>
                  <h4>Vibration Sensor Graph</h4>
                </label>
                <br />
                <LineChart
                  width={700}
                  height={400}
                  data={this.state.sensor1alldata}
                >
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  <XAxis dataKey="seq">
                    <Label position="insideBottomRight" dy={10}>
                      Sequence
                    </Label>
                  </XAxis>
                  <YAxis dataKey="value">
                    <Label position="insideTopLeft" dx={-10}>
                      Value
                    </Label>
                  </YAxis>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                </LineChart>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div className="container">
          <div className="row">
            <div className="text-center container col-sm-4">
              <div className="row">
                <div className="sensorvalue">
                  <label>
                    <h4>Ultrasonic Sensor Value</h4>
                  </label>
                  <br />
                  <label>
                    <h4>{this.state.sensor2} </h4>
                  </label>
                </div>
              </div>
              <div>
                <label />
              </div>
              <div className="row">
                <div className="sensortable">
                  <label>
                    <h4>Ultrasonic Sensor Table</h4>
                  </label>
                  <br />
                  <div>
                    <ReactTable
                      data={this.state.sensor2alldata}
                      columns={[
                        {
                          Header: 'Sequence',
                          accessor: 'seq'
                        },
                        {
                          Header: 'Value',
                          accessor: 'value'
                        }
                      ]}
                      defaultPageSize={5}
                      className="-striped -highlight"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center container col-sm-8">
              <div className="sensorgraph">
                <label>
                  <h4>Ultrasonic Sensor Graph</h4>
                </label>
                <br />
                <LineChart
                  width={700}
                  height={400}
                  data={this.state.sensor2alldata}
                >
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  <XAxis dataKey="seq">
                    <Label position="insideBottomRight" dy={10}>
                      Sequence
                    </Label>
                  </XAxis>
                  <YAxis dataKey="value">
                    <Label position="insideTopLeft" dx={-10}>
                      Value
                    </Label>
                  </YAxis>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                </LineChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
