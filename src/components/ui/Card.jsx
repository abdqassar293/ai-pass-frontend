export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl bg-white shadow-sm ring-1 ring-gray-200 ${className}`}>
      {children}
    </div>
  )
}
