const { google } = require('googleapis')
const fs = require('fs')
const formidable = require('formidable')
const credentials = require('./credentials.json')
const client_id = credentials.web.client_id
const client_secret = credentials.web.client_secret
const redirect_uris = credentials.web.redirect_uris
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
const service = google.drive({ version: 'v3', auth: oAuth2Client })
const SCOPE = ['https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file']


// INITIALIZATION Create folders and sub folders on first connect
const createIndependaFolder = async() => {
    const fileMetadata = {
        name: 'Independa',
        mimeType: 'application/vnd.google-apps.folder'
    }

    try {
        const file = await service.files.create({
            resource: fileMetadata,
            fields: 'id',
        })
        console.log('Folder Id:', file.data.id)
        return file.data.id
    } catch (err) {
        console.error(err)
        throw err
    }
}

const createIndependaSubFolders = async() => {
    const independaFolderId = await createIndependaFolder()
    console.log(typeof independaFolderId)
    // const subFolders = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', "Birthday's"]
    const subFolders = ['JAN', 'FEB']
    let subFolderIds = []
    let fileMetadata

    try {

        for (let folder of subFolders) {
            fileMetadata = {
                name: folder,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [independaFolderId]
            }

            const file = await service.files.create({
                resource: fileMetadata,
                fields: 'id',
            })

            subFolderIds.push(file.data.id)
            
            console.log('Folder Id:', file.data.id)
        }

        // console.log('Folder Id:', file.data.id)
        // return file.data.id
        console.log('Folder Ids:', subFolderIds)
        return subFolderIds
    } catch (err) {
        console.error(err)
    }
}

const createTemplateFoldersOnUserDrive = (req, res) => {
    if (req.body.token == null) return res.status(400).send('Token not found')
    oAuth2Client.setCredentials(req.body.token)
    createIndependaSubFolders()
    res.status(200).send('Success: Template folders created on user drive.')
}

// AUTHORIZATION
const runServer = (req, res) => {
    res.send('API Running...')
}

const getAuthURL = (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPE,
    })

    // const command = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    // exec(`${command} ${authUrl}`, (error, stdout, stderr) => {
    //     if (error) {
    //       console.error(`exec error: ${error}`);
    //       return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.error(`stderr: ${stderr}`);
    //   });

    console.log(authUrl)
    
    res.send(authUrl)
}

const getToken = (req, res) => {
    if (req.body.code == null) return res.status(400).send('Invalid Request')
    oAuth2Client.getToken(req.body.code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err)
            return res.status(400).send('Error retrieving access token')
        }
        res.send(token)
    })
}
 
// CRUD
const getUserInfo =  (req, res) => {
    if (req.body.token == null) return res.status(400).send('Token not found')
    oAuth2Client.setCredentials(req.body.token)
    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client })

    oauth2.userinfo.get((err, response) => {
        if (err) res.status(400).send(err)
        console.log(response.data)
        res.send(response.data)
    })
}

const readDrive = (req, res) => {
    if (req.body.token == null) return res.status(400).send('Token not found')
    oAuth2Client.setCredentials(req.body.token)
    service.files.list({
        pageSize: 10,
    }, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err)
            return res.status(400).send(err)
        }
        const files = response.data.files
        if (files.length) {
            console.log(files)
            files.map(file => {
                console.log(`${file.name} (${file.id})`)
            })
        } else {
            console.log('No files found.')
        }
        // createFolder()
        // searchForFolder()
        res.send(files)
    })
}

const fileUpload = (req, res) => {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send(err)
        const token = JSON.parse(fields.token)
        console.log(token)
        if (token == null) return res.status(400).send('Token not found.')
        oAuth2Client.setCredentials(token)
        console.log(files.file)
        const fileMetadata = {
            name: files.file.name
        }
        const media = {
            mimeType: files.file.mimetype,
            body: fs.createReadStream(files.file.filepath)
        }
        service.files.create(
            {
               resource: fileMetadata,
               media: media,
               fields: 'id' 
            },
            (err, file) => {
                oAuth2Client.setCredentials(null)
                if (err) {
                    console.error(err)
                    res.status(400).send(err)
                } else {
                    res.send('Successful')
                }
            }
        )
    })
}

const deleteFile = (req, res) => {
    if (req.body.token == null) return res.status(400).send('Token not found.')
    oAuth2Client.setCredentials(req.body.token)
    let fileId = req.params.id
    service.files.delete({ 'fileId': fileId }).then(response => { res.send(response.data)})
}

module.exports = {
    runServer,
    getAuthURL,
    getToken,
    getUserInfo,
    readDrive,
    fileUpload,
    deleteFile,
    createTemplateFoldersOnUserDrive
}