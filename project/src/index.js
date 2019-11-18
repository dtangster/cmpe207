const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 9999

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('static'))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/../index.html'));
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
