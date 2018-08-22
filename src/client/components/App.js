/* eslint-disable react/destructuring-assignment,react/jsx-filename-extension,no-undef */
import React, { Component } from 'react';
import {Observable, of, fromEvent, from} from 'rxjs';
import {withLatestFrom, map, tap} from 'rxjs/operators'
import connection from '../connection';
import {requestUsername, addUser, removeUser, addMessage} from '../utilities';
import {send, listen} from '../connection';
import submitAction$ from '../actions';


class App extends Component {

    constructor(props){
        super(props);
        self.state = {
            username: ''
        };

    }


    componentDidMount() {
        this.username$ = of(requestUsername());

        send(this.username$, 'save username');

        listen('new user').subscribe(user => {
            addUser(user.id, user.username);
            console.log('add user');
        });

        listen('all users').subscribe(users => {
            addUser('everyone', 'Everyone', true);
            users.forEach(user => addUser(user.id, user.username));
        });

        listen('remove user').subscribe(id => {
            removeUser(id);
            console.log('remove user')
        });



        const submitMessage$ = from(submitAction$).pipe(
            withLatestFrom(this.username$),
            tap(([data, username]) => addMessage(username, data.message))).pipe(
            map(([data]) => data)
        );

        send(submitMessage$, 'chat message');

        listen('chat message').subscribe(data => {
            addMessage(data.from, data.message);
            console.log('chat');
        });

    }


    //
    // callApi = async () => {
    //     const response = await fetch('/api/hello');
    //     const body = await response.json();
    //
    //     if (response.status !== 200) throw Error(body.message);
    //
    //     return body;
    // };

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