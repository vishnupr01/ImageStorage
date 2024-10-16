import app from './frameworks/config/app'
import {createServer} from 'http'
import connectDB from './frameworks/config/db'


connectDB()

const server= createServer(app)
const PORT=process.env.PORT||5000
server.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`);
  
})