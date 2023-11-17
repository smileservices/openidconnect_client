import {useEffect} from "react";


export const debug = (message, code = 1) => {
    if (code < 90) return null;

    if (Array.isArray(message)) {
        console.log(...message);
    } else {
        console.log(message);
    }
}

export const makeId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

export function deleteCookie(name) {
    createCookie(name, "", -1);
}

export function getCsrfToken() {
    return getCookie('csrftoken');
}


export function whatType(item) {
    const typeStr = Object.prototype.toString.call(item).slice(8, -1);
    return typeStr.toLowerCase();
}


export function handleClickOutside(wrapperRef, callback) {
    (function (ref) {

        useEffect(() => {

            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref])

    })(wrapperRef);
}

export function isTypeNonEmpty(item, type) {
    // item arg is of type list, object, string; type arg is string,
    // options are "object", "array", "string".
    //
    // returns a boolean.
    // if the item is of that specific type and non-empty,
    // returns true
    if (type === 'array') {
        return Array.isArray(item) && item.length > 0;
    } else if (type === 'object') {
        return typeof item === 'object' && Object.keys(item).length > 0;
    } else if (type === 'string') {
        return typeof item === 'string' && item.length > 0;
    }
    alert("Invalid type " + type); // Invalid type provided
}

export function transformObjectToListIfEmpty(obj) {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    if (Object.keys(obj).length > 0) return obj;
    return [];
}

export function transformListToObjectIfEmpty(list) {
    if (!Array.isArray(list) || list.length > 0) {
        return list; // Return the original list if it's not an empty array
    }
    return {};
}

export function getParameterByName(name, url = window.location.href) {
    /*
    * Call getParameterByName('parameterName').
    * If the parameter exists, the function will return its value.
    * If the parameter doesn't exist, the function will return null.
    *
    * */
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}