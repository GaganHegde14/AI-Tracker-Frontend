import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([])
    const [info, setInfo] = useState([])

    const token = localStorage.getItem("token")


    const fechTask = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/task/getTask`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(res.data.task || [])

        } catch (error) {
            console.log(error)
        }
    }


    const userData = async () => {
        try {
            const res2 = await axios.get(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/userinfo`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setInfo(res2.data.user)

        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        if (token) {
            fechTask();
            userData();
        }
    }, [token])


    const totalTask = tasks?.length || 0;
    const completeTask = tasks?.filter(t => t.status === 'Completed')?.length || 0;
    const isPendingTask = tasks?.filter(t => t.status === 'Pending')?.length || 0;
    const inProgressTask = tasks?.filter(t => t.status === 'In Progress')?.length || 0;
    const holdTask = tasks?.filter(t => t.status === 'Hold')?.length || 0;

    return (
        <TaskContext.Provider value={{
            tasks,
            fechTask,
            setTasks,
            info,
            token,
            status: { totalTask, completeTask, isPendingTask, inProgressTask, holdTask }
        }}>
            {children}
        </TaskContext.Provider>
    )

}


export const useTask = () => useContext(TaskContext)