import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom';


const Navbar = () => {
    return (
        <nav className="bg-slate-800 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to='/'>
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500">Find</span>
                        <span className="text-slate-400">Home.Com</span>
                    </h1>
                </Link>
                <form className="bg-slate-500 p-3 rounded-lg flex items-center">
                    <input type="text" placeholder="Search" name="" id="" className="bg-transparent focus:outline-none w-24 sm:w-64"/>
                    <FaSearch/>
                </form>
                <ul className='flex gap-4 text-slate-200'>
                    <Link to='/'>
                        <li className='sm:inline hover:underline'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='sm:inline hover:underline'>About</li>    
                    </Link>
                    <Link to='/signIn'>
                        <li className='sm:inline hover:underline'>Sign In</li>
                    </Link>
                    <Link to='/signUp'>
                        <li className='sm:inline hover:underline'>SignUp</li>  
                    </Link>
                </ul>
            </div>
        </nav>
    )
};

export default Navbar;
