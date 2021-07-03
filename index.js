const { mockServer } = require('http-mockserver');
const backendService = mockServer.create(8080);
const my99listing = require('./mocks/my99listings.json');

// Static mock
backendService.addMock({
	method: 'GET',
	uri: '/my/url/*',
	response: {
		body: 'Hello world'
	}
});

// Dynamic mock
let counter = 0;
backendService.addMock({
	method: 'GET',
	uri: '/my/other/url',
	handler: function (req, res) {
		counter++;
		res.send(`Counter: ${counter}`);
	}
});

// to mock my99 all listings
backendService.addMock({
	method: 'GET',
	uri: '/seller-aggregator/my99/listing/getAll*',
	response: {
		body: my99listing
	},
});


