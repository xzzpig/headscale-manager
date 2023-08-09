import { HusersQuery, useCreateUserMutation, useDeleteUserMutation, useHusersQuery, useRenameUserMutation } from "@/graphql/codegen";
import { ReloadOutlined } from "@ant-design/icons";
import { EditableProTable, ProColumns } from "@ant-design/pro-components";
import { Button, message } from "antd";
import moment from "moment";
import React, { useState } from "react";
const ButtonGroup = Button.Group;

type UserType = NonNullable<NonNullable<NonNullable<NonNullable<HusersQuery>["headscale"]>["users"]>[0]>


const columns: ProColumns<UserType>[] = [
    {
        title: "ID",
        dataIndex: "id",
        editable: false,
        width: 8 * 8,
    },
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
        title: "创建日期",
        dataIndex: "createdAt",
        editable: false,
        width: 32 * 8,
        render(_, entity) {
            if (!entity.createdAt) return ""
            const createdAt = new Date(parseInt((entity.createdAt?.seconds + "" + entity.createdAt?.nanos).substring(0, 13)))
            return moment(createdAt).locale("zh_CN").format()
        },
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

const UserTable: React.FC = (props) => {

    const { loading, refetch } = useHusersQuery({
        onError: (e) => {
            messageApi.error('查询失败:' + (e.message))
        },
        onCompleted(data) {
            setUsers(data.headscale?.users)
        },
    });
    const [createUser, { loading: creating }] = useCreateUserMutation()
    const [deleteUser, { loading: deleting }] = useDeleteUserMutation()
    const [renameUser, { loading: renaming }] = useRenameUserMutation()
    const [users, setUsers] = useState<readonly UserType[]>()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();

    const doRefresh = async () => {
        setRefreshing(true)
        try {
            return await refetch();
        } catch (e: any) {
            messageApi.error('刷新失败:' + (e?.message ?? e));
            setUsers([])
        } finally {
            setRefreshing(false);
        }
    }

    return (<>
        {contextHolder}
        <EditableProTable<UserType>
            rowKey="id"
            // scroll={{ y: 'calc(100vh - 290px)' }}
            scroll={{ y: 'calc(100vh - 250px)' }}
            loading={loading || creating || deleting || renaming || refreshing}
            value={users}
            // pagination={{
            //     // pageSize:3,
            //     responsive: true,
            // }}
            search={false}
            columns={columns}
            toolbar={{
                title: '用户',
                actions: [
                    <ButtonGroup>
                        <Button
                            onClick={async () => {
                                await doRefresh()
                            }} >
                            <ReloadOutlined spin={refreshing} />
                        </Button>
                    </ButtonGroup>
                ],
            }}
            recordCreatorProps={{
                record: () => ({
                    id: NEW_KEY,
                    name: '',
                    oldName: '',
                    createdAt: null
                })
            }}
            editable={{
                deletePopconfirmMessage: '确定删除吗？',
                onSave: async (rowKey, data, row) => {
                    console.log("onSave", rowKey, data, row)
                    if (rowKey == NEW_KEY) {
                        await createUser({
                            variables: {
                                userName: data.name,
                            },
                            onError: (e) => {
                                messageApi.error('保存失败:' + (e.message))
                            }
                        })
                    } else {
                        await renameUser({
                            variables: {
                                userName: data.oldName,
                                newName: data.name,
                            },
                            onError: (e) => {
                                messageApi.error('保存失败:' + (e.message))
                            }
                        })
                    }
                    await doRefresh()
                },
                onDelete: async (rowKey, row) => {
                    console.log("onDelete", rowKey, row)
                    await deleteUser({
                        variables: {
                            userName: row.name
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

export default UserTable