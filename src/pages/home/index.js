import React, { useEffect, useState } from 'react'

import {
    Menu,
    Table,
} from 'antd'

import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'

import moment from 'moment'

import InitModal from '../../components/init-modal'
import NewTaskModal from '../../components/new-task-modal'

import LocalStorageService from '../../services/local-storage'
import DatePagination from '../../components/date-pagination'
import SubMenu from 'antd/lib/menu/SubMenu'

import styles from './home.module.scss'

const HomePage = () => {

    const [isModalInitOpen, setModalInitOpen] = useState(false)
    const [isModalNewTaskOpen, setModalNewTaskOpen] = useState(true)
    const [selectedDate, setSelectedDate] = useState(moment())

    useEffect(() => {
        setModalInitOpen(LocalStorageService.getUserInfos() === null ? true : false)
    }, [])

    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    return (
        <>
            <div className={styles.content}>
                <div className={styles.left}>
                    <Menu
                        theme={'dark'}
                        style={{ width: 256 }}
                        mode="inline"
                        selectable={false}
                    >
                        <Menu.Item key="1">Kairos</Menu.Item>
                        <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Report">
                            <Menu.Item key="5">Download</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" icon={<SettingOutlined />} title="Configurations">
                            <Menu.Item key="9">Edit tags</Menu.Item>
                            <Menu.Item key="10">Edit work types</Menu.Item>
                            <Menu.Item key="11" onClick={() => localStorage.removeItem('tasks')}>Hard reset data</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className={styles.right}>
                    <DatePagination selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        style={{ width: '100%' }}
                        pagination={false}
                    />
                </div>
            </div>
            <NewTaskModal visible={isModalNewTaskOpen} setVisible={setModalNewTaskOpen} />
            <InitModal visible={isModalInitOpen} setVisible={setModalInitOpen} />
        </>
    )
}

export default HomePage