import { PageContainer } from "@ant-design/pro-components";
import MachineTable from "@/components/MachineTable";

const reactNode: React.FC = () => {
    return (
        <PageContainer
            header={{
                title: "",
            }}>
            <MachineTable />

        </PageContainer>
    );
}

export default reactNode