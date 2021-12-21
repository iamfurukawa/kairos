const LocalStorageService = () => {

    const getUserInfos = () => {
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr).user : null
    }

    const saveUserInfos = (user) => {
        const userStr = JSON.stringify({ user })
        localStorage.setItem('user', userStr)
        window.location.reload();
    }

    const getWorkType = () => {
        const workTypeStr = localStorage.getItem('work-type')
        return workTypeStr ? JSON.parse(workTypeStr).workType : null
    }

    const saveWorkType = (workType) => {
        const workTypeStr = JSON.stringify({ workType })
        localStorage.setItem('work-type', workTypeStr)
    }

    const getTags = () => {
        const tagsStr = localStorage.getItem('tags')
        return tagsStr ? JSON.parse(tagsStr).tags : null
    }

    const saveTags = (tags) => {
        const tagsStr = JSON.stringify({ tags })
        localStorage.setItem('tags', tagsStr)
    }

    const getTaskLog = () => {
        const tasksStr = localStorage.getItem('tasks')
        return tasksStr ? JSON.parse(tasksStr).tasks : {}
    }

    const saveTaskLog = (tasks) => {
        const tasksStr = JSON.stringify({ tasks })
        localStorage.setItem('tasks', tasksStr)
    }

    return {
        getUserInfos,
        saveUserInfos,

        getWorkType,
        saveWorkType,

        getTags,
        saveTags,

        getTaskLog,
        saveTaskLog,
    }
}

export default LocalStorageService()