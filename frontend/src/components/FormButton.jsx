// src/components/FormButton.jsx
export default function FormButton({ text, loading = false, type = "submit" }) {
  return (
    <button
      type={type}
      disabled={loading}
      className="w-full bg-gradient-to-r from-primary-600 to-brand text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-brand-dark transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : (
        text
      )}
    </button>
  );
}
