interface HeaderProps {
    subTitle: string;
}

const Header = ({ subTitle }: HeaderProps) => (
    <div className="md:h-[8rem] shadow-md flex flex-col justify-center p-4 md:p-8 md:pl-[5rem] w-full">
        <h1 className="text-3xl font-bold text-custom-black-700">Detalles de tu Alquiler</h1>
        <p className="text-custom-gray-600 mt-2">{subTitle}</p>
    </div>
);

export default Header;
