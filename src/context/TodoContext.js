import { createContext, useState, useEffect } from "react";

const TodoContext = createContext()

const refer = (selector) => document.querySelector(selector)

const getLocalData = () => {
    let list = JSON.parse(localStorage.getItem("myTodoList"))
    if(list) {
        return list
    } else {
        list = []
        return list
    }
}

export const TodoProvider = ({ children }) => {
    const [inputData, setInputData] = useState('')
    const [items, setItems] = useState(getLocalData())
    const [isEditing, setIsEditing] = useState(false)
    const [editingItem, setEditingItem] = useState('')
    const [hasCompletedTasks, setHasCompletedTasks] = useState(false)
    const [completedHidden, setCompletedHidden] = useState(false)
    const [sortDir, setSortDir] = useState("up")

    const handleAdd = () => {
        let inp = inputData.trim()
        if (inp.length !== 0) {

            if (isEditing) {
                setItems(items.map((el) => {
                    if (el.id === editingItem.id) {
                        editingItem.title = inputData
                    }
                    return el
                }))
                setIsEditing(false)
                setEditingItem('')
            }

            if (!isEditing) {
                const newInp = {
                    id: new Date().getTime().toString(),
                    title: inp,
                    complete: false,
                }
                setItems([newInp, ...items])
            }
        }
        setInputData('')
    }

    const handleCancle = () => {
        setInputData("")
        setIsEditing(false)
        setEditingItem("")
    }

    const handleDelete = (id) => {
        const updated = items.filter((el) => el.id !== id)
        setIsEditing(false)
        setInputData("")
        setItems(updated)
    }

    const handleRemoveAll = () => {
        if (window.confirm("Confirm to delete all your todos")) setItems([])
    }

    const handleComplete = (id) => {
        setItems(items.map((el) => {
            if (el.id === id) {
                el.complete === true ? el.complete = false : el.complete = true
            }
            return el
        }))
    }

    const handleEditStatus = (id) => {
        const editItem = items.find((el) => el.id === id)
        setInputData(editItem.title)
        refer('.form input').focus()
        setEditingItem(editItem)
        setIsEditing(true)
    }

    const sortItems = (objs) => {
        let tmp = null
        if (sortDir === "up") {
            tmp = objs.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
        }
        if (sortDir === "down") {
            tmp = objs.sort((a, b) => (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0));
        }
        sortDir === "up" ? setSortDir("down") : setSortDir("up")
        setItems([...tmp]);
    }

    const checkHasCompltedTask = () => {
        let completedTasksArray = items.find(el => el.complete === true)
        completedTasksArray ? setHasCompletedTasks(true) : setHasCompletedTasks(false)
    }

    useEffect(() => {
        localStorage.setItem('myTodoList', JSON.stringify(items))
        checkHasCompltedTask()

    }, [items])

    return (
        <TodoContext.Provider
            value={{
                inputData,
                completedHidden,
                items,
                isEditing,
                hasCompletedTasks,
                editingItem,
                setHasCompletedTasks,
                setItems,
                setInputData,
                handleAdd,
                handleCancle,
                handleDelete,
                handleComplete,
                handleRemoveAll,
                handleEditStatus,
                sortItems,
                checkHasCompltedTask,
                setCompletedHidden,
                refer,
            }}
        >{children}</TodoContext.Provider>
    )
}

export default TodoContext