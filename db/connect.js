const config = require ("../config/default.js")
const mongoose = require ("mongoose")

const connectDB = async () =>{
    try {
        await mongoose.connect(config.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        
        })
        console.log("MongoDB is Connected")
    } catch (error) {
        console.log("MongoDB Connection Error: ",error )
        process.exit(1)
    }
}

// export default connectDB
module.exports = connectDB;