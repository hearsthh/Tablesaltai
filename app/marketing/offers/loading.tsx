export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading offers...</p>
      </div>
    </div>
  )
}
