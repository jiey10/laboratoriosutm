

export function getToken() {
    let token = ""
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token')
        return token;
    }
    return token;
}

export const saveDataToLocalStorage = (token, firstName, lastName, rol, isDisabled) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('rol', rol);
        localStorage.setItem('isDisabled', isDisabled);
    }
};


export const getDataFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        const rol = localStorage.getItem('rol');
        const isDisabled = localStorage.getItem('isDisabled');

        // Imprime los datos en la consola para verificar que son correctos
        console.log('Datos del Local Storage:', { token, firstName, lastName, rol, isDisabled });

        return { token, firstName, lastName, rol, isDisabled };
    }
};


export const clearLocalStorage = () => {
    localStorage.clear();
};