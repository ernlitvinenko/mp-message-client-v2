import {io} from "socket.io-client";
import {BASE_HOST} from "@/service/default";

const $socket = io(BASE_HOST, {
        reconnectionDelayMax: 10000,
        autoConnect:false
    }
)


export function connect() {
    $socket.emit("connection", {
        token: localStorage.getItem("token")
    })
    $socket.on("connection", (args) => {
        console.log(args)
    })

}


export function onNewMessage() {
    $socket.on("new_message", (arg) => {console.log(arg)})
}



export default $socket;