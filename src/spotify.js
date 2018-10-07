const url = require('url');
const http = require('http');
const open = require('open');
const Spotify = require('spotify-web-api-node');
const configuration = require('./configuration');
const logging = require('./logging');

const scopes = ['user-read-currently-playing'];

let client = null;

module.exports = {
    login: () => new Promise((resolve, reject) => {
        const newClient = new Spotify({
            clientId: configuration.clientId,
            clientSecret: configuration.clientSecret,
            redirectUri: `http://localhost:${configuration.port}`
        });

        const app = http.createServer((req, res) => {  
            const query = url.parse(req.url, true).query;
            const code = query.code;

            if (!code) return;

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('<script>window.close();</script>');

            newClient.authorizationCodeGrant(code).then(data => {            
                newClient.setAccessToken(data.body['access_token']);
                newClient.setRefreshToken(data.body['refresh_token']);
        
                app.close();
                logging.log('server stopped');

                client = newClient;
                logging.log('logged in');
                resolve(client);
            }).catch(e => reject(e));
        });

        app.listen(configuration.port, '127.0.0.1');
        logging.log('server started');
        // app.close()

        open(newClient.createAuthorizeURL(scopes, 'mini', false));
    }),
    getArtwork: () => new Promise((resolve, reject) => {
        if (client == null) reject(new Error('you have to login first'));

        client.getMyCurrentPlayingTrack().then(response => 
        {
            if (response.statusCode == 200) {
                const images = response.body.item.album.images;
                const image = images.sort((a, b) => b.width - a.width)[0].url;
                resolve(image);
            } else {
                resolve(null);
            }
        }).catch(error => reject(error));
    })
}