const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io');
const {Observable, from, of, fromEvent} = require('rxjs');
const {switchMap, mergeMap, map, takeUntil} = require('rxjs/operators');
const { getAllUsers } = require('./utilities');


const port = process.env.PORT || 5000;

app.use(express.static('public'));
http.listen(port, () => console.log('listening on port' + port));


const io$ = of(io(http));

const connection$ = io$.pipe(
    switchMap(io => {
        return fromEvent(io, 'connection').pipe(
            map(client => ({io, client}))
        );
    })
);

const disconnect$ = connection$.pipe(
  mergeMap(({client}) => {
      return fromEvent(client, 'disconnect').pipe(
          map(() => client)
      );
  })
);

const listen = (event) => {
  return connection$.pipe(
      mergeMap(({io, client}) => {
          return fromEvent(client, event).pipe(
              takeUntil(fromEvent(client, 'disconnect')),
              map(data => ({io, client, data}))
          );
      })
  );
};

listen('save username')
    .subscribe(({io, client, data}) => {
        io.sockets.sockets[client.id].username = data;

        client.broadcast.emit('new user', {
            id: client.id,
            username: data
        })
    });

connection$
    .subscribe(({io, client}) => {
        client.emit('all users', getAllUsers(io.sockets.sockets));
    });

disconnect$.subscribe(client => {
    client.broadcast.emit('remove user', client.id);
});

listen('chat message').subscribe(({client, data}) => {
   if(!data.socketId) return;

   const messageObj = {
       from: client.username,
       message: data.message
   };

   if(data.socketId === 'everyone'){
       client.broadcast.emit('chat message', messageObj);
   } else {
       client.broadcast.to(data.socketId).emit('chat message', messageObj);
   }

});

connection$.subscribe(() => console.log('connected'));
disconnect$.subscribe(() => console.log('disconnected'));

// // API calls
// app.get('/api/hello', (req, res) => {
//     res.send({ express: 'Hello From Express' });
// });
//
// if (process.env.NODE_ENV === 'production') {
//     // Serve any static files
//     app.use(express.static(path.join(__dirname, 'client/build')));
//
//     // Handle React routing, return all requests to React app
//     app.get('*', function(req, res) {
//         res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//     });
// }
//
// app.listen(port, () => console.log(`Listening on port ${port}`));