var request = require('request')
var _uri = 'https://registry.hub.docker.com/u/onebytecode/onebytebot/trigger/3ec0f350-e5aa-4284-9e4d-fbce96691ba6/'
console.log('Hoocking');
request({
  method: 'POST',
  uri: _uri,
  multipart: [
      {
        'content-type': 'application/json',
        body: JSON.stringify({})
      }
    ],
})
