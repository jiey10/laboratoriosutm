import { userService } from '@/helpers/Generales';
import React, { useEffect, useState } from 'react'
import { CiMenuBurger } from 'react-icons/ci'
import { FaRegUserCircle } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'


function HeaderUsers() {

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
                <img width={150} alt="" src="https://static.wixstatic.com/media/127857_7603355bfa964d8e91aec26548598d9f~mv2.png/v1/fill/w_305,h_75,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/REDES-UTM_edited.png"></img>
                <h4 style={{ color: 'white' }}>Control de Laboratorios</h4>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="dropdown" style={{margin:"5px"}}>
                        <button className="dropbtn"><FaRegUserCircle style={{ marginBottom: "7px" }} /></button>
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

export default HeaderUsers