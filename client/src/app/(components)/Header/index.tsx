type HeaderProps = {
  name: string;
};

const Header = ({ name }: HeaderProps) => {
  return <h1 className="text-2xl font-medium text-gray-600">{name}</h1>;
};

export default Header;
