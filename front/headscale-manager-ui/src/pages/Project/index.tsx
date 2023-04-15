import { client } from "@/graphql";
import { Machine, MachinesDocument, Project, ProjectsQueryResult, useDeleteProjectMutation, useProjectsQuery, useSaveProjectMutation } from "@/graphql/codegen";
import { CloudSyncOutlined, ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import { EditableProTable, PageContainer, ProColumns, ProFormSelect } from "@ant-design/pro-components";
import { Button, Tag, Tooltip, message } from "antd";
import { useState } from "react";
import { useSyncProjectRouteMutation } from "@/graphql/codegen";
const ButtonGroup = Button.Group;

const columns: ProColumns<Project>[] = [
    {
        title: "名称",
        dataIndex: "name",
        formItemProps: () => {
            return {
                rules: [{ required: true, message: '此项为必填项' }],
            };
        },
    },
    {
        title: "编码",
        // width: 64,
        dataIndex: "code",
        valueType: "text",
        formItemProps: () => {
            return {
                rules: [{ required: true, message: '此项为必填项' }],
            };
        }
    },
    {
        title: "路由",
        dataIndex: "routes",
        render: (dom, project) => project?.routes?.map(r => <div><Tag>{r?.name}</Tag></div>),
        editable: false,
    },
    {
        title: "可用机器",
        dataIndex: "machineIDs",
        valueType: "select",
        render: (dom, project, index, action, schema) => project?.machines?.map(m => <div><Tag>{m?.name}</Tag></div>),
        renderFormItem(schema, config, form, action) {
            return <ProFormSelect
                mode="multiple"
                request={async (params, props) => {
                    let resp = await client.query<Record<string, Machine[]>>({ query: MachinesDocument })
                    console.log(resp)
                    if (resp.error) {
                        message.error(resp.error.message)
                    }
                    return resp.data.machines.map(m => { return { label: m.name!!, value: m.id!! } })
                }}
            />
        },
    },
    {
        title: "当前机器",
        dataIndex: "machineID",
        valueType: "select",
        renderText(text, record, index, action) {
            return record?.machine?.name
        },
        renderFormItem: (schema, config, form, action) => <ProFormSelect
            allowClear={true}
            options={config.record?.machines?.map(m => {
                return {
                    label: m?.name,
                    value: m?.id
                }
            })} />,
    },
    {
        title: "操作",
        width: 16 * 8,
        valueType: "option",
        render: (text, record, _, action) => [
            <a key="editable"
                onClick={() => {
                    action?.startEditable?.(record.id!!)
                }}>编辑</a>,

        ],
        renderFormItem: (schema, config, form, action) => [
            <a key="save"
                onClick={() => {

                    action?.saveEditable?.(config.recordKey!!)

                }}>保存</a>
        ],

    }
]

const NEW_KEY = '-'

const reactNode: React.FC = () => {
    type ProjectType = NonNullable<NonNullable<NonNullable<NonNullable<ProjectsQueryResult>["data"]>["projects"]>[0]>

    const { loading, refetch } = useProjectsQuery({
        onError: (e) => {
            messageApi.error('查询失败:' + (e.message))
        },
        onCompleted(data) {
            setProjects(data.projects as any)
        },
    });
    const [saveProject, { loading: saving }] = useSaveProjectMutation()
    const [deleteProject, { loading: deleting }] = useDeleteProjectMutation()
    const [syncProjectRoute, { loading: syncing }] = useSyncProjectRouteMutation()
    const [projects, setProjects] = useState<readonly ProjectType[]>()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();

    const doRefresh = async () => {
        if (refreshing) return
        setRefreshing(true)
        try {
            return await refetch();
        } catch (e: any) {
            message.error('刷新失败:' + (e?.message ?? e));
            setProjects([])
        } finally {
            setRefreshing(false);
        }
    }

    const doSyncProjectRoute = async (projectID?: string) => {
        if (syncing) return
        try {
            let result = await syncProjectRoute({
                variables: {
                    syncProjectID: projectID
                }
            })
            let results = result.data?.project?.syncProjectRoute ?? []
            message.success('同步成功')
            if (results.length == 0) {
                message.info('没有需要同步的路由')
            }
            if (projectID == undefined) {
                for (let r of results) {
                    message.info(`[${r?.project?.name}]${r.routeEnable ? '启用' : '禁用'}路由:${r?.machine?.name}-${r?.route?.name}`, 5)
                }
            }
        } catch (e: any) {
            message.error('同步失败:' + (e?.message ?? e));
        }
    }

    return (
        <PageContainer
            header={{
                title: "",
            }}>
            {contextHolder}
            <EditableProTable<ProjectType>
                rowKey="id"
                // scroll={{ y: 'calc(100vh - 290px)' }}
                scroll={{ y: 'calc(100vh - 250px)' }}
                loading={loading || saving || deleting || refreshing}
                value={projects}
                // pagination={{
                //     // pageSize:3,
                //     responsive: true,
                // }}
                search={false}
                columns={columns}
                toolbar={{
                    title: '项目',
                    actions: [
                        <ButtonGroup>
                            <Button
                                // icon={}
                                onClick={async () => {
                                    await doRefresh()
                                }} >
                                <ReloadOutlined spin={refreshing} />
                            </Button>
                            <Tooltip title="同步所有项目路由">
                                <Button
                                    // disabled={syncing}
                                    onClick={async () => {
                                        await doSyncProjectRoute()
                                    }} >
                                    {syncing ?
                                        <SyncOutlined spin /> :
                                        <CloudSyncOutlined />
                                    }
                                </Button>
                            </Tooltip>


                        </ButtonGroup>
                    ],
                }}
                recordCreatorProps={{
                    record: () => ({
                        id: NEW_KEY,
                    })
                }}
                editable={{
                    deletePopconfirmMessage: '确定删除吗？',
                    onSave: async (rowKey, data, row) => {
                        console.log("onSave", rowKey, data, row)
                        await saveProject({
                            variables: {
                                projectInput: {
                                    id: data.id == NEW_KEY ? undefined : data.id,
                                    code: data.code,
                                    name: data.name,
                                    machineID: data.machineID,
                                    machineIDs: data.machineIDs,
                                }
                            },
                            onError: (e) => {
                                message.error('保存失败:' + (e.message))
                            }
                        })
                        if (data.id != NEW_KEY) {
                            doSyncProjectRoute(data.id!!)
                        }
                        await doRefresh()
                    },
                    onDelete: async (rowKey, row) => {
                        console.log("onDelete", rowKey, row)
                        await deleteProject({
                            variables: {
                                projectID: row.id!!
                            },
                            onError: (e) => {
                                message.error('删除失败:' + (e.message))
                            }
                        })
                        await doRefresh()
                    },
                    actionRender: (row, config, defaultDom) => [
                        defaultDom.save,
                        defaultDom.cancel,
                        defaultDom.delete,
                    ]
                }} />

        </PageContainer>
    );
}

export default reactNode