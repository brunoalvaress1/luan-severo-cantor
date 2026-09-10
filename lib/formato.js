// Padroniza a exibição de horários no site e no painel admin.
// Aceita entradas soltas como "22", "22h", "22h30", "2230", "8:5" e devolve
// sempre no formato "HH:MM" (ex: "22:00"). Se o texto não parecer um horário,
// devolve como veio — assim nada quebra se alguém escrever algo diferente.
export function formatarHorario(valor) {
  if (valor == null) return ''
  const txt = String(valor).trim()
  if (!txt) return ''

  const dois = (n) => String(n).padStart(2, '0')

  // "22:00", "9:5", "22h30", "22 h 30", "22h"
  let m = txt.match(/^(\d{1,2})\s*[:hH]\s*(\d{1,2})?$/)
  if (m) {
    const h = Number(m[1])
    const min = m[2] ? Number(m[2]) : 0
    if (h <= 23 && min <= 59) return `${dois(h)}:${dois(min)}`
  }

  // só números: "22" -> 22:00, "930" -> 09:30, "2230" -> 22:30
  m = txt.match(/^(\d{1,4})$/)
  if (m) {
    const d = m[1]
    if (d.length <= 2) {
      const h = Number(d)
      if (h <= 23) return `${dois(h)}:00`
    } else {
      const h = Number(d.slice(0, d.length - 2))
      const min = Number(d.slice(-2))
      if (h <= 23 && min <= 59) return `${dois(h)}:${dois(min)}`
    }
  }

  return txt
}
