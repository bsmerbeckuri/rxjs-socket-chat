/* eslint-disable react/destructuring-assignment,react/jsx-filename-extension,no-undef */
import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';

class App extends Component {

  constructor(props) {
    super(props);
      this.state = {
          response: ''
      };
  }

  componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
  }

  callApi = async () => {
      const response = await fetch('/api/hello');
      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
  };

  render() {
      return (
          <div className="App">
              <header className="App-header">
                  <img src={ReactImage} className="App-logo" alt="logo" />
                  <h1 className="App-title">Welcome to React</h1>
              </header>
              <p className="App-intro">{this.state.response}</p>
          </div>
      );
  }
}
export default App;