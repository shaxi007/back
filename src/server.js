import http from 'http'
import fs from 'fs'
import path from 'path'
import { PORT, host } from './config.js'
import Express from './lib/express.js'
import { REGISTER, LOGIN} from './modules/authController.js'
import { TODO,DELETE } from './modules/controller.js'
import { UPDATE,QOSHISH } from './modules/update.js'

const server = http.createServer((req,res)=>{
	res.setHeader('Access-Control-Allow-Origin','*');
  	res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Access-Control-Allow-Origin, token');
  	res.setHeader('Access-Control-Allow-Methods', 'GET,POST, DELETE, PUT');
  	if(req.method == 'OPTIONS') return res.end();
	const app =  new Express(req,res);
	app.get('/',(req,res)=> res.end('ok'))
	app.post('/register',REGISTER)
	app.post('/login',LOGIN)

	app.get('/todos',TODO)

	app.delete('/delete',DELETE)

	app.put('/update',UPDATE)
	
	app.post('/qoshish',QOSHISH)
})

server.listen(PORT,()=> console.log('Server ishga tushdi http://'+host+':'+PORT))