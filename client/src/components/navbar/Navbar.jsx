import React from 'react';
import './navbar.css'
import {NavLink} from 'react-router-dom'
import Logo from '../../assets/img/logo__header.svg'
import {useSelector, useDispatch} from 'react-redux'
import { logout } from '../../reducers/userReducer';

const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const dispatch = useDispatch()
    return (
        <div className='navbar'>
            <div className="container">
                <div className='content'>
                    <img src={Logo} alt="logotype" className='navbar__logo'/>
                    <div className="navbar__header">
                        DISK CLOUD
                    </div>
                </div>
                <div className='content'> 
                    {!isAuth && <div className="navbar__login"><NavLink to='/login'>Войти</NavLink></div> }
                    {!isAuth && <div className="navbar__registration"><NavLink to='/registration'>Регистрация</NavLink></div>}
                    {isAuth && <div className="navbar__registration" onClick={() => dispatch(logout())}>Выход</div>}
                </div>
            </div>
        </div>
    );
};

export default Navbar;