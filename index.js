const express = require('express');
const db = require('./config/db');
const app = express();


app.use(express.json());

// checked db conection
(async function(){
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
})();

const port = process.env.PORT | 5000;

app.get('/', (req, res)=>{
    res.send('hello word');
});

// Router
const userRouter = require('./route/userRoute');
app.use('/users', userRouter);

const blogRouter = require('./route/blogRouter');
app.use('/blogs', blogRouter);

app.listen(port, ()=>{
    console.log(`Serve's running on port: ${port}`);
});