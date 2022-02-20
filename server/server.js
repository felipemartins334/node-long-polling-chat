require('dotenv').config()
const http = require('http')
const fs = require('fs')
const path = require('path')
const connection = require('../database/index')
const runMigrations = require('../database/runMigrations')

runMigrations()

const publicPath = path.resolve(__dirname, '..', 'public')

let pool = []

function handlePage(req, res){
  fs.createReadStream(publicPath + '/index.html').pipe(res)
}

function handleCSS(req, res){
  fs.createReadStream(publicPath+ "/style.css").pipe(res)
}

function handlePoll(req, res){
  pool.push(res)
}

function handleMessage(req, res){

  let message = ''

  req.on('data', chunk => {
    message+=chunk
  })
  req.on('end', () => {
    emitMessage(message)
    res.end()
  })
}

function emitMessage(message){
  for(let res of pool) res.end(message)
}

http.createServer((req, res) => {

  let { url, method } = req

  if(method === 'GET'){
    if(url === '/page') handlePage(req, res)
    if(url === '/style.css') handleCSS(req,res)
    if(url === '/poll') handlePoll(req, res)
  
  }else if(method === 'POST'){
    if(url === '/message') handleMessage(req, res)
  }
}).listen(8000)
