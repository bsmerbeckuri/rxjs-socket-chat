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
          <div>
              <ul className="message-list/"/>
              <div className="action-bar">
                  <label className="user-select-label">
                      <select name="" id="" className="user-select"/>
                  </label>
                  <input autoComplete="off" className="message-input"/>
                  <button className="send-btn">Send</button>
              </div>
          </div>
      );
  }
}
export default App;