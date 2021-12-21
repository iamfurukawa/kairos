import React from 'react'

import {
    Button,
    Modal,
    Form,
    Input,
} from 'antd'

import LocalStorageService from '../../services/local-storage'

const InitModal = ({ visible = false, setVisible = () => { } }) => {
    const user = LocalStorageService.getUserInfos() || {}

    const [formInit] = Form.useForm()

    const modalInitHandleOk = () => {
        formInit.validateFields()
            .then(user => {
                formInit.resetFields()
                LocalStorageService.saveUserInfos(user)
                setVisible(false)
            })
            .catch(info => {
                console.log('Validate User Failed:', info)
            })
    }

    const handleCancel = () => {
        if (!disable())
            setVisible(false)
    }

    const disable = () => {
        const user = LocalStorageService.getUserInfos()
        return !user
    }

    return (
        <Modal
            visible={visible}
            title="Welcome to Kairos!"
            onOk={modalInitHandleOk}
            closable={false}
            footer={[
                <Button key="cancel" onClick={handleCancel} disabled={disable()}>
                    Cancel
                </Button>,
                <Button form={formInit} key="submit" type="primary" onClick={modalInitHandleOk}>
                    Sign in
                </Button>,
            ]}
        >
            <Form
                form={formInit}
                layout={'vertical'}
            >
                <Form.Item
                    label="Your name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                    initialValue={user?.['name'] || ''}
                >
                    <Input placeholder='Arnold Schwarzenegger' defaultValue={user?.['name'] || ''} />
                </Form.Item>

                <Form.Item
                    label="Jira URL"
                    name="jira-url"
                    initialValue={user?.['jira-url'] || ''}
                >
                    <Input placeholder='E.g. somename.atlassian.net' value={user?.['jira-url'] || ''} defaultValue={user?.['jira-url'] || ''} />
                </Form.Item>

                <Form.Item
                    label="Jira API Key"
                    name="jira-api-key"
                    tooltip="Get token here: https://id.atlassian.com/manage-profile/security/api-tokens"
                    initialValue={user?.['jira-api-key'] || ''}
                >
                    <Input placeholder='E.g. 7oFV91HU9HFYI1ossryhA5A8' value={user?.['jira-api-key'] || ''} defaultValue={user?.['jira-api-key'] || ''} />
                </Form.Item>

                <Form.Item
                    label="Email (used on jira)"
                    name="jira-email"
                    initialValue={user?.['jira-email'] || ''}
                >
                    <Input placeholder='E.g. email@email.com' value={user?.['jira-email'] || ''} defaultValue={user?.['jira-email'] || ''} />
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default InitModal