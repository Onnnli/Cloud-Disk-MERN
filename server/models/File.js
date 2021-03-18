const {model, Schema, ObjectId} = require('mongoose') // objectId для связи сущности

const File = new Schema({
    name: {type: String, required: true}, // имя файла
    type: {type: String, required: true}, // расширение
    accessLink: {type: String}, // ссылка
    size: {type: Number, default: 0}, // размер в байтах по умолчанию ноль
    path: {type: String, default: ''}, // путь к файлу 
    date: {type: Date, default: Date.now()}, // 
    user: {type: ObjectId, ref: 'User'}, // в свойство реф пишем название модели, на которую ссылаемся 
    parent: {type: ObjectId, ref: 'File'}, // ссылается на файл/папку
    child: [{type: ObjectId, ref: 'File'}] // cсылается на файлы, которые лежат внутри папки
})

module.exports = model('File', File)