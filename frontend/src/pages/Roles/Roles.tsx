import React from 'react';
import './Roles.css';

import UserList from './components/UserList';
import RoleList from './components/RoleList';
import PermissionList from './components/PermissionsList';

function Roles() {
    //Dummy test users
    const allUsers = ['Hillary', 'Grant', 'Violet', 'Lauren', 'Luke', 'Sarah', 'Helen', 'Josh', 'Tyler'];
    const allRoles = ['Admin', 'User', 'Guest', 'TestRole1', 'TestRole2'];

    return (
        <div className="bg-[#bdc3e3] w-full md:pl-[90px] p-4 h-screen rounded-md md:grid md:grid-cols-3 md:gap-12 overflow-scroll">
            <div className="flex flex-col">
                <div className="h-[300px]">
                    <RoleList allRoles={allRoles} />
                </div>

                <div className="h-[300px]">
                    <UserList allUsers={allUsers} />
                </div>
            </div>

            <div className="bg-[#262b6c] col-span-2 p-2 rounded-md mt-10 md:mt-0 h-fit">
                <PermissionList />
            </div>
        </div>
    );
}

export default Roles;
