import { useRouter } from "next/router"
import { BiHome, BiUser, BiBuildings, BiKey, BiLogOut } from 'react-icons/bi'


export default function Sidebar({ children }) {

    const router = useRouter();

    return (
        <div id="wrapper">

            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        <img width={100} alt="" src="https://www.utmetropolitana.edu.mx/Publicaciones/recursos/BotonImagen/logo%20UTM-01.png"></img>
                    </li>
                    <li>
                        <a href="/inicio/inicio"><BiHome style={{ margin: '5px', marginBottom: '10px' }} />Inicio</a>
                    </li>
                    <li>
                        <a href="/maestros/maestros"><BiUser style={{ margin: '5px', marginBottom: '10px' }} />Maestros</a>
                    </li>
                    <li>

                        <a href="/salones/salones"><BiBuildings style={{ margin: '5px', marginBottom: '10px' }} />Salones</a>
                    </li>
                    <li>
                        <a href="/llaves/llaves"><BiKey style={{ margin: '5px', marginBottom: '10px' }} />Llaves</a>
                    </li>
                    <li>
                        <a href="/"><BiLogOut style={{ margin: '5px', marginBottom: '10px' }} />Cerrar Sesión</a>
                    </li>
                </ul>
            </div>

            <div>
                {children}
            </div>

        </div>
    )
}
