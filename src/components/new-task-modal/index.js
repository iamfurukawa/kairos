import React, { useState } from 'react'

import {
    Button,
    Modal,
    Form,
    Input,
    TimePicker,
    Select,
    Divider,
    Row,
    Col,
    AutoComplete
} from 'antd'

import { PlusOutlined } from '@ant-design/icons'

import moment from 'moment'

import LocalStorageService from '../../services/local-storage'
import TaskManagerService from '../../services/task-manager'

const NewTaskModal = ({ visible = false, setVisible = () => { }, date, taskUuid }) => {

    const tagsLabel = [
        'Backend',
        'Frontend',

        'Investigação',
        'Levantamento de requisito',
        'Auxilio de chamados',
        'Resposta de chamado',

        'Desenvolvimento',
        'Teste',
        'Teste unitário',
        'Teste de integração',
        'Estudo',
        'Meta técnica',

        'Reunião',
        'Fornecedores',

        'Implantação',
        'Auxiliar no regressivo',

        'Rito',
        'Daily',
        'Refinement',
        'Planning',
        'Review',
        'Retrospective',

        'Fora de escopo',
        'Não especificado',

        'Platform Loan',
        'Api Proposta',
        'Digio Grana',
        'Pós Vendas',
        'Personal Loan Core',
        'Api Consulta Service Legado',
        'Api Cobranca',
        'Api Campanha',
        'Portal de atendimento',
        'Portal de customização'
    ]

    const [tags, setTags] = useState(LocalStorageService.getTags() || tagsLabel)
    const [newTag, setNewTag] = useState('')

    const [task, setTask] = useState(TaskManagerService.getTaskBy(taskUuid, date))

    const [workType, setWorkType] = useState(LocalStorageService.getWorkType() || ['Opus', 'Digio'])
    const [newWorkType, setNewWorkType] = useState('')

    const [formNewTask] = Form.useForm()

    const { Option } = Select

    const modalNewTaskHandleOk = () => {
        formNewTask.validateFields()
            .then(taskForm => {
                TaskManagerService.createOrUpdate(taskForm, date, taskUuid)
                formNewTask.resetFields()
                cancel()
            })
            .catch(info => {
                console.log('Validate Task Failed:', info)
            })
    }

    const cancel = () => {
        setTask(null)
        setVisible(false)
    }

    const onNewWorkChange = event => setNewWorkType(event.target.value)

    const addNewWorkItem = () => {
        if (newWorkType === '') return

        setWorkType([...workType, newWorkType])
        LocalStorageService.saveWorkType([...workType, newWorkType])
        setNewWorkType('')
    }

    const onNewTag = event => setNewTag(event.target.value)

    const addNewTag = () => {
        if (newTag === '') return

        setTags([...tags, newTag])
        LocalStorageService.saveTags([...tags, newTag])
        setNewTag('')
    }

    return (
        <Modal
            visible={visible}
            title="New Task"
            onOk={modalNewTaskHandleOk}
            onCancel={cancel}
            footer={[
                <Button form={formNewTask} key="submit" type="primary" onClick={modalNewTaskHandleOk}>
                    Create
                </Button>,
            ]}
        >
            <Form
                form={formNewTask}
                layout={'vertical'}
            >
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input a description!' }]}
                    initialValue={task?.description || ''}
                >
                    <AutoComplete
                        options={TaskManagerService.getDescriptions(date)}
                        defaultValue={task?.description || ''}
                        placeholder='Create a new bug in production'
                    />
                </Form.Item>

                <Row>
                    <Col>
                        <Form.Item
                            label="Start Time"
                            name="start-time"
                            initialValue={(task && task.startTime && moment(task.startTime, 'HH:mm:ss')) || moment()}
                            value={(task && task.startTime && moment(task.startTime, 'HH:mm:ss')) || moment()}
                            rules={[{ type: 'object', required: true, message: 'Please select a time!' }]}
                        >
                            <TimePicker defaultValue={moment(task?.startTime || '00:00:00', 'HH:mm:ss')} format={'HH:mm:ss'} />
                        </Form.Item>
                    </Col>
                    <Col offset={1}>
                        <Form.Item
                            label="End Time"
                            name="end-time"
                            initialValue={(task && task.endTime && moment(task.endTime, 'HH:mm:ss')) || null}
                            value={(task&& task.endTime && moment(task.endTime, 'HH:mm:ss')) || null}
                        >
                            <TimePicker defaultValue={moment(task?.endTime || '00:00:00', 'HH:mm:ss')} format={'HH:mm:ss'} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Item
                            label="Jira Item"
                            name="jira-item"
                            initialValue={task?.jiraItem || ''}
                        >
                            <AutoComplete
                                options={TaskManagerService.getJiraItems(date)}
                                defaultValue={task?.jiraItem || ''}
                            >
                                <Input placeholder='E.g. COREP-1234' />
                            </AutoComplete>
                        </Form.Item>
                    </Col>

                    <Col offset={1}>
                        <Form.Item
                            label="Work for"
                            name="work-for"
                            initialValue={task?.workFor || []}
                            rules={[{ required: true, message: 'Please select one type!' }]}
                        >
                            <Select
                                style={{ width: 240 }}
                                placeholder="Select one"
                                defaultValue={task?.workFor || []}
                                dropdownRender={menu => (
                                    <div>
                                        {menu}
                                        <Divider style={{ margin: '4px 0' }} />
                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                            <Input style={{ flex: 'auto' }} value={newWorkType} onChange={onNewWorkChange} />
                                            <a
                                                style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                onClick={addNewWorkItem}
                                            >
                                                <PlusOutlined /> Add item
                                            </a>
                                        </div>
                                    </div>
                                )}
                            >
                                {workType.map(item => (
                                    <Option key={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="Tags"
                    name="tags"
                    label="tags"
                    initialValue={task?.tags || []}
                    rules={[{ required: true, message: 'Please select some tags!', type: 'array' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Please select some tags"
                        defaultValue={task?.tags || []}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                <Divider style={{ margin: '4px 0' }} />
                                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                    <Input style={{ flex: 'auto' }} value={newTag} onChange={onNewTag} />
                                    <a
                                        style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                        onClick={addNewTag}
                                    >
                                        <PlusOutlined /> Add item
                                    </a>
                                </div>
                            </div>
                        )}>
                        {tags.map(item => (
                            <Option key={item}>{item}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default NewTaskModal