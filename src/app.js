import { app } from './middleware/app.middleware.js';
import routes from './routes/index.route.js';
import { connectDB } from './db/database.js';
import LoggerLib from './libs/Logger.lib.js';

const port = process.env.PORT || 3000;

//routes
app.get('/', (req, res) => res.status(200).json({ message: 'OK!' }));
app.use('/api', routes);

app.use((req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});

const start = async () => {
    try{
        await connectDB();
        app.listen(port,LoggerLib.log(`${process.env.APP_NAME} Server running on ${port}, env ${process.env.NODE_ENV}`))
    } catch (e) {
        LoggerLib.error(e)
    }
}

start()
