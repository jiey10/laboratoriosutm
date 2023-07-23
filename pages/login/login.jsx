import { useRouter } from 'next/router'
import React from 'react'

function LoginPage() {

    const router = useRouter();

    return (
        <div className='LoginStyle'>
            <div className='login template d-flex justify-content-center align-items-center 100-w vh-100 bg-prymary'>
                <div className='40-w p-5 rounded bg-white'>
                    <h3 className='text-center'>Iniciar Sesión</h3>
                    <br />
                    <div className='mb-2'>
                        <label htmlFor='correo'>Correo</label>
                        <input type='email' placeholder='Ingresa un correo' className='form-control' id='correo' name='correo' autoComplete='off'></input>
                    </div>
                    <br />
                    <div className='mb-2'>
                        <label htmlFor='password'>Contraseña</label>
                        <input type='password' placeholder='' className='form-control' id='password' name='password'></input>
                    </div>
                    <br />
                    <div className='d-grip text-center'>
                        <button className='btn btn-primary' onClick={() => router.push("/inicio/inicio")}>Iniciar Sesión</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage