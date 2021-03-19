import React from 'react';
import './fileList.css'
import {useSelector} from 'react-redux'
import File from './file/File';
import {TransitionGroup, CSSTransition} from 'react-transition-group' //анимации

const FileList = () => {
    const files = useSelector(state => state.files.files)
  if(!files.length) {
    return (
      <div className='fileList__noFile'>Файлы не найдены</div>
    )
  }
    return (
          <div className='fileList'>
                <div className="fileList__header">
                    <div className="fileList__name">Название</div>
                    <div className="fileList__date">Дата</div>
                    <div className="fileList__size">Размер</div>
                </div>
              <TransitionGroup>
                  {files.map((file) => {
                    return (
                      <CSSTransition //добавляем анимацию
                        key={file._id}
                        timeout={500} // время за которое будут меняться классы, происходит анимация
                        classNames='file'
                        exit={false}
                      >
                        <File key="transition-group-content" file={file} />

                      </CSSTransition>
                    )
                  })}
              </TransitionGroup>


          </div>
)
};

export default FileList;