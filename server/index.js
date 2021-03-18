const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const authRouter = require("./routes/auth.routes.js");
const fileRouter = require("./routes/file.routes.js");
const corsMiddleware = require('./middleware/cors.middleware');
const fileUpload = require('express-fileupload')


//create server
const app = express()
// port
// const PORT = 5000
const PORT = config.get('serverPort')

app.use(fileUpload({}));
app.use(corsMiddleware);
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);



const start = async() => {
    try {
        await mongoose.connect(config.get('dbUrl'), { useNewUrlParser: true, useUnifiedTopology: true })
        app.listen( PORT, () => {
            console.log('Server started on port', PORT);
        })
    }catch(error) {
        console.log(error);
    }
}

start()