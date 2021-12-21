import React from 'react'

import { Modal, notification } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

const ClearAllModal = ({ visible = false, setVisible = () => { } }) => {
    return (
        <Modal
            title="Clear All Data !!!"
            visible={visible}
            onOk={() => {
                localStorage.removeItem('tasks')
                setVisible(false)
                notification.open({
                    message: 'Status',
                    description: 'All data cleared!',
                    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                })
            }}
            onCancel={() => setVisible(false)}
        >
            <h1>Be careful !!!</h1>
            <p>If you wanna clear <b>ALL DATA</b> click on <b>"OK"</b> button.</p>
        </Modal>
    )
}

export default ClearAllModal