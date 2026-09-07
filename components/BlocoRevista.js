export default function BlocoRevista({ titulo, texto, imagem, numero, inverter = false }) {
  if (!titulo && !texto) return null

  return (
    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className={inverter ? 'md:order-2' : ''}>
        <span className="font-display text-6xl text-brand-100 block">{numero}</span>
        <h2 className="font-display text-3xl md:text-4xl mt-2 mb-5">{titulo}</h2>
        <p className="text-lg leading-relaxed text-muted whitespace-pre-line">{texto}</p>
      </div>
      <div className={`group relative rounded-3xl overflow-hidden bg-ink aspect-[4/3] shadow-card ${inverter ? 'md:order-1' : ''}`}>
        {imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagem}
            alt={titulo}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ink via-ink to-brand-700/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}
