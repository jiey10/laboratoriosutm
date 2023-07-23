import Swal from 'sweetalert2';
import React, { useEffect } from 'react';

const SweetAlert = ({ type, text }) => {
    useEffect(() => {
        switch (type) {
            case "success":
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: text,
                    showConfirmButton: false,
                    timer: 1500
                });
                break;

            default:
                break;
        }
    }, [type, text]);

    return null; // El componente no renderiza nada, solo muestra el SweetAlert
};

export default SweetAlert;
