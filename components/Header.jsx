import { userService } from '@/helpers/Generales';
import React, { useEffect, useState } from 'react'
import { CiMenuBurger } from 'react-icons/ci'
import { FaRegUserCircle } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'


function Header() {

    function LogOut() {
        userService.logout();
    }

    const handleClick = (e) => {
        e.preventDefault();
        const wrapper = document.getElementById("wrapper");
        if (wrapper) {
            wrapper.classList.toggle("toggled");
        }
    };

    const [usuario, setUsuario] = useState("");
    const [lastName, setLastName] = useState("");


    useEffect(() => {
        const nombre = localStorage.getItem("nombre");
        setUsuario(nombre);
        const apellido = localStorage.getItem("apellido");
        setLastName(apellido);
    }, []);


    return (
        <nav className="navbar navbar-expand-lg header-style">
            <div className="container-fluid">
                <button className='btn' id="menu-toggle" onClick={handleClick}>
                    <CiMenuBurger style={{color: 'white'}}/>
                </button>
                <h4 style={{color: 'white'}}>Control de Laboratorios</h4>
                <div style={{display:"flex", alignItems:"center"}}>
                    <div className="dropdown" style={{margin:"5px"}}>
                        <button className="dropbtn"><FaRegUserCircle style={{marginBottom:"7px"}}/></button>
                        <div className="dropdown-content">
                            <a type='button' onClick={LogOut}><BiLogOut style={{ margin: '5px', marginBottom: '10px' }} />Cerrar Sesión</a>
                        </div>
                    </div>
                    <h6 style={{ color: 'white' }}>Bienvenido: {usuario.toUpperCase() + ' ' + lastName.toUpperCase()}</h6>
                </div>
            </div>
        </nav>
    )
}

export default Header