import React from 'react';
import UploadFile from './UploadFile'
import './uploader.css'
import {useDispatch, useSelector} from 'react-redux'
import { hideUploader } from '../../../reducers/uploadReducer';



const Uploader = () => {
    const files = useSelector(state => state.upload.files)
    const isVisible = useSelector(state => state.upload.isVisible)
    const dispatch = useDispatch()
    
    return ( isVisible && 
        <div className='uploader'>
            <div className="uploader__header">
                <div className="uploader__title">Загрузка</div>
                <button onClick={() => dispatch(hideUploader())} className="uploader__close">X</button>
            </div>
            {files.map(file =>{ 
                return <UploadFile key={file.id} file={file}/>})}
        </div>
    );
};

export default Uploader;