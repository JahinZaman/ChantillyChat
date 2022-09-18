import "./App.css";
import { Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage.js";
import { useEffect, useState } from "react";
import { ChatContext } from "./Context/ChatProvider";
import { useHistory } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;
