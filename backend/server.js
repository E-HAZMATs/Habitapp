const express = require ('express');
const cors = require('cors');
require('dotenv').config();
const i18n = require('i18n')
const path = require('path')
const {sequelize} = require('./models')
const userRouter = require('./routers/user.router')
async function connectToDB(){
    try{
        await sequelize.authenticate();
        console.log('Connected to DB ^_^')
    }
    catch (error) {
        console.error("Something went wrong while connecting to the DB!", error)
    }
}

async function startServer() {

    i18n.configure({
        locales: ['ar', 'en'],
        defaultLocale: 'ar',
        directory: path.join(__dirname, 'localization'),
        header: 'accept-language',
        queryParameter: 'lang',
    })

    const app = express();
    
    app.use(cors({
        origin: 'http://localhost:4000' // My angular URL. Didn't set it up yet.
    }));
    app.use(i18n.init)
    app.use(express.json())
    app.use('/user', userRouter)
    app.get('/', (req, res) => {
        res.send('server running...')
    })
    
    const PORT = process.env.PORT || 3333;
    
    await connectToDB();
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

startServer();



