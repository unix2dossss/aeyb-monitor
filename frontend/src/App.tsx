import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Roles from './pages/Roles/Roles';
import Homepage from './pages/Hompage/Homepage';
import UserProfile from './pages/Profiles_Page/UserProfile';
import CalendarPage from './pages/Calendar_Page/CalendarPage';
import Sidebar from './Sidebar_Components/Sidebar';
import ActiveMeeting from './pages/Active_Meeting/ActiveMeeting';
import AfterMeeting from './pages/Active_Meeting/AfterMeeting';

function App() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // toggles the sidebar being open and closed
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <div className="App">
            <Router>
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="profilepage/roles" element={<Roles />} />
                    <Route path="homepage" element={<Homepage />} />
                    <Route path="calendarpage" element={<CalendarPage />} />
                    <Route path="profilepage/*" element={<UserProfile />} />
                    <Route path="activemeetingpage" element={<ActiveMeeting />} />
                    <Route path="aftermeetingpage" element={<AfterMeeting />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
