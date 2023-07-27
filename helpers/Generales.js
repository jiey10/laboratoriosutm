import { BehaviorSubject } from "rxjs";
import Router from 'next/router';

const userSubject = new BehaviorSubject(process.browser && localStorage.getItem('nombre'));

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    logout,
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('nombre');
    localStorage.removeItem('apellido');
    localStorage.removeItem('rol');
    localStorage.removeItem('isDisabled');
    Router.push('/');
}

export function getToken() {
    let token = ""
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token')
        return token;
    }
    return token;
}


export function validateUser(token) {
    if (token === "" || token === null) {
        Router.push("/")
    }
}


export const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};
