import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

function CreateTask({ tasks, setTasks }) {
  const [task, setTask] = useState({
    id: "",
    name: "",
    status: "todo",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.name.length < 3)
      return toast.error("A task must have more than 3 characters");
    if (task.name.length > 100)
      return toast.error("A task must not be more than 100 characters");

    setTasks((prev) => {
      const list = [...prev, task]; // اضافه کردن تسک جدید به لیست تسک‌ها
      localStorage.setItem("tasks", JSON.stringify(list));
      return list;
    });

    toast.success("Task created");

    setTask({
      id: "",
      name: "",
      status: "todo",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center flex-col gap-2 sm:gap-0 sm:flex-row mt-20"
    >
      <input
        value={task.name}
        type="text"
        className="border-2 outline-none font-medium text-lg border-purple-600  bg-transparent rounded-md sm:mr-2  w-full sm:w-full p-3 "
        onChange={(e) =>
          setTask({ ...task, id: uuidv4(), name: e.target.value })
        }
        placeholder="task......"
      />
      <button className="md:relative text-white w-80 sm:w-auto bg-purple-600 font-medium text-lg hover:bg-purple-500 transition-all ease-in-out duration-200 delay-75 rounded-md p-3 ">
        create
      </button>
    </form>
  );
}

export default CreateTask;
