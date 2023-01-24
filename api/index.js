//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
require('dotenv').config();
const server = require('./src/app.js');
const {conn} = require('./src/db.js');
const {RAZASURL} = require('./constants.js');
const axios = require('axios');
const {getApiTemperaments} = require('./src/utils.js');
const {Temperament} = require('./src/db.js');
const PORT = process.env.PORT || 3001;

// Syncing all the models at once.
if (process.env.NODE_ENV === 'development') {
	conn
		.sync({force: true})
		.then(() => {
			server.listen(PORT, () => {
				console.log('Listening at', PORT); // eslint-disable-line no-console

				axios
					.get(RAZASURL)
					.then((res) => {
						let temps = getApiTemperaments(res.data);
						let promisesTemps = temps.map((temperament) =>
							Temperament.create({name: temperament})
						);
						return Promise.all(promisesTemps);
					})
					.catch((err) => console.log(err));
			});
		})
		.catch((err) => console.log(err));
} else {
	conn
		.sync({force: false})
		.then(() => {
			server.listen(PORT, () => {
				console.log('Listening at', PORT); // eslint-disable-line no-console
			});
		})
		.catch((err) => console.log(err));
}
