interface ButtonProps {
    title: string;
    type: "primary" | "secondary";
}

export default function Button({ title, type }: ButtonProps) {
    const styles = {
        primary: "bg-custom-golden-500 text-custom-white-100",
        secondary: "bg-custom-white-100 text-custom-black-900 border border-custom-gray-300",
    };

    return <button className={`px-4 py-2 rounded-md ${styles[type]}`}>{title}</button>;
}
