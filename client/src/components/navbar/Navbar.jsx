import React from 'react';
import './navbar.css'
import {NavLink} from 'react-router-dom'
import Logo from '../../assets/img/logotype.png'
import {useSelector, useDispatch} from 'react-redux'
import { logout } from '../../reducers/userReducer';
import {useState} from 'react'
import {showLoader} from '../../reducers/appReducer'
import {searchFile, getFiles} from '../../actions/file'
import avatarLogo from '../../assets/img/avatar.png'
import {API_URL} from '../../utils/config'

const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const currentDir = useSelector(state => state.files.currentDir)
    const dispatch = useDispatch()
    const [searchName, setSearchName] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(false);

    const currentUser = useSelector(state => state.user.currentUser)
    const avatar = currentUser.avatar ? `${API_URL + currentUser.avatar}` : avatarLogo


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
                    <NavLink style={{textDecoration: 'none'}} to='/'>
                        <div className='content__logo'>
                                <img src={Logo} alt="logotype" className='navbar__logo'/>
                                <div className="navbar__header">
                                    DISK CLOUD
                                </div>
                        </div>
                    </NavLink>

                    {isAuth && <input
                        className='navbar__search'
                        type='text'
                        placeholder='Введите название файла...'
                        value={searchName}
                        onChange={event => searchChangeHandler(event)}/> }
                        {!isAuth &&  <div className='user__auth'>
                            <div className="navbar__login"><NavLink to='/login'>Войти</NavLink></div>
                            <div className="navbar__registration"><NavLink to='/registration'>Регистрация</NavLink></div>
                        </div>}

                    {isAuth && <div className='user__info'>
                         <div className="navbar__registration" onClick={() => dispatch(logout())}>Выход</div>
                        <NavLink to='/profile'>
                            <img className='navbar__avatar' src={avatar} alt=''/>
                        </NavLink>
                    </div> }

                </div>
            </div>
        </div>
    );
};

export default Navbar;