import React from 'react'

import { Menu } from 'antd'
import SubMenu from 'antd/lib/menu/SubMenu'
import { AppstoreOutlined, CloudSyncOutlined, SettingOutlined } from '@ant-design/icons'

const MenuComponent = ({
    setModalClearAllOpen,
    setModalDownloadOpen,
    setModalJiraSyncOpen,
    setModalTagsOpen,
    setModalWorkTypeOpen,
    setModalInitOpen,
}) => {

    return (
        <Menu
            theme={'dark'}
            style={{ width: 256 }}
            mode="inline"
            selectable={false}
        >
            <Menu.Item key="1">V-metrics</Menu.Item>
            <SubMenu key="sub1" icon={<CloudSyncOutlined />} title="Jira">
                <Menu.Item key="4" onClick={() => setModalJiraSyncOpen(true)}>Sync</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Report">
                <Menu.Item key="5" onClick={() => setModalDownloadOpen(true)}>Download</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" icon={<SettingOutlined />} title="Configurations">
                <Menu.Item key="8" onClick={() => setModalInitOpen(true)}>Edit user</Menu.Item>
                <Menu.Item key="9" onClick={() => setModalTagsOpen(true)}>Remove tags</Menu.Item>
                <Menu.Item key="10" onClick={() => setModalWorkTypeOpen(true)}>Remove work types</Menu.Item>
                <Menu.Item key="11" onClick={() => setModalClearAllOpen(true)}>Hard reset data</Menu.Item>
            </SubMenu>
        </Menu>
    )
}

export default MenuComponent