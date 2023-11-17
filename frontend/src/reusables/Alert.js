import React, {useState, useEffect} from 'react';
import {makeId} from "./utils";

export default function Alert({text, type, hideable = true, stick = true, close, extraClass = ""}) {
    const [id, setId] = useState(makeId(5));

    function fadeOut(id) {
        const alert_elem = document.getElementById(id);
        if (!alert_elem) return null;
        // console.log('alert', id, alert_elem);
        alert_elem.classList.add("fade-out");
        window.setTimeout(close, 300);
    }

    useEffect(() => {
        if (!stick) window.setTimeout(() => fadeOut(id), 3000);
    }, [])

    if (!text) fadeOut(id);
    return (<div key={id} id={id} className={"alert alert-" + type + " " + extraClass} role="alert">
        {hideable
            ? <div className="alert-toolbar"><span className="icon-close close" onClick={e => fadeOut(id)}/></div>
            : ''
        }
        {text}
    </div>);
}