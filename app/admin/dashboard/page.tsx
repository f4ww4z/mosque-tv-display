import Link from "next/link"

export const metadata = {
  title: "Admin | Mosque TV Display",
  description: "Admin dashboard for TV display for mosques",
}

const AdminDashboardPage = () => {
  return (
    <>
      <section className="flex flex-col w-full gap-4 relative text-center overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
        <span className="text-4xl font-bold">Admin Dashboard</span>

        <div className="flex flex-wrap justify-center gap-4 mx-2">
          <div className="flex flex-col w-full gap-3 p-4 md:max-w-xs drop-shadow-lg bg-primary/10 rounded-xl">
            <span className="text-xl font-bold">User Management</span>
            <Link
              className="p-3 rounded-lg bg-primary/40"
              href="/admin/users"
            >
              VIEW
            </Link>
          </div>
          <div className="flex flex-col w-full gap-3 p-4 md:max-w-xs drop-shadow-lg bg-primary/10 rounded-xl">
            <span className="text-xl font-bold">Payment Pending Approval</span>
            <Link
              className="p-3 rounded-lg bg-primary/40"
              href="/admin/users/approval"
            >
              VIEW
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default AdminDashboardPage
