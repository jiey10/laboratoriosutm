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
import { getToken, validateUser } from '@/helpers/Generales';
import Head from 'next/head';

function Maestros() {

    let oCall = new Call();

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

    let objEditUser = {
        idUser: '',
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        imagen: "",
        rol: "",
        materia: ""
    }

    const [usuario, setUsuario] = useState(objUser)
    const [editusuario, setEditUsuario] = useState(objEditUser)
    const [usuarios, setUsuarios] = useState([])

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);


    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenSecondModal = () => {
        setShowSecondModal(true);
    };

    const handleCloseSecondModal = () => {
        setShowSecondModal(false);
    };


    function GetAll() {
        oCall.cenisFetch("GET", `User`, getToken(), null).then(response => {
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
        oCall.cenisFetch("POST", `Auth/register`, getToken(), values).then(response => {
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
        handleOpenSecondModal();
        oCall.cenisFetch("GET", `User/${ID}`, getToken(), null).then(response => {
            if (response.status === 200) {
                setEditUsuario({
                    ...editusuario,
                    idUser: response.Data.idUser,
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

    function EditUser(values, actions) {
        oCall.cenisFetch("PUT", `User`, getToken(), values).then(response => {
            if (response.status === 200) {
                SuccessAlert("Registro actualizado correctamente.");
                handleCloseSecondModal();
                GetAll();
            }
            else {
                ErrorAlert("Ocurrió un error al actualizar el registro.");
            }
        }).catch((err) => {
            ErrorAlert("Ocurrió un error al actualizar el registro.");
        });
    }

    function Disable(ID) {
        oCall.cenisFetch("PUT", `User/EnableDisableUser${ID}`, getToken(), null).then(response => {
            if (response.status === 200) {
                SuccessAlert("Registro desactivado correctamente.");
                GetAll();
            }
            else {
                ErrorAlert("Ocurrió un error al desactivar el registro.")
            }
        }).catch((err) => {
            ErrorAlert("Ocurrió un error al desactivar el registro.")
        });
    }

    function Activate(ID) {
        oCall.cenisFetch("PUT", `User/EnableDisableUser${ID}`, getToken(), null).then(response => {
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
                <title>Maestros</title>
                <link rel="icon" href="https://www.utmetropolitana.edu.mx/Publicaciones/recursos/BotonImagen/logo%20UTM-01.png" />
            </Head>
            {loading ? <Loader /> :
                <Layout>
                    <CustomModal
                        showModal={showModal}
                        onSave={Save}
                        onClose={handleCloseModal}
                        title="Agregar Usuario">
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
                                            {errors.password}
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
                                            <option value={"Teacher"}>Maestro</option>
                                            <option value={"Admin"}>Administrador</option>
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
                                            disabled={values.rol === "Teacher" ? false : true}
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

                    <CustomModal
                        showModal={showSecondModal}
                        onSave={EditUser}
                        onClose={handleCloseSecondModal}
                        title="Editar Usuario">
                        <Formik
                            initialValues={editusuario}
                            validationSchema={''}
                            enableReinitialize={true}
                            onSubmit={(values, actions) => {
                                EditUser(values, actions)
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
                                            <option value={"Teacher"}>Maestro</option>
                                            <option value={"Admin"}>Administrador</option>
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
                                            disabled={values.rol === "Teacher" ? false : true}
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
                                        <a className="btn btn-secondary me-md-2" type="button" onClick={handleCloseSecondModal}>Cerrar</a>
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
                                                    {
                                                        usuario.isDisabled === true ?
                                                            <td>Inactivo</td>
                                                            :
                                                            <td>Activo</td>
                                                    }
                                                    {
                                                        usuario.rol === 'Admin' ?
                                                            <td>Administrador</td>
                                                            :
                                                            <td>Maestro</td>
                                                    }
                                                    {
                                                        usuario.isDisabled === true ?
                                                            <td>
                                                                <div className="d-grid gap-2 d-md-flex justify-content-md">
                                                                    <a className='btn btn-success' onClick={() => Activate(usuario.idUser)}><AiOutlineCheck /></a>
                                                                </div>
                                                            </td>
                                                            :
                                                            usuario.rol === 'Admin' ?
                                                                <td>
                                                                    <div className="d-grid gap-2 d-md-flex justify-content-md">
                                                                        <a className='btn btn-primary' onClick={() => Edit(usuario.idUser)}><BiEditAlt /></a>
                                                                    </div>
                                                                </td>
                                                                :
                                                                <td>
                                                                    <div className="d-grid gap-2 d-md-flex justify-content-md">
                                                                        <a className='btn btn-primary' onClick={() => Edit(usuario.idUser)}><BiEditAlt /></a>
                                                                        <a className='btn btn-danger' onClick={() => Disable(usuario.idUser)}><BiTrash /></a>
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