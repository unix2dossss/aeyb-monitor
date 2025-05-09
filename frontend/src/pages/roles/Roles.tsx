import IonIcon from '@reacticons/ionicons';
import RoleDTO from '@shared/dtos/RoleDTO';
import UserDTO from '@shared/dtos/UserDTO';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserContext';
import TabManager from '../../utility_components/tabs';
import { ViewRolesWindow } from './components/ViewRolesWindow';
import { ViewUserWindow } from './components/ViewUserWindow';

import './Roles.css';

function Roles() {
    const navigate = useNavigate();

    // Navigation back to profile page
    const returntoProfile = () => {
        navigate('/profilepage/');
    };

    return (
        <div className=" md:pl-[90px] bg-white mx-2 h-screen flex flex-col max-h-screen min-h-0">
            <div className="my-2 flex flex-row">
                <span
                    onClick={returntoProfile}
                    className="flex flex-row items-center px-2 py-1 pr-3 cursor-pointer border-slate-300 border-solid border-[1px] rounded-md"
                >
                    <IonIcon name="chevron-back-outline" />
                    Back
                </span>
            </div>
            <TabManager
                orientation="row"
                content={[{ tabTitle: 'Roles' }, { tabTitle: 'Users' }]}
                contentLoader={(data) => {
                    if (data.tabTitle === 'Roles') {
                        return <ViewRolesWindow />;
                    } else if (data.tabTitle === 'Users') {
                        return <ViewUserWindow />;
                    }

                    return <></>;
                }}
            />
        </div>
    );
}

export default Roles;
