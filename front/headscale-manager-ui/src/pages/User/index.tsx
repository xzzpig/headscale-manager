import UserTable from "@/components/UserTable";
import { PageContainer } from "@ant-design/pro-components";

const reactNode: React.FC = () => {
    return (
        <PageContainer
            header={{
                title: "",
            }}>
            <UserTable />

        </PageContainer>
    );
}

export default reactNode