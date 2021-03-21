import axios from 'axios'
import {setUser} from '../reducers/userReducer'
import {API_URL} from '../utils/config'

export const registration = async (email, password) => {
    try{
        const response = await axios.post(`${API_URL}api/auth/registration`, {
            email,
            password
        })
        console.log(response.data.message, 'SUCCESS REQUEST');
    } catch(error) {
        console.log(error.response.data.message, 'ERROR REQUEST');
    }
}



export const login = (email, password) => {
    return  async dispatch => {
        try{
            const response = await axios.post(`${API_URL}api/auth/login`, {
                email,
                password
            })
            dispatch(setUser(response.data.user))
            localStorage.setItem('token', response.data.token)
        } catch(error) {
            console.log(error.response, 'ERROR REQUEST');
        }
    }
}


export const auth = () => {
    return  async dispatch => {
        try{
            const response = await axios.get(
                            `${API_URL}api/auth/auth`,
                            {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
                            )
            console.log(response, "RESPONCE");
            dispatch(setUser(response.data.user))
            localStorage.setItem('token', response.data.token)
        } catch(error) {
            localStorage.removeItem('token')
        }
    }
}


export const uploadAvatar = (file) => {
    return  async dispatch => {
        try{
            const formData = new FormData;
            formData.append('file', file)
            const response = await axios.post(
              `${API_URL}api/files/avatar`,
              formData,
              {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data))
        } catch(error) {
            console.log(error, 'ERROR UPLOAD');
        }
    }
}

export const deleteAvatar = () => {
    return  async dispatch => {
        try{
            const response = await axios.delete(
              `${API_URL}api/files/avatar`,
              {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data))
        } catch(error) {
            console.log(error, 'ERROR UPLOAD');
        }
    }
}
