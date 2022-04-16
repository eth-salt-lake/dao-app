import TopNav from "../nav/TopNav";

type Props = {
    children: any
}

const Layout = ({children}: Props) => {
    return (
        <div>
            <TopNav />
            <main>
                {children}
            </main>
        </div>
    )
};

export default Layout;