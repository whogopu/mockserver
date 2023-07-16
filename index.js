const { mockServer } = require('http-mockserver');
const backendService = mockServer.create(8080);
const my99listing = require('./mocks/my99listings.json');
const srpRes = require('./mocks/srpRes.json');
const srpRes400 = require('./mocks/srpRes400.json');
const srpConfig = require('./mocks/srpConfig.json');
const sellerApi1 = require('./mocks/sellerApi1.json');
const sellerApi2 = require('./mocks/sellerApi2.json');
const my99Pms = require('./mocks/pms.json');
const my99seller = require('./mocks/my99seller.json');
const location = require('./mocks/location.json');
const mobilePsi = require('./mocks/mobilePsi.json')
const desktopPsi = require('./mocks/desktopPsi.json')
const widgetTopBanner = require('./mocks/widgetTopBanner.json')
const srpMobileRS = require('./mocks/srp-mobile-RS.json')
const srpMobileRR = require('./mocks/srp-mobile-RR.json')
const srpMobileRP = require('./mocks/srp-mobile-RP.json')
const srpMobileCS = require('./mocks/srp-mobile-CS.json')
const srpMobileCL = require('./mocks/srp-mobile-CL.json')
const srpMobileLocalityRS = require('./mocks/srp-mobile-locality-RS.json')
const srpMobileLocalityRR = require('./mocks/srp-mobile-locality-RR.json')
const srpMobileLocalityRP = require('./mocks/srp-mobile-locality-RP.json')
const srpMobileLocalityCS = require('./mocks/srp-mobile-locality-CS.json')
const srpMobileLocalityCL = require('./mocks/srp-mobile-locality-CL.json')
const srpDesktopRS = require('./mocks/srp-desktop-RS.json')
const srpDesktopRR = require('./mocks/srp-desktop-RR.json')
const srpDesktopRP = require('./mocks/srp-desktop-RP.json')
const srpDesktopCS = require('./mocks/srp-desktop-CS.json')
const srpDesktopCL = require('./mocks/srp-desktop-CL.json')
const srpDesktopLocalityRS = require('./mocks/srp-desktop-locality-RS.json')
const srpDesktopLocalityRR = require('./mocks/srp-desktop-locality-RR.json')
const srpDesktopLocalityRP = require('./mocks/srp-desktop-locality-RP.json')
const srpDesktopLocalityCS = require('./mocks/srp-desktop-locality-CS.json')
const srpDesktopLocalityCL = require('./mocks/srp-desktop-locality-CL.json')

function paginate(array, page_size, page_number) {
	// human-readable page numbers usually start with 1, so we reduce 1 in the first argument
	return array.slice((page_number - 1) * page_size, page_number * page_size);
}

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

backendService.addMock({
	method: 'GET',
	uri: '/discovery-aggregator/srpRes',
	response: {
		body: srpRes,
		headers: {
			"Content-Type": "application/json",
			"Edge-Control": "cache-maxage=60m"
		}
	},
});

backendService.addMock({
	method: 'GET',
	uri: '/discovery-aggregator/srpConfig*',
	response: {
		body: srpConfig
	},
});

backendService.addMock({
	method: 'GET',
	uri: '/pms',
	response: {
		body: my99Pms
	},
});

backendService.addMock({
	method: 'GET',
	uri: '/seller',
	response: {
		body: my99seller
	},
});

backendService.addMock({
	method: 'GET',
	uri: '/location',
	response: {
		body: location
	},
});

backendService.addMock({
	method: 'GET',
	uri: '/seller-profile-service/sellers/profile-search',
	handler: function (req, res) {
		let pageSize = req.query.pageSize || 10;
		let page = req.query.page || 1;

		let orig = JSON.parse(JSON.stringify(sellerApi1));
		let ids = paginate(orig.data, pageSize, page)

		res.send({ ...sellerApi1, data: ids });
	}
});

backendService.addMock({
	method: 'GET',
	uri: '/seller-profile-service/seller/seller-info',
	handler: function (req, res) {
		let profileId = req.query.profileId
		console.log('profileId', profileId)

		if (!profileId || !profileId.length)
			return res.status(400).send("profileId required");

		let orig = JSON.parse(JSON.stringify(sellerApi2));
		let ids = orig.filter(d => profileId.includes(d.profileId + ''))

		res.send(ids);
	}
});

backendService.addMock({
	method: 'GET',
	uri: '/srp/search',
	handler: function (req, res) {
		let platform = req.query.platform
		let type = req.query.type

		let resp = {}

		if(platform == 'DESKTOP') {
			if(type == 'RSL') resp = srpDesktopLocalityRS;
			else if (type == 'RRL') resp = srpDesktopLocalityRR
			else if(type == 'RPL') resp = srpDesktopLocalityRP
			else if(type == 'CSL') resp = srpDesktopLocalityCS
			else if(type == 'CLL') resp = srpDesktopLocalityCL
			else if(type == 'RSL') resp = srpDesktopLocalityRS;
			else if (type == 'RR') resp = srpDesktopRR
			else if(type == 'RP') resp = srpDesktopRP
			else if(type == 'CS') resp = srpDesktopCS
			else if(type == 'CL') resp = srpDesktopCL
			else resp = srpDesktopRS
		} else {
			if(type == 'RSL') resp = srpMobileLocalityRS;
			else if (type == 'RRL') resp = srpMobileLocalityRR
			else if(type == 'RPL') resp = srpMobileLocalityRP
			else if(type == 'CSL') resp = srpMobileLocalityCS
			else if(type == 'CLL') resp = srpMobileLocalityCL
			else if(type == 'RSL') resp = srpMobileLocalityRS;
			else if (type == 'RR') resp = srpMobileRR
			else if(type == 'RP') resp = srpMobileRP
			else if(type == 'CS') resp = srpMobileCS
			else if(type == 'CL') resp = srpMobileCL
			else resp = srpMobileRS
		}
		return res.send(resp);
	}
});

const getDateTime = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const day = now.getDate();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();

	const formattedDate = `${day}/${month}/${year}`;
	const formattedTime = `${hours}:${minutes}`;

	return `${formattedTime}`;
}

backendService.addMock({
	method: 'GET',
	uri: '/pagespeedonline/v5/runPagespeed',
	handler: function (req, res) {
		setTimeout(() => {
			let strategy = req.query.strategy
			let url = req.query.url
			console.log(`recieved at ${getDateTime()} ${strategy}`)

			if (!strategy)
				return res.status(400).send("strategy required");

			let finalRes = JSON.parse(JSON.stringify(strategy == 'mobile' ? mobilePsi : desktopPsi))
			finalRes.lighthouseResult.finalUrl = url

			return res.send(finalRes);
			// return strategy == 'mobile' ? res.send(mobilePsi) : res.send(desktopPsi)
		}, 50000)
	}
});

backendService.addMock({
	method: 'POST',
	uri: '/widget/fetchTopAppBanner/campaign-manager/v2/content',
	handler: function (req, res) {
		setTimeout(() => {
			return res.send(widgetTopBanner)
			// return strategy == 'mobile' ? res.send(mobilePsi) : res.send(desktopPsi)
		}, 20000)
	}
});


