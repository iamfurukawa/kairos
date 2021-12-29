import React, { useEffect, useState } from 'react'

import {
    Button,
    Modal,
    Table,
    Tag
} from 'antd'

import {
    ExclamationCircleOutlined,
    MinusOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    PlusOutlined
} from '@ant-design/icons'

import moment from 'moment'

import LocalStorageService from '../../services/local-storage'
import TaskManagerService from '../../services/task-manager'

import DatePagination from '../../components/date-pagination'
import MenuComponent from '../../components/menu'

import InitModal from '../../components/init-modal'
import ClearAllModal from '../../components/clear-all-modal'
import DownloadModal from '../../components/download-modal'
import JiraSyncModal from '../../components/jira-sync-modal'
import NewTaskModal from '../../components/new-task-modal'

import styles from './home.module.scss'
import TagsModal from '../../components/tags-modal'
import WorkTypeModal from '../../components/work-type-modal'
import DashboardPage from '../dashboard'

const HomePage = () => {

    const [selectedDate, setSelectedDate] = useState(moment())

    const [isModalInitOpen, setModalInitOpen] = useState(false)
    const [isModalNewTaskOpen, setModalNewTaskOpen] = useState(false)
    const [isModalClearAllOpen, setModalClearAllOpen] = useState(false)
    const [isModalDownloadOpen, setModalDownloadOpen] = useState(false)
    const [isModalJiraSyncOpen, setModalJiraSyncOpen] = useState(false)
    const [isModalTagsOpen, setModalTagsOpen] = useState(false)
    const [isModalWorkTypeOpen, setModalWorkTypeOpen] = useState(false)
    const [isDashboardOpen, setDashboardOpen] = useState(false)

    const [dataSource, setDataSource] = useState([])
    const [selectedTasks, setSelectedTasks] = useState([])
    const [task, setTask] = useState({})

    const { confirm } = Modal

    useEffect(() => {
        setModalInitOpen(LocalStorageService.getUserInfos() === null)
    }, [])

    useEffect(() => {
        reloadDataSorce()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, isModalClearAllOpen, isModalNewTaskOpen, isModalJiraSyncOpen])

    const reloadDataSorce = () => setDataSource(TaskManagerService.taskMapperToDataSource(selectedDate))

    const onPause = (task) => {
        TaskManagerService.pauseTask(task, selectedDate)
        reloadDataSorce()
    }

    const onContinue = (task) => {
        TaskManagerService.continueTask(task, selectedDate)
        setSelectedDate(moment())
        reloadDataSorce()
    }

    const removeTask = () => {
        confirm({
            title: 'Do you Want to delete these task(s)?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                selectedTasks.forEach(task => TaskManagerService.removeTask(task.key, selectedDate))
                reloadDataSorce()
                setSelectedTasks([])
            },
            onCancel() {
                console.log('Operation Cancelled');
            },
        })
    }

    const unSync = (uuid) => {
        TaskManagerService.unSync(uuid, selectedDate)
        reloadDataSorce()
    }

    const editTask = (uuid) => {
        setTask(uuid)
        setModalNewTaskOpen(true)
    }

    const columns = [
        {
            title: 'Task',
            dataIndex: 'task',
            key: 'task',
        },
        {
            title: 'Sync',
            dataIndex: 'sync',
            key: 'sync',
            render: (isSync, item) => (
                <Tag color={isSync ? 'green' : 'yellow'}>
                    {item.jiraItem ? (isSync ? 'Synced' : 'Pending') : 'Missing Jira Item'}
                </Tag>
            ),
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '',
            dataIndex: 'startStop',
            key: 'startStop',
            render: (startStop, item) => (
                <>
                    {startStop
                        ? <PlayCircleOutlined className={styles.playIcon} onClick={() => onContinue(item)} />
                        : <PauseCircleOutlined className={styles.pauseIcon} onClick={() => onPause(item)} />
                    }
                </>
            ),
        },
    ];

    const rowSelection = {
        onChange: (_, selectedRows) => {
            setSelectedTasks(selectedRows)
        },
    }

    const expandedRowRender = record => {
        return (
            <div style={{ margin: '10px' }}>
                <p><b>Work for:</b> <i>{record.workFor}</i></p>
                <p><b>Tags:</b> <i>{record.tags.join(', ') + '.'}</i></p>
                <div style={{ display: 'flex', width: '150px', justifyContent: 'space-between' }}>
                    <Button type='primary' onClick={() => unSync(record.key)} disabled={!record.sync}>Un-Sync</Button>
                    <Button type='primary' onClick={() => editTask(record.key)}>Edit</Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={styles.content}>
                <div className={styles.left}>
                    <MenuComponent
                        setModalClearAllOpen={setModalClearAllOpen}
                        setModalDownloadOpen={setModalDownloadOpen}
                        setModalJiraSyncOpen={setModalJiraSyncOpen}
                        setModalTagsOpen={setModalTagsOpen}
                        setModalWorkTypeOpen={setModalWorkTypeOpen}
                        setModalInitOpen={setModalInitOpen}
                        setDashboardOpen={() => setDashboardOpen(!isDashboardOpen)}
                    />
                </div>
                <div className={styles.right}>
                    {isDashboardOpen ?
                        <DashboardPage />
                        :
                        <>
                            <div className={styles.header}>
                                <div className={styles.buttons}>
                                    <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => {
                                        setTask(null)
                                        setModalNewTaskOpen(true)
                                    }} />
                                    <Button type="danger" shape="circle" icon={<MinusOutlined />} onClick={() => removeTask()} disabled={!selectedTasks.length} />
                                </div>
                                <DatePagination selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                            </div>
                            <Table
                                dataSource={dataSource}
                                columns={columns}
                                rowSelection={rowSelection}
                                expandedRowRender={expandedRowRender}
                                style={{ width: '100%' }}
                                pagination={false}
                            />
                        </>
                    }
                </div>
            </div>

            <NewTaskModal key={`isModalNewTaskOpen_${isModalTagsOpen}_${isModalWorkTypeOpen}_${isModalNewTaskOpen}`} visible={isModalNewTaskOpen} setVisible={setModalNewTaskOpen} date={selectedDate} taskUuid={task} />
            <InitModal key={`isModalInitOpen_${isModalInitOpen}`} visible={isModalInitOpen} setVisible={setModalInitOpen} />
            <ClearAllModal visible={isModalClearAllOpen} setVisible={setModalClearAllOpen} />
            <DownloadModal visible={isModalDownloadOpen} setVisible={setModalDownloadOpen} />
            <JiraSyncModal visible={isModalJiraSyncOpen} setVisible={setModalJiraSyncOpen} />
            <TagsModal key={`isModalTagsOpen_${isModalTagsOpen}`} visible={isModalTagsOpen} setVisible={setModalTagsOpen} />
            <WorkTypeModal key={`isModalWorkTypeOpen_${isModalWorkTypeOpen}`} visible={isModalWorkTypeOpen} setVisible={setModalWorkTypeOpen} />
        </>
    )
}

export default HomePage