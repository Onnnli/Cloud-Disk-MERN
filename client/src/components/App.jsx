import React from 'react'
import Navbar from './navbar/Navbar'
import Registration from '../components/authorization/Registration'
import Login from '../components/authorization/Login'
import Disk from '../components/disk/Disk'
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {useEffect} from 'react'
import {auth} from '../actions/user'
import './app.css'
import Profile from './profile/Profile'

function App() {
  const isAuth = useSelector(state => state.user.isAuth)
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(auth())
  }, [])

  return (
    <BrowserRouter>
      <div className='app'> 
        <Navbar />
        {!isAuth ? 
          <Switch>
            <Route path='/registration' component={Registration}/>
            <Route path='/login' component={Login}/>
            <Redirect to='/login'/>
          </Switch>
          : 
          <Switch>
            <Route exact path='/' component={Disk}/>
            <Route exact path='/profile' component={Profile} />
            <Redirect to='/'/>
          </Switch>
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
