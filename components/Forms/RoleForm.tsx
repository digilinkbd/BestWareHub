"use client";

import { Card, CardContent } from "@/components/ui/card";
import FormHeader from "./FormHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RoleFormData } from "@/types/types";
import toast from "react-hot-toast";
import { Role } from "@prisma/client";
import { permissions } from "@/config/permissions";
import FormFooter from "./FormFooter";
import TextInput from "../FormInputs/TextInput";
import { CustomCheckbox } from "../FormInputs/CustomCheckbox";
import { createRole, updateRole } from "@/actions/roles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type RoleFormProps = {
  editingId?: string;
  initialData?: Role | null;
};

export default function RoleForm({ editingId, initialData }: RoleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RoleFormData>({
    defaultValues: {
      displayName: initialData?.displayName || "",
      description: initialData?.description || "",
      permissions: initialData?.permissions || [],
    },
  });

  async function saveRole(data: RoleFormData) {
    try {
      setLoading(true);
      const result = editingId
        ? await updateRole(editingId, data)
        : await createRole(data);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(
        editingId ? "Role updated successfully!" : "Role created successfully!"
      );
      router.push("/dashboard/users/roles");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Group modules by category for better organization
  const moduleCategories = {
    users: ["users", "roles"],
    content: ["blogs", "categories", "products"],
    commerce: ["orders", "customers", "sales"],
    system: ["dashboard", "settings", "reports", "seller"],
  };

  // Check if all permissions in a module are selected
  const isModuleFullySelected = (moduleName: string) => {
    const currentPermissions = new Set(watch("permissions") || []);
    const modulePermissions = permissions.find(
      (p) => p.name === moduleName
    )?.permissions;
    
    if (!modulePermissions) return false;
    
    return Object.values(modulePermissions).every((permission) => 
      currentPermissions.has(permission)
    );
  };

  // Check if any permission in a module is selected
  const isModulePartiallySelected = (moduleName: string) => {
    const currentPermissions = new Set(watch("permissions") || []);
    const modulePermissions = permissions.find(
      (p) => p.name === moduleName
    )?.permissions;
    
    if (!modulePermissions) return false;
    
    return Object.values(modulePermissions).some((permission) => 
      currentPermissions.has(permission)
    ) && !isModuleFullySelected(moduleName);
  };

  const handleModulePermissionChange = (
    moduleName: string,
    checked: boolean
  ) => {
    const currentPermissions = new Set(watch("permissions") || []);
    const modulePermissions = permissions.find(
      (p) => p.name === moduleName
    )?.permissions;
    
    if (!modulePermissions) return;
    
    Object.values(modulePermissions).forEach((permission) => {
      if (checked) {
        currentPermissions.add(permission);
      } else {
        currentPermissions.delete(permission);
      }
    });

    setValue("permissions", Array.from(currentPermissions));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    const currentPermissions = new Set(watch("permissions") || []);
    
    if (checked) {
      currentPermissions.add(permission);
    } else {
      currentPermissions.delete(permission);
    }
    
    setValue("permissions", Array.from(currentPermissions));
  };

  return (
    <form onSubmit={handleSubmit(saveRole)} className="h-full">
      <FormHeader
        href="/dashboard/users/roles"
        title="Role"
        parent="users"
        editingId={editingId}
        loading={loading}
      />

      <div className="max-w-4xl mx-auto space-y-6 py-8">
        {/* Basic Role Information */}
        <Card>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3 pt-4 grid-cols-1 md:grid-cols-2">
                <TextInput
                  register={register}
                  errors={errors}
                  label="Role Name"
                  name="displayName"
                  // rules={{ required: "Role name is required" }}
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Role Description"
                  name="description"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Section with Tabs */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-medium mt-6 mb-6">
              Role Permissions
            </h2>

            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="users">Users & Roles</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="commerce">Commerce</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>

 {Object.entries(moduleCategories).map(([category, moduleNames]) => (
  <TabsContent key={`${category}-${moduleNames.join(",")}`} value={category} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {permissions
        .filter((module) => moduleNames.includes(module.name))
        .map((module) => (
          <div
            key={module.name}
            className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b">
                <span className="text-base font-medium">
                  {module.display}
                </span>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`module-${module.name}`}
                    checked={isModuleFullySelected(module.name)}
                    data-state={isModulePartiallySelected(module.name) ? "indeterminate" : undefined}
                    className={isModulePartiallySelected(module.name) ? "data-[state=indeterminate]:bg-gray-400" : ""}
                    onCheckedChange={(checked) =>
                      handleModulePermissionChange(module.name, checked)
                    }
                  />
                  <Label htmlFor={`module-${module.name}`}>All</Label>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {Object.entries(module.permissions).map(
                  ([action, permission]) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <CustomCheckbox
                        id={permission}
                        checked={watch("permissions")?.includes(permission)}
                        onChange={(e) =>
                          handlePermissionChange(permission, e.target.checked)
                        }
                        label={action.charAt(0).toUpperCase() + action.slice(1)}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  </TabsContent>
))}

            </Tabs>
          </CardContent>
        </Card>
      </div>

      <FormFooter
        href="/dashboard/users/roles"
        editingId={editingId}
        loading={loading}
        title="Role"
        parent="users"
      />
    </form>
  );
}