// src/components/AuthLayout.jsx
export default function AuthLayout({
  children,
  title,
  subtitle,
  linkText,
  onLinkClick,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">🍔</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">
            {subtitle}{" "}
            <button
              onClick={onLinkClick}
              className="font-semibold text-orange-600 hover:text-orange-700 transition"
            >
              {linkText}
            </button>
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
