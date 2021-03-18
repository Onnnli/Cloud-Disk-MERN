import React from 'react';
import Input from '../input/Input';
import {useState} from 'react'
import {useDispatch} from 'react-redux'
import './authorization.css'



import {login} from '../../actions/user'





const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    return (
        <div className='authorization'>
            <div className="authorization__header">Авторизация</div>
            <Input value={email} setValue={setEmail} type='email' placeholder='Введите email...'/>
            <Input value={password} setValue={setPassword} type='password' placeholder='Введите password...'/>

            <button onClick={() => dispatch(login(email, password))} className="authorization__btn">Войти</button>
        </div>
    );
};

export default Login;