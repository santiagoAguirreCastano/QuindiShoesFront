export const TopsProductos = ({ color = '#E5F1F0' }) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className="text-black w-80 h-70 rounded-xl flex items-center flex-col shadow-xl"
    >
      <img src="../../public/image.png" alt="" />
      <h2>Nombre</h2>
      <h3>Info</h3>
      <h4>Cantidad</h4>
    </div>
  )
}
