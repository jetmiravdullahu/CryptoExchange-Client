import { useState } from 'react'
import { Plus } from 'lucide-react'

import { createFileRoute } from '@tanstack/react-router'

import type { UserFormData } from '@/types/user'
import { UsersTable } from '@/components/Dashboard/Users/UsersTable'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserFormDialog } from '@/components/Dashboard/Users/UserFormModal'
import { getUsersQuery, useGetUsers } from '@/hooks/api/User/useGetUsers'
import { PostErrorComponent } from '@/components/PostErrorComponent'
import { LoadingSpinner } from '@/components/LoadingComponent'

export const Route = createFileRoute('/_auth/dashboard/users')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getUsersQuery(),
    )
  },
  errorComponent: PostErrorComponent,
  pendingComponent: LoadingSpinner,
})

const initialUserData: UserFormData = {
  id: '',
  name: '',
  email: '',
  role: 'SELLER',
  password: '',
  password_confirmation: '',
  is_active: true,
}

function RouteComponent() {
  const [actionUser, setActionUser] = useState<UserFormData | null>(null)

  const {
    data,
    pagination,
    sorting,
    setPagination,
    setSorting,
  } = useGetUsers()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Users Management
        </h2>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage user accounts
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </div>
            <Button
              className="gap-2"
              onClick={() => setActionUser(initialUserData)}
            >
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border px-4">
            <UsersTable
              users={data.data}
              setActionUser={setActionUser}
              totalUsers={data.total}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
            />
          </div>
        </CardContent>
      </Card>
      {actionUser && (
        <UserFormDialog
          open={!!actionUser}
          onOpenChange={setActionUser}
          initialData={{
            ...actionUser,
            password: '',
            password_confirmation: '',
          }}
          isEdit={!!actionUser.id}
        />
      )}
    </div>
  )
}
