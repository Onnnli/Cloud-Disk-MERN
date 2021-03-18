import axios from 'axios'
import {setFiles, addFile, deleteFileReducer} from '../reducers/fileReducer'

export function getFiles(dirId) {
    return async dispatch => {
        try {
            const response = await axios.get(`http://localhost:5000/api/files${dirId ? '?parent='+dirId : ''}`,
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            dispatch(setFiles(response.data))
            console.log(response.data);
        } catch (error) {
            console.log(error.response.data.message);
        }

    }
}

export function createDir(dirId, name) {
    return async dispatch => {
        try {
            const response = await axios.post(`http://localhost:5000/api/files`,{
                name,
                parent: dirId,
                type: 'dir'
            }, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            dispatch(addFile(response.data))
        } catch (error) {
            console.log(error.response.data.message);
        }
    }
}

export function uploadFile(file, dirId) {
    return async dispatch => {
        try {
            let formData = new FormData()
            formData.append('file', file)

            if (dirId) {
                formData.append('parent', dirId)
            }

            const response = await axios.post(`http://localhost:5000/api/files/upload`, formData, 
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    if (totalLength) {
                        let progress = Math.round((progressEvent.loaded * 100) / totalLength)
                        console.log(progress)
                    }
                }
            });
            dispatch(addFile(response.data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}


export async function downloadFile(file) {
    const response = await fetch(`http://localhost:5000/api/files/download?id=${file._id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })

    if(response.status === 200) {
        const blob = await response.blob() // подобный физ файлу объект получаем из ответа от сервера
        const downloadUrl = window.URL.createObjectURL(blob) // преобразуем файл в ссылку
        const link = document.createElement('a') // создаем невид ссылку
        link.href = downloadUrl // присваеваем ссылку блоба 
        link.download = file.name // присваеваем имя файйла
        document.body.appendChild(link) // добавляем ссылку в документ
        link.click() // имитируем нажатие
        link.remove() // удаляем
    }

}



export function deleteFile(file) {
    return async dispatch => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/files?id=${file._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(deleteFileReducer(file._id))
            alert(response.data.message)
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}