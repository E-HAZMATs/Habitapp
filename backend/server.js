const express = require ('express');
const cors = require('cors');
require('dotenv').config();
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

    const app = express();
    
    app.use(cors({
        origin: 'http://localhost:4000' // My angular URL. Didn't set it up yet.
    }));
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



