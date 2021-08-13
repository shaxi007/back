import jwt from '../lib/jwt.js'
import fs from 'fs'
import path from 'path'

const UPDATE = (req,res) =>{
	try {
		let data = ''
		req.on('data',chunk => data+=chunk)
		req.on('end',() => {
			if( !req.headers.token) throw 'The token required!'
			let payload = jwt.verify(req.headers.token)
			let { todo_id,todo_time,todo_text } = JSON.parse(data)
			let { userId } = payload
			let todos  = fs.readFileSync(path.join(process.cwd(),'src','database','todos.json'),'utf8')
			todos = todos ? JSON.parse(todos) : []

			let up = todos.find(todo => todo.todo_id == todo_id && todo.userId == userId)
			if(up){
				if(todo_text) up.todo_text = todo_text
				if(todo_time) up.todo_time = todo_time
				fs.writeFileSync(path.join(process.cwd(),'src','database','todos.json'),JSON.stringify(todos,null,4))
				res.writeHead(200, {'Content-Type':'application/json'})
				res.write(
						JSON.stringify({
						status: 200,
						message: 'resource append successfully'
					})
				)
				return res.end()
			}else {
				res.writeHead(200, {'Content-Type':'application/json'})
				res.write(
						JSON.stringify({
						status: 200,
						message: 'resource append successfully'
					})
				)
				return res.end()
			}
		})	
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

const QOSHISH = (req,res) =>{
	try {
		let data = ''
		req.on('data',chunk => data+=chunk)
		req.on('end',() => {
			if( !req.headers.token) throw 'The token required!'
			let payload = jwt.verify(req.headers.token)
			let todos  = fs.readFileSync(path.join(process.cwd(),'src','database','todos.json'),'utf8')
			todos = todos ? JSON.parse(todos) : []
			let { todo_time,todo_text,username } = JSON.parse(data)
			let { userId } = payload
			let todo_id = todos.length ? todos[todos.length-1].todo_id+1 :1
			let newTodo = {todo_id,todo_time,todo_text,userId,username}
			todos.push(newTodo)
			fs.writeFileSync(path.join(process.cwd(),'src','database','todos.json'),JSON.stringify(todos,null,4))
			
			res.writeHead(200, {'Content-Type':'application/json'})
			res.write(
					JSON.stringify({
					status: 200,
					message: 'resource append successfully',
					data : newTodo
				})
			)
			return res.end()
		})	
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

export {
	UPDATE,
	QOSHISH
}