import React, { useState,useEffect } from 'react';
import CreateTask from './components/inputTask';
import ListTask from './components/listTask';
import { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";

const App = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
      const storedTasks = JSON.parse(localStorage.getItem("tasks"));
      setTasks(storedTasks || []);
    }, [])

    return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <Toaster />
      <div className="bg-slate-200 w-screen min-h-screen flex flex-col items-center pt-10 gap-16">
        <CreateTask tasks={tasks} setTasks={setTasks} />
        <ListTask tasks={tasks} setTasks={setTasks} />
      </div>
    </DndProvider>
    );
};

export default App;
