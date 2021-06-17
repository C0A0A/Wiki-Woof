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
const server = require('./src/app.js');
const {conn} = require('./src/db.js');
const {RAZASURL} = require('./constants.js');
const axios = require('axios');
const {getApiTemperaments} = require('./utils.js');
const {Temperament} = require('./src/db.js');
const bucket = require('./src/storage.js');
const PORT = process.env.PORT || 3000;

// Syncing all the models at once.
conn.sync({force: true}).then(() => {
	server.listen(PORT, () => {
		console.log('%s listening at 3001');
		// eslint-disable-line no-console
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
	//console.log('Conexión exitosa a ' + bucket.name);
});
