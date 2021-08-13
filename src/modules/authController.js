import fs from 'fs'
import path from 'path'
import jwt from '../lib/jwt.js'

const REGISTER = (req,res) =>{
	let data = ''
	req.on('data',chunk => data+=chunk)
	req.on('end',() => {
		let { contact , age , gender,username, password} = JSON.parse(data)
		let users = fs.readFileSync(path.join( process.cwd(), 'src', 'database', 'users.json'), 'utf8')
		users = users ? JSON.parse(users) : []
		let user  = users.find( user => user.username == username  )
		if(user) {
			res.writeHead(409, {'Content-Type':'application/json'})
			res.write(
				JSON.stringify({
					status:409,
					message: 'The user already exists',
					token : jwt.sign({userId : user.user_id}),
					userId:user.user_id
				})
			)
			return res.end()
		}else {
			let user_id = users.length ? users[users.length-1].user_id + 1 : 1
			let newUser = {user_id ,contact , age , gender,username, password }
			users.push(newUser)
			fs.writeFileSync(path.join(process.cwd(),'src','database','users.json'), JSON.stringify(users, null, 4))
			res.writeHead(201, {'Content-Type':'application/json'})
			res.write(
				JSON.stringify({
					status:201,
					message: 'The user has succesfully registered',
					token : jwt.sign({userId : user_id}),
					userId: user_id
				})
			)
			return res.end()
		} 
	})

}
const LOGIN = (req,res) =>{
	let data = ''
	req.on('data',chunk => data+=chunk)
	req.on('end',() => {
		let { username, password} = JSON.parse(data)
		let users = fs.readFileSync(path.join( process.cwd(), 'src', 'database', 'users.json'), 'utf8')
		users = users ? JSON.parse(users) : []
		let user  = users.find( user => user.username == username && user.password == password )
		if(user) {
			res.writeHead(200, {'Content-Type':'application/json'})
			res.write(
				JSON.stringify({
					status:200,
					message: 'The user has succesfully logged',
					token : jwt.sign({userId : user.user_id}),
					userId : user.user_id
				})
			)
			return res.end()
		}else {
			res.writeHead(401,  {'Content-Type':'application/json'})
			res.write(
				JSON.stringify({
					status:401,
					message: 'Wrong password or username',
					token : null
				})
			)
			return  res.end()
		} 
	})
}

export {
	REGISTER,
	LOGIN
}