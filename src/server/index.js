const express = require('express');
const {Observable, of, from} = require('rxjs');
const {filter} = require('rxjs/operators');



// app.use(express.static('dist'));
// app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
// app.listen(8080, () => console.log('Listening on port 8080!'));
//

const app = express();
const port = process.env.PORT || 5000;



// API calls
app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));