const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/auth.middleware'); // чтобы атор пользоватеоля по токену
const FileController = require('../controllers/fileController')


router.post('', authMiddleware, FileController.createDir)
router.post('/upload', authMiddleware, FileController.uploadFile)
router.get('', authMiddleware, FileController.getFiles)
router.get('/download', authMiddleware, FileController.downloadFile)
router.delete('/', authMiddleware, FileController.deleteFile)



module.exports = router