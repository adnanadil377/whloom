import { Outlet } from 'react-router-dom';
import CreatorSidebar from './CreatorSidebar';


const CreatorLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <CreatorSidebar />
            <div className="ml-64">
                {/* Main Content */}
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CreatorLayout;
