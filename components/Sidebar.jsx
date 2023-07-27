import { useRouter } from "next/router"
import { BiHome, BiUser, BiBuildings, BiKey, BiLogOut } from 'react-icons/bi'


export default function Sidebar({ children }) {

    const router = useRouter();

    
    return (
        <div id="wrapper">

            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        <img style={{marginTop:'20px'}} width={150} alt="" src="https://static.wixstatic.com/media/127857_7603355bfa964d8e91aec26548598d9f~mv2.png/v1/fill/w_305,h_75,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/REDES-UTM_edited.png"></img>
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
                </ul>
            </div>

            <div>
                {children}
            </div>

        </div>
    )
}
