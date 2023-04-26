import IonIcon from '@reacticons/ionicons';
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Roles from '../../roles/Roles';
import Button from 'src/utility_components/Button';

const SettingsBar = () => {
    const navigate = useNavigate();
    const navToRoles = () => {
        navigate("/profilepage/roles");
    };

    return (
        <div className='flex flex-col w-3/4 md:w-3/5 mt-[5%] text-3xl text-[#262B6C]'>
            <Button className='border-solid border-t border-[#262B6C] text-left flex-row inline-flex px-4 py-10'>
                <p className='w-3/4 h-full'>Personal Stats</p>
                <div className='w-1/4 h-full text-right'><IonIcon name="chevron-forward-outline" /></div>
            </Button>
            <Button className='border-solid border-t border-[#262B6C] text-left flex-row inline-flex px-4 py-10'>
                <p className='w-3/4 h-full'>Meeting Stats</p>
                <div className='w-1/4 h-full text-right'><IonIcon name="chevron-forward-outline" /></div>
            </Button>
            <Button className='border-solid border-t border-[#262B6C] text-left flex-row inline-flex px-4 py-10' onClick={navToRoles}>
                <p className='w-3/4 h-full'>Roles</p>
                <div className='w-1/4 h-full text-right'><IonIcon name="chevron-forward-outline" /></div>
            </Button>

            <Routes>
                <Route path="/roles" element={<Roles />} />
            </Routes>
        </div>
    );
}

export default SettingsBar; 