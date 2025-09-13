"use client"
import { usePathname } from "next/navigation"
import { UserIcon } from "@heroicons/react/24/outline"

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/clients": "Client Master",
  "/projects": "Project Master",
  "/billing": "Billing Revenue",
  "/budget": "Budget Planning",
  "/employees": "Employee Master",
  "/utilization": "Employee Utilization",
  "/reports": "Reports",
}

export default function Topbar() {
  const pathname = usePathname()
  const currentPage = breadcrumbMap[pathname] || "Dashboard"

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <div className="text-gray-400">
                  <span className="text-sm font-medium">Home</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-sm font-medium text-gray-900">{currentPage}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">Welcome, Admin User</span>
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
