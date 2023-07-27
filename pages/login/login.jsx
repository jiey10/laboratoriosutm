import { Call } from '@/helpers/Call';
import { Formik } from 'formik';
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import * as yup from "yup";
import Swal from 'sweetalert2';
import { saveDataToLocalStorage } from '@/helpers/Generales';
import Head from 'next/head';

function LoginPage() {

    const router = useRouter();
    let oCall = new Call();

    const validation = yup.object().shape({
        correo: yup.string()
            .email("Correo inválido")
            .required("Este campo es obligatorio")
            .min(3, "Se requiere un minimo de 3 carácteres"),
        password: yup.string()
            .required("Este campo es obligatorio")
            .min(3, "Se requiere un minimo de 3 carácteres"),
    })

    let objlogin = {
        correo: '',
        password: "",
    }

    const [loginState, setLoginState] = useState(objlogin)

    function LogIn(values, actions) {
        oCall.cenisFetch("POST", `Auth/login`, null, values).then(response => {
            if (response.status === 200 && response.Data.rol === "Admin" && response.Data.isDisabled === false) {
                //SuccessAlert("Registro desactivado correctamente.")
                //saveDataToLocalStorage(response.Data.token, response.Data.nombre, response.Data.apellido, response.Data.rol, response.Data.isDisabled)
                localStorage.setItem('token', response.Data.token)
                localStorage.setItem('id', response.Data.id)
                localStorage.setItem('nombre', response.Data.nombre)
                localStorage.setItem('apellido', response.Data.apellido)
                localStorage.setItem('rol', response.Data.rol)
                localStorage.setItem('isDisabled', response.Data.isDisabled)
                router.push("/inicio/inicio")
            }
            else if (response.status === 200 && response.Data.rol === "Teacher" && response.Data.isDisabled === false) {
                //SuccessAlert("Registro desactivado correctamente.")
                localStorage.setItem('token', response.Data.token)
                localStorage.setItem('id', response.Data.id)
                localStorage.setItem('nombre', response.Data.nombre)
                localStorage.setItem('apellido', response.Data.apellido)
                localStorage.setItem('rol', response.Data.rol)
                localStorage.setItem('isDisabled', response.Data.isDisabled)
                router.push("/inicio/asignaciones")
            }
            else {
                ErrorAlert("Usuario y/o contraseña inválidos.");
            }
        }).catch((err) => {
            ErrorAlert("Ocurrió un error al ingresar.");
        });
    }

    const SuccessAlert = (text) => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: text,
            showConfirmButton: false,
            timer: 1500
        });
    };

    const ErrorAlert = (text) => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: text,
            showConfirmButton: false,
            timer: 1500
        });
    };

    return (
        <>
            <Head>
                <title>Inicio de Sesión</title>
            </Head>
            <div className='LoginStyle'>
                <div className='login template d-flex justify-content-center align-items-center 100-w vh-100 bg-prymary'>
                    <div className='40-w p-5 rounded bg-white'>
                        <Formik
                            initialValues={loginState}
                            validationSchema={validation}
                            enableReinitialize={true}
                            onSubmit={(values, actions) => {
                                LogIn(values, actions)
                            }}>
                            {({
                                values,
                                errors,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                touched,
                            }) =>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <h3 className='text-center'>Iniciar Sesión</h3>
                                        <br />
                                        <div className='mb-2'>
                                            <label htmlFor='correo'>Correo</label>
                                            <input type='email'
                                                maxLength={100}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.correo}
                                                placeholder='Ingresa un correo'
                                                className={`form-control form-control-sm ${errors.correo && touched.correo ? 'is-invalid' : ''}`}
                                                id='correo'
                                                name='correo'
                                                autoComplete='off' />
                                            <div className="invalid-feedback">
                                                {errors.correo}
                                            </div>
                                        </div>
                                        <br />
                                        <div className='mb-2'>
                                            <label htmlFor='password'>Contraseña</label>
                                            <input type='password'
                                                maxLength={100}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.password}
                                                placeholder=''
                                                className={`form-control form-control-sm ${errors.correo && touched.correo ? 'is-invalid' : ''}`}
                                                id='password'
                                                name='password' />
                                            <div className="invalid-feedback">
                                                {errors.password}
                                            </div>
                                        </div>
                                        <br />
                                        <div className='d-grip text-center'>
                                            <button className='btn btn-primary' type='submit' /* onClick={() => router.push("/inicio/inicio")} */>Iniciar Sesión</button>
                                        </div>
                                    </div>
                                </form>
                            }
                        </Formik>
                    </div>
                </div>
            </div>
        </>


    )
}

export default LoginPage