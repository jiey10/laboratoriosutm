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
import { getToken, validateUser } from '@/helpers/Generales';
import Head from 'next/head';

function Llaves() {

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
    const [llaves, setLlaves] = useState([])

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
        oCall.cenisFetch("GET", `Key`, getToken(), null).then(response => {
            if (response.status === 200) {
                setLlaves(response.Data)
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
        validateUser(getToken());
    }, [])

    return (
        <>
            <Head>
                <title>Llaves</title>
                <link rel="icon" href="https://www.utmetropolitana.edu.mx/Publicaciones/recursos/BotonImagen/logo%20UTM-01.png" />
            </Head>
            {loading ? <Loader /> :
                <Layout>
                    <CustomModal
                        showModal={showModal}
                        onSave={Save}
                        onClose={handleCloseModal}
                        innerRef={formRef}
                        title="Catálogo Llaves">
                        <Formik
                            initialValues={llave}
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
                                            Número:
                                        </label>
                                        <input type="number"
                                            autoComplete='off'
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.number}
                                            className={`form-control form-control-sm ${errors.number && touched.number ? 'is-invalid' : ''}`}
                                            id="number"
                                            name="number"
                                        />
                                        <div className="invalid-feedback">
                                            {errors.number}
                                        </div>
                                        <label htmlFor="recipient-name" className="col-form-label">
                                            Descripción:
                                        </label>
                                        <input type="text"
                                            autoComplete='off'
                                            maxLength={100}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.descripcion}
                                            className={`form-control form-control-sm ${errors.descripcion && touched.descripcion ? 'is-invalid' : ''}`}
                                            id="descripcion"
                                            name="descripcion"
                                        />
                                        <div className="invalid-feedback">
                                            {errors.descripcion}
                                        </div>
                                        {/* <select
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.rol}
                                            className={`form-select form-select-sm ${errors.rol && touched.rol ? 'is-invalid' : ''}`}
                                            id="rol"
                                            name="rol">
                                            <option value={""}>Selecciona una opción</option>
                                            <option value={"Maestro"}>Maestro</option>
                                            <option value={"Administrador"}>Administrador</option>
                                        </select> */}
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

                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between">
                                <h3>Llaves</h3>
                                <a className="btn btn-success" onClick={(handleOpenModal)}>
                                    <BsPlusCircleFill />
                                </a>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Descripcion</th>
                                        <th>Estatus</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {llaves.length == 0 ?
                                        <tr key={llaves.idKey}>
                                            <td colSpan={4} className="text-center">No existen registros a mostrar</td>
                                        </tr>
                                        :
                                        llaves.map((llave, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{llave.number}</td>
                                                    <td>{llave.descripcion}</td>
                                                    {
                                                        llave.isDisabled === true ?
                                                            <td>Inactivo</td>
                                                            :
                                                            <td>Activo</td>
                                                    }
                                                    {
                                                        llave.isDisabled === true ?
                                                            <td>
                                                                <div className="d-grid gap-2 d-md-flex justify-content-md">
                                                                    <a className='btn btn-success' onClick={() => Activate(llave.idKey)}><AiOutlineCheck /></a>
                                                                </div>
                                                            </td>
                                                            :
                                                            <td>
                                                                <div className="d-grid gap-2 d-md-flex justify-content-md">
                                                                    <a className='btn btn-primary' onClick={() => Edit(llave.idKey)}><BiEditAlt /></a>
                                                                    <a className='btn btn-danger' onClick={() => Delete(llave.idKey)}><BiTrash /></a>
                                                                </div>
                                                            </td>
                                                    }


                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Layout>
            }
        </>
    )
}

export default Llaves