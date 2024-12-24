import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";
import { FcCancel, FcLikePlaceholder } from "react-icons/fc";
import { IoIosRemoveCircleOutline } from "react-icons/io";

function ListTasks({ tasks, setTasks }) {
  const [todos, setTodos] = useState([]); // حالت برای تسک‌های در حال انجام
  const [inProgress, setInProgress] = useState([]); // حالت برای تسک‌های در حال پیشرفت
  const [closed, setClosed] = useState([]); // حالت برای تسک‌های بسته شده

  useEffect(() => {
    const fTodos = tasks.filter((task) => task.status === "todo"); // فیلتر کردن تسک‌های در حال انجام
    const fInProgress = tasks.filter((task) => task.status === "inProgress"); // فیلتر کردن تسک‌های در حال پیشرفت
    const fClosed = tasks.filter((task) => task.status === "closed"); // فیلتر کردن تسک‌های بسته شده

    setTodos(fTodos); // به‌روزرسانی حالت todos
    setInProgress(fInProgress); // به‌روزرسانی حالت inProgress
    setClosed(fClosed); // به‌روزرسانی حالت closed
  }, [tasks]); // وابستگی به tasks

  const statuses = ["todo", "inProgress", "closed"]; // وضعیت‌های مختلف تسک‌ها

  return (
    <div className="flex gap-16 flex-col lg:flex-row">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          closed={closed}
        />
      ))}
    </div>
  );
}

export default ListTasks; // صادرات کامپوننت ListTasks

const Section = ({ status, tasks, setTasks, todos, inProgress, closed }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task", // نوع تسک‌هایی که می‌توانند در این بخش رها شوند
    drop: (item) => addItemToSection(item.id), // تابعی که هنگام رها کردن تسک فراخوانی می‌شود
    collect: (monitor) => ({
      isOver: !!monitor.isOver(), // بررسی اینکه آیا تسکی در حال رها شدن است
    }),
  }));

  let text = "ToDo";
  let bg = "bg-green-500";
  let tasksToMap = todos; // تسک‌های مربوط به وضعیت ToDo

  if (status === "inProgress") {
    text = "In Progress";
    bg = "bg-sky-500";
    tasksToMap = inProgress; // تعیین تسک‌های مربوط به In Progress
  }

  if (status === "closed") {
    text = "Closed";
    bg = "bg-yellow-500";
    tasksToMap = closed; // تعیین تسک‌های مربوط به Closed
  }

  const addItemToSection = (id) => {
    setTasks((prev) => {
      const mTasks = prev.map((t) => {
        if (t.id === id) {
          return { ...t, status: status }; // به‌روزرسانی وضعیت تسک
        }
        return t;
      });
      localStorage.setItem("tasks", JSON.stringify(mTasks));
      toast("Task status changed", { icon: <FcLikePlaceholder /> });
      return mTasks;
    });
  };

  const updateTask = (id) => {
    const newTaskText = prompt(
      "Update your task:",
      tasks.find((task) => task.id === id)?.name
    );
    if (newTaskText) {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? { ...t, name: newTaskText } : t))
      );
    }
  };
  return (
    <div
      className={`min-w-[360px] lg:min-w-64 p-2 ${
        isOver
          ? `${bg} bg-opacity-25 rounded-md transition-all ease-in-out `
          : ""
      }`}
      ref={drop} // مرجع برای قابلیت Drop
    >
      <Header
        text={text}
        bg={bg}
        className="text-white"
        count={tasksToMap.length} // تعداد تسک‌ها
      />
      {tasksToMap.length > 0 &&
        tasksToMap.map((task, index) => (
          <Task
            key={task.id}
            tasks={tasks}
            setTasks={setTasks}
            task={task}
            index={index}
            status={status}
            bg={bg}
            updateTask={updateTask}
          />
        ))}
    </div>
  );
};

const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center justify-between h-14 px-4 rounded-md text-white text-xl font-bold select-none`}
    >
      {text}
      <div className="ml-2 p-4 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center font-bold select-none">
        {count}
      </div>
    </div>
  );
};

const Task = ({ task, tasks, setTasks, index, status, bg, updateTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task", 
    item: { id: task.id, index, status }, // اطلاعات تسک
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // بررسی اینکه آیا تسک در حال کشیده شدن است
    }),
  }));

  const [{ isOver }, drop] = useDrop({
    accept: "task", // نوع تسک‌هایی که می‌توانند در این بخش رها شوند
    hover: (draggedItem) => {
      if (draggedItem.id !== task.id) {
        moveTask(draggedItem.index, index, draggedItem.status, status); // جابجایی تسک
        draggedItem.index = index; // به‌روزرسانی ایندکس تسک کشیده شده
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(), // بررسی اینکه آیا تسکی در حال رها شدن است
    }),
  });

  const moveTask = (fromIndex, toIndex, fromStatus, toStatus) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const [movedTask] = updatedTasks.splice(
        prevTasks.findIndex((t) => t.id === tasks[fromIndex].id),
        1
      );
      movedTask.status = toStatus; // به‌روزرسانی وضعیت تسک
      updatedTasks.splice(toIndex, 0, movedTask);
      return updatedTasks;
    });
  };

  const handleDelete = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setTasks(newTasks);
    toast("Task removed", { icon: <FcCancel /> });
  };

  const taskTextStyle =
    task.status === "closed" ? "line-through text-red-600" : "text-white"; // استایل متن تسک

  return (
    <div
      ref={(node) => drag(drop(node))} // مرجع برای قابلیت Drag and Drop
      className={`p-4 flex items-center justify-between mt-6 shadow rounded-md relative ${
        isDragging ? "opacity-25" : "opacity-100"
      } cursor-grab ${isOver ? "bg-gray-100" : ""} ${bg}`}
    >
      <p className={`${taskTextStyle} text-xl font-medium`}>{task.name}</p>

      {task.status === "inProgress" || task.status === "todo" ? ( // نمایش دکمه آپدیت برای تسک‌های در حال پیشرفت و در حال انجام
        <div className="ml-4">
          <button
            onClick={() => updateTask(task.id)}
            className="text-gray-700 transition-all duration-200 delay-100 font-medium ease-out rounded-lg p-2 bg-yellow-300 hover:bg-yellow-200 "
          >
            Update
          </button>
        </div>
      ) : null}

      {task.status === "closed" ? ( // نمایش دکمه حذف تنها برای تسک‌های بسته شده
        <div className="ml-4">
          {/* قرار دادن دکمه در یک div جداگانه */}
          <button
            onClick={() => handleDelete(task.id)}
            className="text-white transition-all duration-200 delay-100 font-medium ease-out rounded-lg p-2 bg-red-600 hover:bg-red-500 "
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
};
