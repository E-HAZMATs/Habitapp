const express = require ('express');
const cors = require('cors');
require('dotenv').config();
const i18n = require('i18n')
const path = require('path')
const cookieParser = require('cookie-parser')
const {sequelize} = require('./models')
const routers =  require('./routers')
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
        defaultLocale: 'en',
        directory: path.join(__dirname, 'localization'),
        header: 'accept-language',
        queryParameter: 'lang',
    })

    const app = express();
    
    app.use(cors({
        origin: 'http://localhost:4000', // My angular URL. Didn't set it up yet.
        credentials: true
    }));
    app.use(i18n.init)
    app.use(cookieParser())
    app.use(express.json())
    app.use(routers)
    app.get('/', (req, res) => {
        res.send('server running...')
    })
    
    const PORT = process.env.PORT || 3333;
    
    await connectToDB();
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

startServer();



