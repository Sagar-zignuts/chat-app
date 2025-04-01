import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Move socket connection outside the component to prevent re-creation
const socket = io("http://localhost:3000", {
    reconnection: true, // Allow reconnection if disconnected
});

function App() {
    const [message, setMessage] = useState("");
    const [targetId, setTargetId] = useState("");
    const [messages, setMessages] = useState([]);
    const [socketId, setSocketId] = useState("");
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected", socket.id);
            setSocketId(socket.id); // Set the socket ID once connected
        });

        socket.on("privateMessage", (data) => {
            setMessages((prev) => [
                ...prev,
                `Private message from ${data.sender}: ${data.message}`,
            ]);
        });

        socket.on("broadcastMessage", (data) => {
            setMessages((pre) => [
                ...pre,
                `Broadcast from ${data.sender}: ${data.message}`,
            ]);
        });

        socket.on("roomMessage", (data) => {
            setMessages((pre) => [
                ...pre,
                `Room message from ${data.sender}: ${data.message}`,
            ]);
        });

        return () => {
            socket.off("connect");
            socket.off("privateMessage");
            socket.off("broadcastMessage");
            socket.off("roomMessage");
        };
    }, []);

    const setRoomIdData = (e) => {
        e.preventDefault();
        if (roomId) {
            socket.emit("joinRoom", { roomId });
            // console.log(`socket ${socket.id} is in room id : ${roomId}`);
        }
    };

    const sendPrivateMessage = (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page
        if (targetId && message) {
            // console.log("Sending to:", targetId, "Message:", message);
            socket.emit("sendPrivateMessage", {
                targetSocketId: targetId,
                message,
            });
            setMessages((prev) => [...prev, `You to ${targetId}: ${message}`]);
            setMessage("");
        }
    };

    //send broadcast message to all the other clients
    const sendBroadcastMessage = (e) => {
        e.preventDefault();
        if (message) {
            // console.log("Broadcasting", message);
            socket.emit("sendBroadcastMessage", { message });
            setMessages((pre) => [...pre, `You broadcast: ${message}`]);
        }
    };
    //send message to particular room
    const sendRoomMessage = (e) => {
        e.preventDefault();
        if (roomId && message) {
            (`Sending to room ${roomId} message : ${message}`);
            socket.emit("sendRoomMessage", { roomId, message });
            setMessages((pre) => [...pre, `You to room ${roomId}: ${message}`]);
            setMessage("");
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <input
                type="text"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="Target Socket ID"
            />
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendPrivateMessage}>Send Private</button>
            <button onClick={sendBroadcastMessage}>Broadcast</button>
            <button onClick={sendRoomMessage}>Send Room Message</button>
            <p>Your Socket ID: {socketId}</p>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>

            <br />
            <br />

            <input
                type="text"
                placeholder="Enter room id"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
            />
            <button onClick={setRoomIdData}>Set Room id</button>
        </form>
    );
}

export default App;
