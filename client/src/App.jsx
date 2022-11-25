import "./App.css";
import io from "socket.io-client";
import { useState, useEffect, useRef} from "react";

//const socket = io("http://localhost:4000/");
const socket = io();

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null)


  const scrollManage = () => {

    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: "end"
    });

  }


  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([...messages, message]);
    };
    socket.on("message", receiveMessage);
    scrollManage();
    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  return (
      <div className="flex h-screen antialiased text-gray-800 justify-center">
        <div className="flex flex-row h-full  sm:w-full lg:w-9/12 xl:w-1/2 2xl:w-1/3 overflow-x-hidden ">
          <div className="flex flex-col flex-auto h-full sm:p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full"  >
                  <ul className="grid grid-cols-12 gap-y-1" ref={bottomRef}>
                    {messages.map((message, index) => (
                      message.from=="Me"? OutputMessage(message, index) : ArrivalMessage(message,index)
                    ))}
                  </ul>
                </div>
              </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-row items-center h-16 rounded-xl bg-white w-full sm:px-4"
                >
                  <div>
                    <button
                      type="button"
                      className="hidden lg:flex items-center justify-center text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        ></path>
                      </svg>
                    </button>
                  </div>

                  <div className="flex-grow ml-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      />

                      <button
                        type="button"
                        className="hidden lg:flex absolute  items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="ml-4 mr-2 sm:mr-0">
                    <button
                      type="submit"
                      className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                    >
                      <span>Send</span>
                      <span className="ml-2">
                        <svg
                          className="w-4 h-4 transform rotate-45 -mt-px"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </div>

                </form>

            </div>
          </div>
        </div>
      </div>
  );
}


const ArrivalMessage = (message, index) => {
  return (
    <li
    key={index}
    className="col-start-1 col-end-10 p-3 rounded-lg"
  >
    <div className="flex flex-row items-center">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
        {message.from.charAt(0).toUpperCase()}
      </div>
      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
        <div className="break-all">{message.body}</div>
      </div>
    </div>
  </li>
    )
} 


const OutputMessage = (message, index) => {
  return (
    <li
    key={index}
    className="col-start-4 col-end-13 p-2 rounded-lg">
      <div className="flex items-center justify-start flex-row-reverse">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-700 flex-shrink-0 text-sky-50 text-sm">
          {message.from}
        </div>
        <div className="relative mr-3 text-sm bg-indigo-100 py-1 px-4 shadow rounded-xl">
          <div className="break-all">{message.body}</div>
          {/* <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
            Seen
          </div> */}
        </div>
      </div>
    </li>
  );
};

export default App;
