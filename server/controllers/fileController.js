const fileService = require('../services/fileService')
const User = require('../models/User')
const File = require('../models/File')
const config = require('config')
const fs = require('fs')

class FileController {
    async createDir(req, res) {
        try {
            const {name, type, parent} = req.body // получаем из тела запроса
            const file = new File({name, type, parent, user: req.user.id}) // передаем в модель данные
            const parentFile = await File.findOne({_id: parent}) // из запроса находим родительский файл
            if(!parentFile) { // если имя род не найден добавляем файл в корень 
                file.path = name
                await fileService.createDir(file)
            } else {
                file.path = `${parentFile.path}\\${file.name}` // если найден, сначала добавляем пусть родителя
                await fileService.createDir(file)
                parentFile.child.push(file._id) 
                await parentFile.save()
            }
            await file.save()
            return res.json(file)
        } catch (error) {
            console.log(error);
            return res.status(400).json(error)
        }
    }

    async getFiles(req, res) {
        try {
            const {sort} = req.query
            let files;
            // по убыванию 1
            // по возрастанию -1
            switch (sort) {
                case 'name' :
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({name: 1})
                    break
                case 'type' :
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({type: 1})
                    break
                case 'date' :
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({date: 1})
                    break
                default:
                    files = await File.find({user: req.user.id, parent: req.query.parent})
                    break
            }

            return res.json(files)
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Can not get files'})
        }
    }

    async uploadFile(req, res) {
        
        try {

            const file = req.files.file
            console.log(file, 'FILE CONTROLLER');

            const parent = await File.findOne({user: req.user.id, _id: req.body.parent})
            const user = await User.findOne({_id: req.user.id})

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({message: 'There no space on the disk'})
            }

            user.usedSpace = user.usedSpace + file.size

            let path;
            if (parent) {
                path = `${config.get('filePath')}\\${user._id}\\${parent.path}\\${file.name}`
            } else {
                path = `${config.get('filePath')}\\${user._id}\\${file.name}`
            }

            if (fs.existsSync(path)) {
                return res.status(400).json({message: 'File already exist'})
            }
            file.mv(path)
            
            let filePath = file.name
            if(parent) {
                filePath = parent.path + '\\' + file.name
            }

            const type = file.name.split('.').pop()
            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: filePath,
                parent: parent ? parent._id : null,
                user: user._id
            })

            await dbFile.save()
            await user.save()

            res.json(dbFile)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Upload error"})
        }
    }

    async downloadFile(req, res) {
        try {
            const file = await File({_id: req.query.id, user: req.user.id})
            const path = config.get('filePath') + '\\' + req.user.id + '\\' + file.path + '\\' + file.name

            if(fs.existsSync(path)) {
                return res.download(path, file.name)
            }
            return res.status(200).json({message: 'Download'})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: "Download error"})
        }
    }


    async deleteFile(req, res) {
        try {
            
            const file = await File.findOne({_id: req.query.id, user: req.user.id})
            if(!file) {
                return res.status(400).json({message: 'file not found'})
            }
            await file.remove() // удаляем с клиента
            fileService.deleteFile(file) // удаляем файл с базы данных
            return res.json({message: 'File was deleted'})
        } catch (error) {
            console.log(error)
            return res.status(400).json({message: "Delete error"})
        }
    }

    async searchFile(req, res) {
        try{
            const searchName = req.query.search;

            let files = await File.find({user: req.user.id});

            files = files.filter((file) => {
               return  file.name.includes(searchName)
            })
            return res.json(files);
        } catch (error) {
            console.log(error)
            return res.status(400).json({message: "Search error"})
        }
    }

}




module.exports = new FileController()