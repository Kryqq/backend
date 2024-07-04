import Router from 'express';
const testRouter = Router();

testRouter.get('/', (req, res) => {
	res.send('Server is up and running');

})

export default testRouter