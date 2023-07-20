const express = require( "express");
const morgan = require("morgan");
const connectDB = require("./db/connect.js")
const startServer =  require("./server/server.js");
const routes = require ('./routes/index.js');

// Express App 
const app = express();

// Middlewares
app.use(morgan("combined"))
app.use(express.json()) 


// Routes 
app.use(routes);
// Database Connections
connectDB()


// 404 page not found
app.use((req, res, next)=>{
    return res.status(404).send("Page not found ")
})

// Error middleware
app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  });

// Server Connection
startServer(app)