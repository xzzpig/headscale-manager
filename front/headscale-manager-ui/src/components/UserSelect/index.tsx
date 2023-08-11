import { useHusersLazyQuery } from "@/graphql/codegen";
import { Select } from "antd";
import React from "react";

const UserSelect: React.FC<{
    userName: string,
    onChange?: (value: string) => Promise<void>
}> = (params) => {
    const [queryUsers, { data: users, loading }] = useHusersLazyQuery({})

    const [changing, setChanging] = React.useState(false)

    return <Select
        value={params.userName}
        bordered={false}
        options={users?.headscale?.users.map(u => ({ label: u.name, value: u.name }))}
        onDropdownVisibleChange={(open) => { if (open) queryUsers() }}
        loading={loading || changing}
        onSelect={async (value) => {
            if (value === params.userName) return
            setChanging(true)
            await params.onChange?.(value)
            setChanging(false)
        }}
    />
}

export { UserSelect };
