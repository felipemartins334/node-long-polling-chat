const fs = require('fs')
const path = require('path')

const migrationsPath = path.resolve(__dirname, "migrations")
fs.readdir(migrationsPath, (error, files) => {
  files.forEach(file => {
    const data = fs.readFile(migrationsPath+file)
  })
})