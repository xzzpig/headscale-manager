import { PageContainer } from "@ant-design/pro-components";
import RouteTable from "@/components/RouteTable";

const reactNode: React.FC = () => {
    return (
        <PageContainer
            header={{
                title: "",
            }}>
            <RouteTable />

        </PageContainer>
    );
}

export default reactNode