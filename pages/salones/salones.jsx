import Layout from '@/components/Layout'
import Loader from '@/components/Loader';
import CustomModal from '@/components/Modal';
import { Call } from '@/helpers/Call';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { BsPlusCircleFill } from 'react-icons/bs'
import { AiOutlineCheck } from 'react-icons/ai'
import Swal from 'sweetalert2';
import * as yup from "yup";
import { getToken } from '@/helpers/Generales';
import { useRouter } from 'next/router';

function Salones() {

    let oCall = new Call();

    const router = useRouter();

    const validation = yup.object().shape({
        idKey: yup.number()
            .required("Este campo es obligatorio")
            .min(1, "Este campo es obligatorio"),
        descripcion: yup.string()
            .required("Este campo es obligatorio")
            .min(3, "Se requiere un minimo de 3 carácteres"),
    })

    let objSalon = {
        idClassroom: 0,
        idKey: "",
        descripcion: "",
    }

    const [salon, setSalon] = useState(objSalon)
    const [salones, setSalones] = useState([])
    const [llaves, setLlaves] = useState([])

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    function GetAllKeys() {
        oCall.cenisFetch("GET", `Key/UnUsedKeys`, getToken(), null).then(response => {
            if (response.status === 200) {
                setLlaves(response.Data)
                setLoading(false)
            }
        }).catch((err) => {
            setLoading(false)
            console.log(err);
        });
    }

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
        oCall.cenisFetch("POST", `Classroom/CreateUpdateClassroom`, getToken(), values).then(response => {
            console.log(response);
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
        oCall.cenisFetch("GET", `Classroom/${ID}`, getToken(), null).then(response => {
            console.log(response);
            if (response.status === 200) {
                handleOpenModal();
                setSalon({
                    ...salon,
                    idClassroom: response.Data.idClassroom,
                    idKey: response.Data.idKey,
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
        oCall.cenisFetch("DELETE", `Classroom/${ID}`, getToken(), null).then(response => {
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
        oCall.cenisFetch("PUT", `Classroom/${ID}`, getToken(), null).then(response => {
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

    function validateUser(){
        let token = getToken();
        if(token === "" || token === null || token === undefined){
            router.push("/")
        }
    }

    useEffect(() => {
        GetAll();
        GetAllKeys();
        validateUser();
    }, [])

    return (
        <>
            {loading ? <Loader /> :
                <Layout>
                    <CustomModal
                        showModal={showModal}
                        onSave={Save}
                        onClose={handleCloseModal}
                        title="Catálogo Salones">
                        <Formik
                            initialValues={salon}
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
                                        <label htmlFor="recipient-name" className="col-form-label">
                                            Rol:
                                        </label>
                                        <select
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.idKey}
                                            className={`form-select form-select-sm ${errors.idKey && touched.idKey ? 'is-invalid' : ''}`}
                                            id="idKey"
                                            name="idKey">
                                            <option value={0}>Seleccione una opción</option>
                                            {
                                                llaves.length > 0 ? llaves.map((item, i) => {
                                                    return <option key={i} value={item.idKey}>{item.descripcion}</option>
                                                }) : ""
                                            }
                                        </select>
                                        <div className="invalid-feedback">
                                            {errors.idKey}
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
                                <h3>Salones</h3>
                                <a className="btn btn-success" onClick={(handleOpenModal)}>
                                    <BsPlusCircleFill />
                                </a>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Descripcion</th>
                                        <th>Llave</th>
                                        <th>Estatus</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salones.length == 0 ?
                                        <tr key={salones.idClassroom}>
                                            <td colSpan={4} className="text-center">No existen registros a mostrar</td>
                                        </tr>
                                        :
                                        salones.map((salon, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{salon.descripcion}</td>
                                                    <td>{salon.idKey}</td>
                                                    {
                                                        salon.isDisabled === true ?
                                                            <td>Inactivo</td>
                                                            :
                                                            <td>Activo</td>
                                                    }
                                                    {
                                                        salon.isDisabled === true ?
                                                            <td>
                                                                <div className="d-grid gap-2 d-md-flex justify-content-md">
                                                                    <a className='btn btn-success' onClick={() => Activate(salon.idClassroom)}><AiOutlineCheck /></a>
                                                                </div>
                                                            </td>
                                                            :
                                                            <td>
                                                                <div className="d-grid gap-2 d-md-flex justify-content-md">
                                                                    <a className='btn btn-primary' onClick={() => Edit(salon.idClassroom)}><BiEditAlt /></a>
                                                                    <a className='btn btn-danger' onClick={() => Delete(salon.idClassroom)}><BiTrash /></a>
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

export default Salones