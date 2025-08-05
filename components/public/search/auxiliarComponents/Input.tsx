interface InputProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
}

export default function Input({ label, type, placeholder, id }: InputProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label htmlFor={label} className="font-medium text-custom-black-900 text-lg pl-1">
                {label}
            </label>
            <input
                placeholder={placeholder}
                type={type}
                id={id}
                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-custom-golden-500 focus:border-custom-golden-500"
            />
        </div>
    );
}
