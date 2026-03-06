import { NextResponse } from "next/server"
import { getPromediosPorDiaSemana } from "@/lib/queries/estadisticas"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mes = searchParams.get("mes") ?? undefined

    const userId = session.user.id
    const promedios = await getPromediosPorDiaSemana(userId, mes)
    return NextResponse.json(promedios)
  } catch (error) {
    console.error("Error al obtener promedios:", error)
    return NextResponse.json(
      { error: "Error al obtener promedios" },
      { status: 500 }
    )
  }
}
