const Router = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')


const router = new Router()


router.post('/registration',
// валидидируем данные
[
    check('email', 'Uncorrect email').isEmail(),
    check('password', 'Password must be longer than 3 and shorter than 12').isLength({min: 3, max: 30})
],

async(req, res) => {
    console.log(req.body);
    try{
        const errors = validationResult(req) // результат валидации
        if(!errors.isEmpty()) {
            return res.status(400).json({message: 'Unncorect request', errors})
        }
        
        const {email, password} = req.body //получаем пароль и майл с тела запроса
        const candidate = await User.findOne({email}) // есть ли такой зарег пользователь
        // если юзер есть -- ошибка
        if(candidate) {
            return res.status(400).json({message: `User with email ${email} already exist`})
        }
        //если юзера нет, то создаем его
        // хэшируем пароль
        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({email, password: hashPassword})
        await user.save() // сохраняем юзера в бд
        await fileService.createDir(new File({user: user.id, name: ''}))
        res.json({message: 'User was created'}) // ответ от сервера
    }catch(error){
            console.log(error);
            res.send({message: 'Server error'})
        }
    })

    


router.post('/login',

async(req, res) => {
    try{
        
        
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: 'User not found'})
        }
        const isPassValid = bcrypt.compareSync(password, user.password) // сравниваем пароли на сервере и от юзера// специально зашиврованы
        if(!isPassValid) {
            return res.status(400).json({message: 'Invalid password'})
          }
          const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: "1h"})
          //возвращаем на клиент
          return res.json({
              token, 
              user : {
                  id: user.id,
                  email: user.email,
                  diskSpace: user.diskSpace,
                  usedSpace: user.usedSpace,
                  avatar: user.avatar
                }
                
            })
        }catch(error){
            console.log(error);
            res.send({message: 'Server error'})
        }
    })
    
    

    router.get('/auth',  authMiddleware,
        async(req, res) => {
            try{
                console.log(req, 'REQ');
                const user = await User.findOne({_id: req.user.id})
                const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: "1h"})
                //возвращаем на клиент
                return res.json({
                    token, 
                    user : {
                        id: user.id,
                        email: user.email,
                        diskSpace: user.diskSpace,
                        usedSpace: user.usedSpace,
                        avatar: user.avatar
                    }
                    
                })
            }catch(error){
                console.log(error);
                res.send({message: 'Server error'})
            }
    })
    
    
    module.exports = router