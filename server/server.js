const config = require("../config/default.js")

const startServer = async (app) =>{
    try {
        const{ host, port} =  config
        app.listen(port, () =>{
            console.log(`server is running on http://${host}:${port}`)
        })
    } catch (error) {
        console.log("Server Connection Error: ",error )
        process.exit(1)
    }
}

module.exports = startServer;