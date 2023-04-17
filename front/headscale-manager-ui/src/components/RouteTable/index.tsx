import { client } from "@/graphql";
import { Project, ProjectsDocument, Route, RoutesQueryResult, useDeleteRouteMutation, useRoutesQuery, useSaveRouteMutation } from "@/graphql/codegen";
import { ReloadOutlined } from "@ant-design/icons";
import { EditableProTable, ProColumns, ProFormSelect } from "@ant-design/pro-components";
import { Button, message } from "antd";
import React, { useState } from "react";

interface RouteTableProps {
    project?: string
}

const NEW_KEY = '-'

const RouteTable: React.FC<RouteTableProps> = (props) => {
    type RouteType = NonNullable<NonNullable<NonNullable<NonNullable<RoutesQueryResult>["data"]>["routes"]>[0]>

    const { loading, refetch } = useRoutesQuery({
        onError: (e) => {
            messageApi.error('查询失败:' + (e.message))
        },
        onCompleted(data) {
            setRoutes(data.routes as any)
        },
    });
    const [saveRoute, { loading: saving }] = useSaveRouteMutation()
    const [deleteRoute, { loading: deleting }] = useDeleteRouteMutation()
    const [routes, setRoutes] = useState<readonly RouteType[]>()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();

    const doRefresh = async () => {
        setRefreshing(true)
        try {
            return await refetch();
        } catch (e: any) {
            messageApi.error('刷新失败:' + (e?.message ?? e));
            setRoutes([])
        } finally {
            setRefreshing(false);
        }
    }

    const columns: ProColumns<Route>[] = [
        {
            title: "地址",
            dataIndex: "name",
            formItemProps: () => {
                return {
                    rules: [{ required: true, message: '此项为必填项' }],
                };
            },
        },
        {
            title: "所属项目",
            dataIndex: "projectID",
            render: (dom, route) => route.project?.name,
            renderFormItem(schema, config, form, action) {
                return <ProFormSelect
                    request={async (params, props) => {
                        let resp = await client.query<Record<string, Project[]>>({ query: ProjectsDocument })
                        console.log(resp)
                        if (resp.error) {
                            messageApi.error(resp.error.message)
                        }
                        return resp.data.projects.map(m => { return { label: m.name!!, value: m.id!! } })
                    }}
                />
            },
        },
        {
            title: "描述",
            dataIndex: "description",
            valueType: "textarea",
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

    return (<>
        {contextHolder}
        <EditableProTable<RouteType>
            rowKey="id"
            // scroll={{ y: 'calc(100vh - 290px)' }}
            scroll={{ y: 'calc(100vh - 250px)' }}
            loading={loading || saving || deleting || refreshing}
            value={routes}
            // pagination={{
            //     // pageSize:3,
            //     responsive: true,
            // }}
            search={false}
            columns={columns}
            toolbar={{
                title: '路由',
                actions: [
                    <Button
                        icon={<ReloadOutlined spin={refreshing} />}
                        onClick={async () => {
                            await doRefresh()
                        }} />,
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
                    await saveRoute({
                        variables: {
                            routeInput: {
                                id: data.id == NEW_KEY ? undefined : data.id,
                                name: data.name,
                                description: data.description,
                                projectID: data.projectID,
                            }
                        },
                        onError: (e) => {
                            messageApi.error('保存失败:' + (e.message))
                        }
                    })
                    await doRefresh()
                },
                onDelete: async (rowKey, row) => {
                    console.log("onDelete", rowKey, row)
                    await deleteRoute({
                        variables: {
                            routeID: row.id!!
                        },
                        onError: (e) => {
                            messageApi.error('删除失败:' + (e.message))
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
    </>)
}

export default RouteTable