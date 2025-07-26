"use client"

import { useState } from "react"
import {
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Bell,
  Search,
  Menu,
  X,
  Home,
  Settings,
  LogOut,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const stats = [
    {
      title: "Ingresos Totales",
      value: "$45,231.89",
      change: "+20.1%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Usuarios",
      value: "2,350",
      change: "+180.1%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Ventas",
      value: "12,234",
      change: "+19%",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: "Conversión",
      value: "3.2%",
      change: "+4.75%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentSales = [
    { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
    { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
    { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00" },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="mt-6">
          <div className="px-6 space-y-2">
            <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
              <Home className="h-5 w-5 mr-3" />
              Inicio
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <BarChart3 className="h-5 w-5 mr-3" />
              Analíticas
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Users className="h-5 w-5 mr-3" />
              Usuarios
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 mr-3" />
              Productos
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Settings className="h-5 w-5 mr-3" />
              Configuración
            </a>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <LogOut className="h-5 w-5 mr-3" />
              Cerrar Sesión
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Buscar..." className="pl-10 w-64" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Bienvenido de vuelta</h2>
            <p className="text-gray-600 mt-2">Aquí tienes un resumen de tu negocio hoy.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 mt-1">{stat.change} desde el mes pasado</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Recent Sales */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {/* Chart Area */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Gráfico de ventas</p>
                    <p className="text-sm text-gray-400">Los datos se mostrarían aquí</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sales */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Ventas Recientes</CardTitle>
                <CardDescription>Has realizado 265 ventas este mes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={`/placeholder.svg?height=36&width=36&text=${sale.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}`}
                        />
                        <AvatarFallback>
                          {sale.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.name}</p>
                        <p className="text-sm text-gray-500">{sale.email}</p>
                      </div>
                      <div className="ml-auto font-medium">{sale.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
