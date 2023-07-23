import React from 'react'
import { CiMenuBurger } from 'react-icons/ci'

function Header() {

    const handleClick = (e) => {
        e.preventDefault();
        const wrapper = document.getElementById("wrapper");
        if (wrapper) {
            wrapper.classList.toggle("toggled");
        }
    };


    return (
        <nav className="navbar navbar-expand-lg header-style">
            <div className="container-fluid">
                <button className='btn' id="menu-toggle" onClick={handleClick}>
                    <CiMenuBurger />
                </button>
                <h3>Universidad Tecnológica Metropolitana</h3>
            </div>
        </nav>
    )
}

export default Header