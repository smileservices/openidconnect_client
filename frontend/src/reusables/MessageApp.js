import Alert from "./Alert";
import {debug} from "./utils";


export default function MessageApp({controller}) {
    if (!controller.state.message) return "";
    // console.log("MESSAGE APP", controller.state.message);
    return (
        <Alert
            extraClass="system-message"
            type={controller.state.message.type}
            stick={false}
            close={e => controller.dispatch({type: "SET_MESSAGE", payload: null})}
            text={controller.state.message.text}
        />
    )
}