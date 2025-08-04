import React from "react";
import "./styling/App.css";
import Header from "./components/header";
import Content from "./components/content";
import RightSideTrigger from "./components/rightSideTrigger";
import Event from "./components/event";
function App() {
  return (
    <div className="App">
      <Header />
      <Content />
      <RightSideTrigger />
      <Event />
    </div>
  );
}

export default App;
