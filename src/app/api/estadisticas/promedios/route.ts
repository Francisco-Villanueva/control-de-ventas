import { NextResponse } from "next/server"
import { getPromediosPorDiaSemana } from "@/lib/queries/estadisticas"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const promedios = await getPromediosPorDiaSemana(userId)
    return NextResponse.json(promedios)
  } catch (error) {
    console.error("Error al obtener promedios:", error)
    return NextResponse.json(
      { error: "Error al obtener promedios" },
      { status: 500 }
    )
  }
}
