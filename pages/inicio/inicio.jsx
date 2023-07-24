import Layout from '@/components/Layout'
import { clearLocalStorage } from '@/helpers/Generales';
import React from 'react'

function Inicio() {

    const handleClearLocalStorage = () => {
        clearLocalStorage();
    };

    return (
        <Layout>
            <h1>Inicio</h1>
            <button onClick={handleClearLocalStorage}>Limpiar Local Storage</button>
        </Layout>
    )
}

export default Inicio