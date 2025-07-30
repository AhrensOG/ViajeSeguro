interface HeaderProps {
    subTitle: string;
}

const Header = ({ subTitle }: HeaderProps) => (
    <div className="h-[8rem] shadow-md flex flex-col justify-center p-8 pl-[5rem] w-full">
        <h1 className="text-3xl font-bold text-custom-black-700">Detalles de tu Alquiler</h1>
        <p className="text-custom-gray-600 mt-2">{subTitle}</p>
    </div>
);

export default Header;
