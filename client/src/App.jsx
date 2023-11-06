
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import About from './pages/About/About';
import Profile from './pages/Profile/Profile';
import Private from './components/Private/Private';
import CreateListing from './pages/CreateListing/CreateListing';



const App = () => {

    return (
        <div>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/signIn' element={<SignIn/>}/>
            <Route path='/signUp' element={<SignUp/>}/>
            <Route path='/about' element={<About/>}/>

            <Route element={<Private/>}>
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/create-listing' element={<CreateListing/>}/>
            </Route>
        </Routes>
        </div>
    )
};

export default App;
