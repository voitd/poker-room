import './App.css';

import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Header from './pages/Header'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Register from './pages/Registration'
import Game from './pages/Game'
import LeaderBoard from './pages/LeaderBoard'
import Store from './pages/Store'
import { useState } from 'react';
import { useMemo } from 'react';
import { UserContext } from "./UserContext";
//  import BuyChips from './pages/BuyChips'

function App() {
  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

  const [user, setUser] = useState(userInfo)
  const value = useMemo(() => ({user, setUser}), [user, setUser])

  return (
  <Router>
   <UserContext.Provider value={value}>
    <main>
     <Route exact path='/' component={Landing}/>
     <Route exact path='/home' component={Home}/>
     <Route exact path='/game/:id' component={Game}/>
     <Route exact path='/profile' component={Profile}/>
     <Route exact path='/header' component={Header}/>
     <Route exact path='/login' component={Login}/>
     <Route exact path='/registeration' component={Register}/>
     <Route exact path='/leader' component={LeaderBoard}/>
     <Route exact path='/store' component={Store}/>
    </main>
   </UserContext.Provider >
  </Router>
  );
}

export default App;
