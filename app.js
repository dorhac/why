/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var client_id = '8e1c201ff6644175b1a1087d702cbde2'; // Your client id
var client_secret = ''; // Your secret
var redirect_uri = 'http://localhost:8888/callback/'; // Your redirect uri
//get new code in advance
var playerOAuth = 'BQBramn8BtzVrAH7IRxX6Btbe-hEVGlZukhBlQ9L1MOFB67owxgQ4PpL44zE5d_xDGEhgLOxE27JY-5CamsLWvIeovfUqWYYvVKWfzmoLfQEOd_hTbzyB7ynKTnQcfDdJ1AaITdCYnjLX8ggFoYIBfj_B2S6HKekUhchqv7wQw8276zW7xs90Sp9sdh22Sl1syeAQOl0ne0Jqaa9ns6SfXzvSuexRqil-Ois6FlDUWGg-Iux'
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What is your secret key? ', (answer) => {
  client_secret = answer;
  console.log(`Lets go!`);

  rl.close();
});
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// function addTracksToPlaylist(username, playlist, tracks, callback) {
// 	console.log('addTracksToPlaylist', username, playlist, tracks);
// 	var url = 'https://api.spotify.com/v1/users/' + username +
// 		'/playlists/' + playlist +
// 		'/tracks'; // ?uris='+encodeURIComponent(tracks.join(','));
// 	$.ajax(url, {
// 		method: 'POST',
// 		data: JSON.stringify(tracks),
// 		dataType: 'text',
// 		headers: {
// 			'Authorization': 'Bearer ' + g_access_token,
// 			'Content-Type': 'application/json'
// 		},
// 		success: function(r) {
// 			console.log('add track response', r);
// 			callback(r.id);
// 		},
// 		error: function(r) {
// 			callback(null);
// 		}
// 	});
// }
var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-top-read user-read-private user-read-email playlist-modify-public';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
          var emD = "dddor1992@gmail.com"; 
          if(emD.match(body.email)){
            playerOAuth = access_token;
            console.log('Chaka Chaka!')
          }
        });

        var topSongs = {
          url: 'https://api.spotify.com/v1/me/top/tracks',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        request.get(topSongs, function(error, response, body) {
          console.log('SongsId');
          //var ids = new Array;
          // addTracksToPlaylist('22png6tacmre3yyz4m7d3hurq', '6E9rhng3Cp3lSSwRO41fdU', body, function() {
          //   console.log('tracks added.');
          //   $('#playlistlink').attr('href', 'spotify:user:'+'22png6tacmre3yyz4m7d3hurq'+':playlist:'+'6E9rhng3Cp3lSSwRO41fdU');
          //   $('#creating').hide();
          //   $('#done').show();
          // });
          //{"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M"]}
        //});
        var tracks = [];
        for(i = 0;i<5;i++){
          tracks.push(body.items[i].uri);
          console.log(i+' : '+tracks);
        }
        console.log('BBB:'+body);
        var addSong ={
          url: 'https://api.spotify.com/v1/users/22png6tacmre3yyz4m7d3hurq/playlists/6E9rhng3Cp3lSSwRO41fdU/tracks',
          body: JSON.stringify({
            'uris': tracks
          }),
          dataType: 'json',
          headers: { 'Authorization': 'Bearer ' + playerOAuth ,'Content-Type': 'application/json'},

        };
        request.post(addSong,function(error, response, body){
          console.log(body);
        });
        //Last ver***
      //   for(i = 0;i<5;i++){
      //     console.log('uri' + body.items[i].uri);
      //     var uriF = body.items[i].uri;
      //     //console.log('uri sub:'+uriF.substring(14,35));
      //     var uriD = '{"uris": ["'+uriF+'"]}';
      //     console.log('log:'+JSON.stringify(uriD));
      //     request.post('https://api.spotify.com/v1/users/22png6tacmre3yyz4m7d3hurq/playlists/6E9rhng3Cp3lSSwRO41fdU/tracks',{
      //     data: JSON.stringify({"uris":uriF}),dataType: 'json',
      //     headers: { 'Authorization': 'Bearer ' + playerOAuth ,'Content-Type': 'application/json'},
      //      json: true,
      //   }, function(error, response, body){
      //   console.log(body);
      //   });
      // }
          // for(i = 0;i<5;i++){
          //   var urid = JSON.stringify(body.items[i].uri);
          //   request.post({data: urid,dataType: 'text', url: 'https://api.spotify.com/v1/users/22png6tacmre3yyz4m7d3hurq/playlists/6E9rhng3Cp3lSSwRO41fdU/tracks',
          //   headers: { 'Authorization': 'Bearer ' + access_token ,'Content-Type': 'application/json'},
          //   json: true },function(error, response, body){
          //     console.log(body);
              

          //   });
          //   console.log(urid);
          // }
          console.log('done');
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});



app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
