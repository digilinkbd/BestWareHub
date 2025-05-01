import { getDepartmentById } from "@/actions/departments"
import DepartmentForm from "@/components/Forms/DepartmentForm"

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  
  const department = await getDepartmentById(id)

  return (
    <div className="md:p-2">
      <DepartmentForm initialData={department} editingId={id} />
    </div>
  )
}