import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Notes from "../src/components/Notes";
import Auth from "../src/components/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
