import { getDataFromLocalStorage } from '@/helpers/Generales';
import React from 'react'
import { CiMenuBurger } from 'react-icons/ci'

function Header() {

    function getName() {
        let completeName = ""
        if (typeof window !== 'undefined') {
            const name = localStorage.getItem('nombre')
            const lastname = localStorage.getItem('apellido')
            const completeName = name + ' ' + lastname;
            return completeName;
        }
        return completeName;
    }


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
                <h4>Universidad Tecnológica Metropolitana</h4>
                <h6>Bienvenido: </h6>
            </div>
        </nav>
    )
}

export default Header