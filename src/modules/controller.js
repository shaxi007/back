import jwt from '../lib/jwt.js'
import fs from 'fs'
import path from 'path'

const TODO = (req,res)=>{
	try {
		if( !req.headers.token) throw 'The token required!'
		let payload = jwt.verify(req.headers.token)
		let { userId } = payload
		let todos  = fs.readFileSync(path.join(process.cwd(),'src','database','todos.json'),'utf8')
		todos = todos ? JSON.parse(todos) : []
		res.writeHead(200, {'Content-Type':'application/json'})
		res.write(
			JSON.stringify({
				status: 200,
				message: 'succes',
				data : todos
			})
		)
		return res.end()
	}catch(err) {
		res.writeHead(500, {'Content-Type':'application/json'})
		res.write(
			JSON.stringify({
				status: 500,
				message: err
			})
		)
		return res.end()
	}
}



const DELETE = (req,res) =>{
	try {
		let data = ''
		req.on('data',chunk => data+=chunk)
		req.on('end',() => {
			if( !req.headers.token) throw 'The token required!'
			let payload = jwt.verify(req.headers.token)
			let { todo_id } = JSON.parse(data)
			let { userId } = payload
			let todos  = fs.readFileSync(path.join(process.cwd(),'src','database','todos.json'),'utf8')
			todos = todos ? JSON.parse(todos) : []
			let userTodos = todos.find(todo => todo.userId == userId && todo_id == todo.todo_id)
			console.log(userTodos)
			if(userTodos){
				let respon = todos.filter(todo => todo.todo_id != todo_id)
				fs.writeFileSync(path.join(process.cwd(),'src','database','todos.json'),JSON.stringify(respon,null,4))
				res.writeHead(200, {'Content-Type':'application/json'})
				res.write(
						JSON.stringify({
						status: 200,
						message: 'ok'
					})
				)
				return res.end()
			}else {
				res.writeHead(404, {'Content-Type':'application/json'})
				res.write(
						JSON.stringify({
						status: 404,
						message: 'Not found'
					})
				)
				return res.end()
			}
		})	
	}catch(error) {
		res.writeHead(500, {'Content-Type':'application/json'})
		res.write(
			JSON.stringify({
				status: 500,
				message:error
			})
		)
		return res.end()
	}
}
export {
	TODO,
	DELETE
}