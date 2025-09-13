"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline"

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Client Master", href: "/clients", icon: UsersIcon },
  { name: "Project Master", href: "/projects", icon: FolderIcon },
  { name: "Billing Revenue", href: "/billing", icon: CurrencyDollarIcon },
  { name: "Budget Planning", href: "/budget", icon: ChartBarIcon },
  { name: "Employee Master", href: "/employees", icon: UserGroupIcon },
  { name: "Employee Utilization", href: "/utilization", icon: ClockIcon },
  { name: "Reports", href: "/reports", icon: DocumentTextIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">BillTrack</h1>
      </div>
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-2xl mb-1 transition-colors ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"}`}
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
