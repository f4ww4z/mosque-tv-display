import AdminCarouselSection from "components/AdminCarouselSection"

export const metadata = {
  title: "Admin | Mosque TV Display",
  description: "Admin dashboard for TV display for mosques",
}

const AdminDashboardPage = () => {
  return (
    <div className="flex flex-col w-full">
      <section
        id="carousel"
        className="flex flex-col px-8 py-8 bg-gray-950"
      >
        <AdminCarouselSection />
      </section>
    </div>
  )
}

export default AdminDashboardPage
