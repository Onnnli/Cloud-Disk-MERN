import React from 'react';
import FileList from './fileList/FileList'
import Popup from './Popup' 
import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import {getFiles,  uploadFile} from '../../actions/file'
import {setPopupDisplay, setCurrentDir} from '../../reducers/fileReducer'
import {useState} from 'react'
import './disk.css'
import Uploader from './uploader/Uploader';

const Disk = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const dirStack = useSelector(state => state.files.dirStack)
    const [dragEnter, setDragEnter] = useState(false)

    useEffect(() => {
        dispatch(getFiles(currentDir))
    }, [currentDir])

    function showPopupHandler() {
        dispatch(setPopupDisplay('flex'))
    }

    function backClickHandler() {
        const backDirId = dirStack.pop() // из массива берем последний элемент --- наша папка
        dispatch(setCurrentDir(backDirId))
    }

    function fileUploadHandler(event) {
        const files =  [...event.target.files]
        files.forEach(file =>  dispatch(uploadFile(file, currentDir)) )
    }

    function onDragEnterHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(true)
    }

    function onDragLeaveHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(false)
    }

    function dropHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        let files = [...event.dataTransfer.files]
        files.forEach(file =>  dispatch(uploadFile(file, currentDir)))
        setDragEnter(false)
    }



    return ( !dragEnter ? 
            <div className='disk' onDragEnter={onDragEnterHandler} onDragLeave={onDragLeaveHandler} onDragOver={onDragEnterHandler}>
                <div className="disk__btn">
                    <button className="disk__back" onClick={() => backClickHandler()}>Назад</button>
                    <button className="disk__create" onClick={() => showPopupHandler()} >Создать папку</button>
                    <div className="disk__upload">
                        <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл</label>
                        <input multiple={true} onChange={(event) => fileUploadHandler(event)} type="file" id='disk__upload-input' className='disk__upload-input' />
                    </div>
                </div>
                <FileList />
                <Popup />
                <Uploader />
            </div>
            :
            <div className='drop-area' onDrop={dropHandler} onDragEnter={onDragEnterHandler} onDragLeave={onDragLeaveHandler} onDragOver={onDragEnterHandler}>
                Перетащите файлы сюда
            </div>
    );
};

export default Disk;