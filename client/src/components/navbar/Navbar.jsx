import React from 'react';
import './navbar.css'
import {NavLink} from 'react-router-dom'
import Logo from '../../assets/img/logo__header.svg'
import {useSelector, useDispatch} from 'react-redux'
import { logout } from '../../reducers/userReducer';
import {useState} from 'react'
import {showLoader} from '../../reducers/appReducer'
import {searchFile, getFiles} from '../../actions/file'

const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const currentDir = useSelector(state => state.files.currentDir)
    const dispatch = useDispatch()
    const [searchName, setSearchName] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(false);

    function searchChangeHandler(event) {
        setSearchName(event.target.value)
        if(searchTimeout !== false) {
            clearTimeout(searchTimeout)
        }
        dispatch(showLoader())
        if(event.target.value !== '') {
            setSearchTimeout(setTimeout((value) => {
                dispatch(searchFile(value))
            }, 500, event.target.value))
        }else {
            dispatch(getFiles(currentDir))
        }
    }

    return (
        <div className='navbar'>
            <div className="container">
                <div className='content'>
                    <img src={Logo} alt="logotype" className='navbar__logo'/>
                    <div className="navbar__header">
                        DISK CLOUD
                    </div>
                    {isAuth && <input
                        className='navbar__search'
                        type='text'
                        placeholder='Введите название файла...'
                        value={searchName}
                        onChange={event => searchChangeHandler(event)}/> }
                    {!isAuth && <div className="navbar__login"><NavLink to='/login'>Войти</NavLink></div> }
                    {!isAuth && <div className="navbar__registration"><NavLink to='/registration'>Регистрация</NavLink></div>}
                    {isAuth && <div className="navbar__registration" onClick={() => dispatch(logout())}>Выход</div>}
                </div>
            </div>
        </div>
    );
};

export default Navbar;