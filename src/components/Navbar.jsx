import React, {useState} from 'react'

import './Navbar.css'
import menuIcon from '../assets/nav/menuIcon.png'
import closeIcon from '../assets/nav/closeIcon.png'



const Navbar = ({navigate}) => {
  const [menuOpen, setMenuOpen] = useState(false); 

  return (
    <nav className='navbar'>
      <a href='/' className='title'>
        My Planner
      </a>
      <div className='menu'>
        <img className='menuBtn'
        src={
          menuOpen ? closeIcon : menuIcon
        }
        onClick={() => setMenuOpen(!menuOpen)}></img>
        <ul className={`menuItems ${menuOpen && 'menuOpen'}`}
            onClick={() => setMenuOpen(false)}>
          <li onClick={() => {navigate('/TodoList'); }}>Todo List</li>
          <li onClick={() => {navigate('/MyJournal'); }}>My Journal</li>
          <li onClick={() => {navigate('/Notes'); }}>Notes</li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar