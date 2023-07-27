import { clearLocalStorage } from '@/helpers/Generales';
import Layout from '@/components/Layout'
import Loader from '@/components/Loader';
import CustomModal from '@/components/Modal';
import { Call } from '@/helpers/Call';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { BsPlusCircleFill } from 'react-icons/bs'
import { AiOutlineCheck } from 'react-icons/ai'
import Swal from 'sweetalert2';
import * as yup from "yup";
import { getToken } from '@/helpers/Generales';
import Head from 'next/head';

function Inicio() {

    let oCall = new Call();

    const formRef = useRef(null);

    const validation = yup.object().shape({
        number: yup.number()
            .required("Este campo es obligatorio")
            .min(1, "Se requiere un minimo de 3 carácteres"),
        descripcion: yup.string()
            .required("Este campo es obligatorio")
            .min(3, "Se requiere un minimo de 3 carácteres"),
    })

    let objLlave = {
        idKey: 0,
        number: "",
        descripcion: "",
    }

    const [llave, setLlave] = useState(objLlave)
    const [salones, setSalones] = useState([])


    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormReset = () => {
        formRef.current.resetreform();
    };

    function GetAll() {
        oCall.cenisFetch("GET", `Classroom`, getToken(), null).then(response => {
            if (response.status === 200) {
                setSalones(response.Data)
                setLoading(false)
            }
        }).catch((err) => {
            setLoading(false)
            console.log(err);
        });
    }

    function Save(values, actions) {
        oCall.cenisFetch("POST", `Key/AddUpdateKey`, getToken(), values).then(response => {
            if (response.status === 200) {
                SuccessAlert("Registro guardado correctamente.");
                handleCloseModal();
                GetAll();
            }
            else {
                ErrorAlert("Ocurrió un error al guardar el registro.");
            }
        }).catch((err) => {
            console.log(err)
            ErrorAlert("Ocurrió un error al guardar el registro.");
        });
    }

    function Edit(ID) {
        oCall.cenisFetch("GET", `Key/${ID}`, getToken(), null).then(response => {
            if (response.status === 200) {
                handleOpenModal();
                setLlave({
                    ...llave,
                    idKey: response.Data.idKey,
                    number: response.Data.number,
                    descripcion: response.Data.descripcion,
                })
            }
            else {
                ErrorAlert("Ocurrió un error al recuperar el registro.");
            }
        }).catch((err) => {
            ErrorAlert("Ocurrió un error al recuperar el registro.");
        });
    }

    function Delete(ID) {
        oCall.cenisFetch("PUT", `Key/EnableDisableKey${ID}`, getToken(), null).then(response => {
            if (response.status === 200) {
                SuccessAlert("Registro desactivado correctamente.")
                GetAll();
            }
            else {
                ErrorAlert("Ocurrió un error al desactivar el registro.");
            }
        }).catch((err) => {
            ErrorAlert("Ocurrió un error al desactivar el registro.");
        });
    }

    function Activate(ID) {
        oCall.cenisFetch("PUT", `Key/EnableDisableKey${ID}`, getToken(), null).then(response => {
            if (response.status === 200) {
                SuccessAlert("Registro activado correctamente.");
                GetAll();
            }
            else {
                ErrorAlert("Ocurrió un error al activar el registro.")
            }
        }).catch((err) => {
            ErrorAlert("Ocurrió un error al activar el registro.")
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

    useEffect(() => {
        GetAll();
    }, [])

    return (
        <>
            <Head>
                <title>Inicio</title>
                <link rel="icon" href="https://www.utmetropolitana.edu.mx/Publicaciones/recursos/BotonImagen/logo%20UTM-01.png" />
            </Head>
            {loading ? <Loader /> :
                <Layout>
                    <h2>Asignaciones</h2>
                    <hr />
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {
                            salones.map((salon, index) => (
                                <div className="col" key={index}>
                                    <div className={`card h-100 ${salon.inUse === true ? 'border-danger' : 'border-success'}`}>
                                        <div className={`card-header ${salon.inUse === true ? 'border-danger' : 'border-success'}`}>
                                            {
                                                salon.inUse === true ? <h5>OCUPADO</h5> : <h5>DISPONIBLE</h5>
                                            }
                                        </div>
                                        <div className={`card-body ${salon.inUse === true ? 'border-danger' : 'border-success'}`}>
                                            {
                                                salon.inUse === true && salon.idUser > 0 ?
                                                    <h6>Por: {salon.nombreUsuario + ' ' + salon.apellidoUsuario}</h6>
                                                    :
                                                    ''
                                            }
                                            <h5 className="card-title">{salon.nombre}</h5>
                                            <p className="card-text">{salon.descripcion}</p>
                                        </div>
                                        {/* <div className={`card-footer bg-transparent ${salon.inUse === true ? 'border-danger' : 'border-success'}`}>
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <a className='btn btn-primary' onClick={() => Edit(usuario.idUser)}><BiEditAlt /></a>
                                        <a className='btn btn-danger' onClick={() => Disable(usuario.idUser)}><BiTrash /></a>
                                    </div>
                                </div> */}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Layout>
            }
        </>

    )
}

export default Inicio