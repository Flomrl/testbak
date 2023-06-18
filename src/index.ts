import express, {Application, Request, Response} from 'express';
import router from './routes';

const port = 3000;
const app: Application = express();

app.use(express.json());
app.use('/', router);

app.use((err: Error, _req: Request, res: Response): void => {
    res.status(500).json({ message: 'Oh no, you broke something!' })
});

export const server = app.listen(port)

export default app