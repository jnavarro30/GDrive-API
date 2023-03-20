const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const controller = require('./controller')

const currentToken = {
    "access_token": "ya29.a0AVvZVsr4on0a-FW7XJ5VcS2Y2WROJYoC3tYfzbeZ5DK9B9Qus9Ve-UpHrQ6Z-TOfU3FuRMLbnVhfB-HZVxPmiC3F0vskX47-gw9pldXT9lV1L9qkmkCPuLP0v7W1nPiq6eexzZ-JGpX6aNH-Qj0ZC7bsUbyzaCgYKAXcSARISFQGbdwaIdAnJq_VztQa7wSq44pHgTg0163",
    "refresh_token": "1//06LnlTrLNYQu5CgYIARAAGAYSNwF-L9Ir2jtquCwqmdJ2929UG7fFWN_nMaOjsByDj8-A9x8TkwsfrzgYqLKzLCJsBZJVaYth4Z0",
    "scope": "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file",
    "token_type": "Bearer",
    "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk4NmVlOWEzYjc1MjBiNDk0ZGY1NGZlMzJlM2U1YzRjYTY4NWM4OWQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0NzI3OTgxMzY2ODAtNjZ1M2lzcTU5bjVkOTg1bXU4N3FhaTIzMHBmZzc5NnUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NzI3OTgxMzY2ODAtNjZ1M2lzcTU5bjVkOTg1bXU4N3FhaTIzMHBmZzc5NnUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTcwMDgwMzE0MjgyODk1NDM5MjEiLCJhdF9oYXNoIjoiMGhudkw4SlFJUzBMNTEzaWd6LTVUdyIsIm5hbWUiOiJKZXNzZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BR05teXhhNmlKdWc1TGVYM0p3ZFVpMzBTQTA4ODAydHZPVDFFcFlVemRPdD1zOTYtYyIsImdpdmVuX25hbWUiOiJKZXNzZSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjc5Mjk3MDMwLCJleHAiOjE2NzkzMDA2MzB9.E6_WiICwrgAk6duihkjStwkW0v2aSzcEuCgb_Y6ElfMoeuxaxrj6tfbJa_sCuH7kY7X1RxRIe8GSYIgP0az5AipEi5KnVh-xF4H0JtKRdxmkQhWvQTl0QAjtaUmw6XgwO0E9fAfF509vhE5FM1eLsPRRjBB88ypfFZZQOmXBrkIZV9kzuCDfwKewyYZK86RmwSKqmJVT1FQ5UP58YxnTFTlvSCiXoY9su70k822_PsOrrmeV3g2Eo-ZmVrlXdqU2YVPdwWay0AU5fx8wajgEYECGxKzi1uJ8UjilG4nAQKfKDmugG9Hl9fcl-7_b3pruvArvrfCB5XMSr2fjn1Wuhw",
    "expiry_date": 1679300629095
}

// MIDDLEWARE
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

// TEST
app.post('/createFolders', controller.createTemplateFoldersOnUserDrive)
// AUTHORIZATION
app.get('/', (req, res) => {
    res.send('API Running...')
})

app.get('/getAuthURL', controller.getAuthURL)

app.post('/getToken', controller.getToken)



// ROUTES                              
app.post('/getUserInfo', controller.getUserInfo)

app.post('/readDrive', controller.readDrive)

app.post('/fileUpload', controller.fileUpload)

app.post('/deleteFile/:id', controller.deleteFile)


// SERVER
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})