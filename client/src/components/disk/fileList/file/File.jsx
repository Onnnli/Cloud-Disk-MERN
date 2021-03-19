import React from 'react';
import './file.css'
import folderLogo from '../../../../assets/img/folder.svg'
import fileLogo from '../../../../assets/img/file.svg'
import deleteBtn from '../../../../assets/img/delete_btn.svg'
import downloadBtn from '../../../../assets/img/download_btn.svg'
import {useDispatch} from 'react-redux'
import {setCurrentDir, pushToStack} from '../../../../reducers/fileReducer'
import {useSelector} from 'react-redux'
import { deleteFile, downloadFile } from '../../../../actions/file';
import sizeFormat from "../../uploader/sizeFormat";


const File = ({file}) => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)

    function openDirHandler(file) {
        if(file.type === 'dir') {
            dispatch(pushToStack(currentDir))
            dispatch(setCurrentDir(file._id))
        } 
    }

    function downloadClickHandler(event) {
        console.log(file, 'FILE');
        event.stopPropagation()
        downloadFile(file)
    }

    function deleteClickHandler(event) {
        event.stopPropagation()
        dispatch(deleteFile(file))
    }

    return (
        <div className='file' onClick={() => openDirHandler(file)}>
            <img src={file.type === 'dir' ? folderLogo : fileLogo} alt="" className='file__img'/>
            <div className="file__name">{file.name}</div>
            <div className="file__date">{file.date.slice(0,10)}</div>
            <div className="file__size">{sizeFormat(file.size)}</div>
            {file.type !== 'dir' && <button onClick={(event) => downloadClickHandler(event)} className='file__btn file__download'><img src={downloadBtn} alt=""/></button>}
            <button onClick={(event) => deleteClickHandler(event)} className='file__btn file__delete'><img src={deleteBtn} alt=""/></button>
        </div>
    );
};

export default File;