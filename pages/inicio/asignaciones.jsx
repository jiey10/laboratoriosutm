import HeaderUsers from '@/components/HeaderUsers'
import { clearLocalStorage, validateUser } from '@/helpers/Generales';
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
import { getToken, getCurrentTime } from '@/helpers/Generales';
import Head from 'next/head';

function Asignaciones() {

    let oCall = new Call();

    const formRef = useRef(null);

    const validation = yup.object().shape({
        /* number: yup.number()
            .required("Este campo es obligatorio")
            .min(1, "Se requiere un minimo de 3 carácteres"),
        descripcion: yup.string()
            .required("Este campo es obligatorio")
            .min(3, "Se requiere un minimo de 3 carácteres"), */
    })

    let objAsignacion = {
        idAsignation: 0,
        idUser: "",
        idClassroom: "",
    }

    const [asignacion, setAsignacion] = useState(objAsignacion)
    const [salones, setSalones] = useState([])

    const [usuarios, setUsuarios] = useState([])
    const [asignaciones, setAsignaciones] = useState([])

    const [userID, setUserID] = useState(0);
    const [currentTime, setCurrentTime] = useState('');

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

    function GetAllUsers() {
        oCall.cenisFetch("GET", `User`, getToken(), null).then(response => {
            if (response.status === 200) {
                setUsuarios(response.Data)
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    function GetAllAsignations() {
        oCall.cenisFetch("GET", `Asignation`, getToken(), null).then(response => {
            if (response.status === 200) {
                setAsignaciones(response.Data)
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    function GetAll() {
        oCall.cenisFetch("GET", `Classroom`, getToken(), null).then(response => {
            if (response.status === 200) {
                setSalones(response.Data)
                setLoading(false)
                /* response.Data.forEach(x => {
                    if(x.idUser === parseInt(userID))
                    {
                        setUsuarioSalon(true);
                        return;
                    }
                }) */
            }
        }).catch((err) => {
            setLoading(false)
            console.log(err);
        });
    }

    function GetAllData(ID) {
        handleOpenModal();
        setAsignacion({
            ...asignacion,
            idClassroom: ID,
            idUser: userID,
        })
    }

    function Save(values, actions) {
        console.log(values);
        oCall.cenisFetch("PUT", `Classroom/Use${values.idUser}/${values.idClassroom}`, getToken(), null).then(response => {
            console.log(response);
            if (response.status === 200) {
                //SuccessAlert("Registro guardado correctamente.");
                //handleCloseModal();
                //GetAll();
                oCall.cenisFetch("PUT", `Asignation/EnableDisable${values.idUser}/${values.idClassroom}`, getToken(), null).then(response => {
                    console.log(response);
                    if (response.status === 200) {
                        SuccessAlert("Asignación realizada correctamente.");
                        handleCloseModal();
                        GetAll();
                    }
                    else {
                        ErrorAlert("Ocurrió un error al asignar el salón.");
                    }
                }).catch((err) => {
                    console.log(err)
                    ErrorAlert("Ocurrió un error al asignar el salón.");
                });
            }
            else {
                ErrorAlert(response.Data);
            }
        }).catch((err) => {
            console.log(err)
            ErrorAlert("Ocurrió un error al ocupar el registro.");
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

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };


    useEffect(() => {
        GetAll();
        GetAllUsers();
        GetAllAsignations();
        validateUser(getToken());
        const ID = localStorage.getItem("id");
        setUserID(ID);
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            const time = getCurrentTime();
            setCurrentTime(time);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <Head>
                <title>Asignaciones</title>
                <link rel="icon" href="https://www.utmetropolitana.edu.mx/Publicaciones/recursos/BotonImagen/logo%20UTM-01.png" />
            </Head>
            {loading ? <Loader /> :
                <div>
                    <CustomModal
                        showModal={showModal}
                        onSave={Save}
                        onClose={handleCloseModal}
                        title="Asignar">
                        <Formik
                            initialValues={asignacion}
                            validationSchema={validation}
                            enableReinitialize={true}
                            onSubmit={(values, actions) => {
                                Save(values, actions)
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
                                        <label htmlFor="recipient-name" className="col-form-label">
                                            Usuario:
                                        </label>
                                        <select
                                            disabled
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.idUser}
                                            className={`form-select form-select-sm ${errors.idUser && touched.idUser ? 'is-invalid' : ''}`}
                                            id="idUser"
                                            name="idUser">
                                            <option value={0}>Seleccione una opción</option>
                                            {
                                                usuarios.length > 0 ? usuarios.map((item, i) => {
                                                    return <option key={i} value={item.idUser}>{item.nombre + ' ' + item.apellido}</option>
                                                }) : ""
                                            }
                                        </select>
                                        <div className="invalid-feedback">
                                            {errors.idUser}
                                        </div>
                                        <label htmlFor="recipient-name" className="col-form-label">
                                            Salon:
                                        </label>
                                        <select
                                            disabled
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.idClassroom}
                                            className={`form-select form-select-sm ${errors.idClassroom && touched.idClassroom ? 'is-invalid' : ''}`}
                                            id="idClassroom"
                                            name="idClassroom">
                                            <option value={0}>Seleccione una opción</option>
                                            {
                                                salones.length > 0 ? salones.map((item, i) => {
                                                    return <option key={i} value={item.idClassroom}>{item.nombre}</option>
                                                }) : ""
                                            }
                                        </select>
                                        <div className="invalid-feedback">
                                            {errors.idClassroom}
                                        </div>
                                    </div>
                                    <br />
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <a className="btn btn-secondary me-md-2" type="button" onClick={handleCloseModal}>Cerrar</a>
                                        <button className="btn btn-success" type="submit">Guardar</button>
                                    </div>
                                </form>
                            }
                        </Formik>
                    </CustomModal>

                    <HeaderUsers />
                    <div className='container'>
                        <br />
                        <div className="d-flex justify-content-between">
                            <h3>Asignaciones</h3>
                            <h3>Hora actual: {currentTime}</h3>
                        </div>
                        <hr />
                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            {
                                salones.map((salon, index) => (
                                    <div className="col" key={index}>
                                        <div className={`card h-100 ${salon.inUse === true ? 'border-danger' : 'border-success'}`}>
                                            <div className={`card-header ${salon.inUse === true ? 'border-danger' : 'border-success'}`}>
                                                {
                                                    salon.inUse === true ? 
                                                    <h5>OCUPADO</h5>
                                                    : 
                                                    <h5>DISPONIBLE</h5>
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
                                            <div className={`card-footer bg-transparent ${salon.inUse === true ? 'border-danger' : 'border-success'}`}>
                                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                    {
                                                        salon.inUse === false && salon.idUser === null ?
                                                            <a className='btn btn-success' onClick={() => GetAllData(salon.idClassroom)}>Ocupar</a>
                                                            :
                                                            ''
                                                    }
                                                    {
                                                        salon.inUse === true && salon.idUser === parseInt(userID) ?
                                                            <a className='btn btn-danger' onClick={() => GetAllData(salon.idClassroom)}>Desocupar</a>
                                                            :
                                                            ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Asignaciones