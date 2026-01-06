// src/components/Input.jsx
export default function Input({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  icon,
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-10" : "pl-4"
            } pr-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-brand-DEFAULT focus:border-transparent transition outline-none`}
        />
      </div>
    </div>
  );
}
