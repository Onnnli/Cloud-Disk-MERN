import React from 'react';
import Input from '../input/Input';
import {useState} from 'react'
import './authorization.css'

import {registration} from '../../actions/user'



const Registration = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return (
        <div className='authorization'>
            <div className="authorization__header">Регистрация</div>
            <Input value={email} setValue={setEmail} type='email' placeholder='Введите email...'/>
            <Input value={password} setValue={setPassword} type='password' placeholder='Введите password...'/>

            <button onClick={() => registration(email, password)} className="authorization__btn">Зарегистрироваться</button>
        </div>
    );
};

export default Registration;