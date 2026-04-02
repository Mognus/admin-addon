import { fetchModelSchema, fetchModelData } from "../lib/api-server";
import { AdminModelView } from "../components/AdminModelView";

interface Props {
    model: string;
}

export default async function AdminModelPage({ model }: Props) {
    const [initialSchema, initialData] = await Promise.all([
        fetchModelSchema(model),
        fetchModelData(model, { page: 1, limit: 20 }),
    ]);
    return <AdminModelView model={model} initialSchema={initialSchema} initialData={initialData} />;
}
