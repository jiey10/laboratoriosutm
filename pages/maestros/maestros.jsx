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

function Maestros() {

    let oCall = new Call();

    let token = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJpdmFuQGhvdG1haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU0EiLCJleHAiOjE2OTAxODA2OTV9.kYm30e78RFanxH_YQf1hzFANTzkEcXrZx92NSS8SpK6O67RqgOrfxjm4LenUQbuti_t43DYDNUl-N2FP25tTPg'

    const validation = yup.object().shape({
        nombre: yup.string()
            .required("Este campo es obligatorio")
            .min(3, "Se requiere un minimo de 3 carácteres"),
        apellido: yup.string()
            .required("Este campo es obligatorio")
            .min(3, "Se requiere un minimo de 3 carácteres"),
        correo: yup.string()
            .required("Este campo es obligatorio")
            .min(3, "Se requiere un minimo de 3 carácteres"),
        password: yup.string()
            .required("Este campo es obligatorio")
            .min(3, "Se requiere un minimo de 3 carácteres"),
        rol: yup.string()
            .required("Este campo es obligatorio"),
    })

    let objUser = {
        password: "",
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        imagen: "",
        rol: "",
        materia: ""
    }

    const [usuario, setUsuario] = useState(objUser)
    const [usuarios, setUsuarios] = useState([])

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    function GetAll() {
        oCall.cenisFetch("GET", `User`, null, null).then(response => {
            if (response.status === 200) {
                setUsuarios(response.Data)
                setLoading(false)
            }
        }).catch((err) => {
            setLoading(false)
            console.log(err);
        });
    }

    function Save(values, actions) {
        oCall.cenisFetch("POST", `Auth/register`, null, values).then(response => {
            if (response.status === 201) {
                SuccessAlert("Registro guardado correctamente.");
                handleCloseModal();
                GetAll();
            }
            else {
                ErrorAlert("Ocurrió un error al guardar el registro.");
            }
        }).catch((err) => {
            ErrorAlert("Ocurrió un error al guardar el registro.");
        });
    }

    function Edit(ID) {
        oCall.cenisFetch("GET", `User/${ID}`, null, null).then(response => {
            console.log(response);
            if (response.status === 200) {
                handleOpenModal();
                setUsuario({
                    ...usuario,
                    password: response.Data.password,
                    nombre: response.Data.nombre,
                    apellido: response.Data.apellido,
                    telefono: response.Data.telefono,
                    correo: response.Data.correo,
                    rol: response.Data.rol,
                    materia: response.Data.materia
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
        oCall.cenisFetch("DELETE", `User/${ID}`, token, null).then(response => {
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
        oCall.cenisFetch("PUT", `User/${ID}`, token, null).then(response => {
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
            {loading ? <Loader /> :
                <Layout>
                    <CustomModal
                        showModal={showModal}
                        onSave={Save}
                        onClose={handleCloseModal}
                        title="Catálogo Maestros">
                        <Formik
                            initialValues={usuario}
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
                                            Nombre:
                                        </label>
                                        <input type="text"
                                            autoComplete='off'
                                            maxLength={100}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.nombre}
                                            className={`form-control form-control-sm ${errors.nombre && touched.nombre ? 'is-invalid' : ''}`}
                                            id="nombre"
                                            name="nombre"
                                        />
                                        <div className="invalid-feedback">
                                            {errors.nombre}
                                        </div>
                                        <label htmlFor="recipient-name" className="col-form-label">
                                            Apellido:
                                        </label>
                                        <input type="text"
                                            autoComplete='off'
                                            maxLength={100}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.apellido}
                                            className={`form-control form-control-sm ${errors.apellido && touched.apellido ? 'is-invalid' : ''}`}
                                            id="apellido"
                                            name="apellido"
                                        />
                                        <div className="invalid-feedback">
                                            {errors.apellido}
                                        </div>
                                        <label htmlFor="recipient-name" className="col-form-label">
                                            Telefóno:
                                        </label>
                                        <input type="text"
                                            autoComplete='off'
                                            maxLength={10}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.telefono}
                                            className={`form-control form-control-sm ${errors.telefono && touched.telefono ? 'is-invalid' : ''}`}
                                            id="telefono"
                                            name="telefono"
                                        />
                                        <div className="invalid-feedback">
                                            {errors.telefono}
                                        </div>
                                        <label htmlFor="recipient-name" className="col-form-label">
                                            Correo electrónico:
                                        </label>
                                        <input type="text"
                                            autoComplete='off'
                                            maxLength={100}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.correo}
                                            className={`form-control form-control-sm ${errors.correo && touched.correo ? 'is-invalid' : ''}`}
                                            id="correo"
                                            name="correo"
                                        />
                                        <div className="invalid-feedback">
                                            {errors.correo}
                                        </div>
                                        <label htmlFor="recipient-name" className="col-form-label">
                                            Contraseña:
                                        </label>
                                        <input type="password"
                                            autoComplete='off'
                                            maxLength={10}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.password}
                                            className={`form-control form-control-sm ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                        />
                                        <div className="invalid-feedback">
                                            {errors.telefono}
                                        </div>
                                        <label htmlFor="recipient-name" className="col-form-label">
                                            Rol:
                                        </label>
                                        <select
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.rol}
                                            className={`form-select form-select-sm ${errors.rol && touched.rol ? 'is-invalid' : ''}`}
                                            id="rol"
                                            name="rol">
                                            <option value={""}>Selecciona una opción</option>
                                            <option value={"Maestro"}>Maestro</option>
                                            <option value={"Administrador"}>Administrador</option>
                                        </select>
                                        <div className="invalid-feedback">
                                            {errors.rol}
                                        </div>
                                        <label htmlFor="recipient-name" className="col-form-label">
                                            Materia:
                                        </label>
                                        <input type="text"
                                            autoComplete='off'
                                            maxLength={50}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.materia}
                                            className={`form-control form-control-sm ${errors.materia && touched.materia ? 'is-invalid' : ''}`}
                                            id="materia"
                                            name="materia"
                                        />
                                        <div className="invalid-feedback">
                                            {errors.materia}
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

                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between">
                                <h3>Maestros</h3>
                                <a className="btn btn-success" onClick={(handleOpenModal)}>
                                    <BsPlusCircleFill />
                                </a>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Estatus</th>
                                        <th>Rol</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.length == 0 ?
                                        <tr key={usuarios.userId}>
                                            <td colSpan={5} className="text-center">No existen registros a mostrar</td>
                                        </tr>
                                        :
                                        usuarios.map((usuario, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{usuario.nombre} {usuario.apellido}</td>
                                                    <td>{usuario.correo}</td>
                                                    <td>{usuario.telefono}</td>
                                                    <td>{usuario.rol}</td>
                                                    {
                                                        usuario.isDisabled === true ?
                                                            <td>Inactivo</td>
                                                            :
                                                            <td>Activo</td>
                                                    }
                                                    {
                                                        usuario.isDisabled === true ?
                                                            <td>
                                                                <div className="d-grid gap-2 d-md-flex justify-content-md">
                                                                    <a className='btn btn-success' onClick={() => Activate(usuario.idUser)}><AiOutlineCheck /></a>
                                                                </div>
                                                            </td>
                                                            :
                                                            <td>
                                                                <div className="d-grid gap-2 d-md-flex justify-content-md">
                                                                    <a className='btn btn-primary' onClick={() => Edit(usuario.idUser)}><BiEditAlt /></a>
                                                                    <a className='btn btn-danger' onClick={() => Delete(usuario.idUser)}><BiTrash /></a>
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

export default Maestros