import Router from 'express';
import { Request, Response } from 'express';

const testRouter = Router();

testRouter.get('/', (req: Request, res: Response) => {
	res.send('Server is up and running');

})

export default testRouter