import IonIcon from '@reacticons/ionicons';
import React, { useEffect, useState } from 'react';
import './Roles.css';

import UserList from './components/UserList';
import RoleList from './components/RoleList';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserContext';
import RoleDTO from '@shared/dtos/RoleDTO';
import UserDTO from '@shared/dtos/UserDTO';
import LoadingSpinner from '../../utility_components/LoadingSpinner';
import { Permission } from '@shared/utils/Permission';
import PermissionsList from './components/PermissionsList';
import Button from 'src/utility_components/Button';

const PermissionsLists: { roles: Permission[]; users: Permission[]; meetings: Permission[] } = {
    roles: ['VIEW_ROLES', 'MANAGE_ROLES'],
    users: ['VIEW_USERS', 'MANAGE_USERS'],
    meetings: ['VIEW_MEETINGS', 'MANAGE_MEETINGS'],
};

function Roles() {
    const userContext = useUserContext();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState<Record<string, RoleDTO>>({});
    const [users, setUsers] = useState<Record<string, UserDTO>>({});
    const [activeRole, setActiveRole] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading) return;

        const fetchRoles = async () => {
            const data = await userContext.fetcher('GET /api/roles');
            if (data) {
                const roles: Record<string, RoleDTO> = {};
                data.roles.forEach((role) => (roles[role.id] = role));
                setRoles(roles);
            }
        };

        const fetchUsers = async () => {
            const data = await userContext.fetcher('GET /api/users');
            if (data) {
                const users: Record<string, UserDTO> = {};
                data.users.forEach((user) => (users[user.id] = user));
                setUsers(users);
            }
        };

        setIsLoading(true);
        Promise.all([fetchRoles(), fetchUsers()]).finally(() => setIsLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Navigation back to profile page
    const returntoProfile = () => {
        navigate('/profilepage/');
    };

    const handleAddRole = async (roleName: string) => {
        const data = await userContext.fetcher('POST /api/roles', {
            name: roleName,
            color: '#262b6c',
            permissions: [],
        });
        if (data) {
            setRoles({ ...roles, [data.role.id]: data.role });
        }
    };

    const handleSetPermissions = (newPermissions: Permission[]) => {
        const updatedRole: RoleDTO = { ...roles[activeRole], permissions: newPermissions };
        setRoles({ ...roles, [updatedRole.id]: updatedRole });
    };

    const handleSaveRole = async () => {
        await userContext.fetcher(
            'PATCH /api/roles/:roleId',
            {
                permissions: roles[activeRole].permissions,
            },
            { roleId: roles[activeRole].id },
        );
    };

    return (
        <div className=" md:pl-[90px] bg-white md:ml-4 h-screen flex flex-col max-h-screen min-h-0">
            <div className="my-2 flex flex-row">
                <Button size="medium" color="#262a6c" onClick={returntoProfile}>
                    <IonIcon name="chevron-back-outline" /> Back{' '}
                </Button>
            </div>
            {/* <div className=" w-full p-4 rounded-md md:grid md:grid-cols-3 md:gap-12 overflow-scroll h-full">
                <div className="flex flex-col">
                    <div className="h-[40%]">
                        <RoleList
                            roles={Object.values(roles)}
                            handleChangeActiveRole={setActiveRole}
                            handleAddRole={handleAddRole}
                        />
                    </div>
                    <div className="h-[40%]">
                        <UserList users={users} />
                    </div>
                </div>

                <div className="col-span-2 p-2 rounded-md mt-10 md:mt-0 h-fit">
                    {activeRole ? (
                        <>
                            <PermissionsList
                                activeRole={roles[activeRole].name}
                                permissions={roles[activeRole].permissions}
                                setPermissions={handleSetPermissions}
                            />
                            {userContext.hasPermission('MANAGE_ROLES') && (
                                <Button
                                    size="medium"
                                    color="#262a6c"
                                    extraStyles="ml-[100%] translate-x-[-100%] mt-5"
                                    onClick={handleSaveRole}
                                >
                                    Save
                                </Button>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="text-center text-[#262b6c] text-3xl">Select a role to view permissions</div>
                            {isLoading && (
                                <div className="flex items-center gap-2 justify-center text-[#bdc3e3]">
                                    <LoadingSpinner />
                                    <p className="text-2xl font-semibold">Loading...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div> */}
            <TabManager
                orientation='row'
                content={[
                    { tabTitle: 'Wowzers', tabData: ['role1', 'role2'] },
                    { tabTitle: 'Roles' },
                    { tabTitle: 'Users', tabData: ['user1', 'user2'] },
                ]}
                loader={(data) => {
                    if (data.tabTitle === 'Wowzers') {
                        data.tabData // readonly ['role1', 'role2']
                        // return data.tabData.map((val, index) => {
                        //     data.tabData // readonly ['user1', 'user2']
                        //     return <div key={index}>{val}</div>;
                        // });
                        return (
                            <TabManager 
                                orientation='column'
                                content={[
                                    { tabTitle: 'Thexboss', tabData: ['Awesome', '🥚'] },
                                    { tabTitle: 'Timothy', tabData: ['HELLO 😁'] },
                                    { tabTitle: 'Hello World!', tabData: ['HELLO 😁', '😀😀😀😀😀'] },
                                ]}
                                loader={(data) => {
                                    return data.tabData.map((val, index) => {
                                        return <div key={index}>{val}</div>
                                    })
                                }}
                            />
                        );
                    } else if (data.tabTitle === 'Roles') {
                        data.tabData
                        return <ViewRolesWindow roles={roles}  />
                    } else if (data.tabTitle === 'Users') {
                        data.tabData // readonly ['user1', 'user2']
                        return <ViewUserWindow users={users} setUsers={setUsers} />
                    }

                    return <></>;
                }}
            />
        </div>
    );
}

export default Roles;

function TabManager<const K, const T extends { tabTitle: string; tabData?: K }>({
    content,
    loader,
    orientation = 'column',
}: {
    orientation?: 'column' | 'row';
    content: T[];
    loader: (data: T) => JSX.Element | JSX.Element[];
}) {
    const [activeTab, setActiveTab] = useState<number>(0);

    return (
        <div className={`w-full h-full min-h-0 min-w-0 flex break-all ${orientation === 'row' ? 'flex-col' : 'flex-row'}`}>
            <div className={`flex border-[rgba(0, 0, 0, 0.01)] overflow-scroll ${orientation === 'row' ? 'flex-row border-b-2' : 'flex-col border-r-2 w-[300px] over'}`}>
                {content.map((tab, index) => {
                    return (
                        <span
                            key={Math.random()}
                            onClick={() => {
                                setActiveTab(index);
                            }}

                            className={
                                `px-4 py-2 
                                min-w-fit 
                                cursor-pointer 
                                ${index === activeTab ? 'bg-slate-300 border-slate-500' : 'hover:bg-slate-200 border-transparent'} 
                                ${orientation === 'row' ? 'border-b-2' : 'border-r-2'}`
                            }
                        >
                            {tab.tabTitle}
                        </span>
                    );
                })}
            </div>
            <div className={`w-full h-full flex min-h-0 overflow-scroll ${''}`}>
                {activeTab !== null ? loader(content[activeTab]) : false}
            </div>
        </div>
    );
}

function ViewUserWindow({users, setUsers}: {users: Record<string, UserDTO>, setUsers: (users: Record<string, UserDTO>) => void}) {
    const content = Object.keys(users).map(username => {
        return {
            tabTitle: users[username].name,
            tabData: {...users[username]}
        }
    });

    const userContext = useUserContext();
    
    async function removeRole(role: RoleDTO, userId: string) {
        if (['Admin', 'Default'].indexOf(role.name) !== -1) {
            return;
        }

        const data = await userContext.fetcher('DELETE /api/users/:userId/roles', {
            roleIds: [role.id]
        }, { userId });

        if (data) {
            const newUsers = {...users, [userId]: data.user};
            setUsers(newUsers);
        }
    }
    
    const colors = ['bg-[#ae49b8]', 'bg-[#7d259d]', 'bg-[#748f9a]', 'bg-[#455a64]', 'bg-[#f44279]', 'bg-[#c91e5c]', 'bg-[#586bbb]', 'bg-[#0087cc]', 'bg-[#005898]', 'bg-[#0097a3]', 'bg-[#008779]', 'bg-[#004d41]', 'bg-[#629d44]', 'bg-[#2f6929]', 'bg-[#8d6e64]', 'bg-[#60423c]', 'bg-[#7e58bd]', 'bg-[#5232a2]', 'bg-[#f86c27]', 'bg-[#ff5231]', 'bg-[#c63921]'];
    
    return (
        <div className='p-4 flex flex-col gap-3 overflow-scroll w-full'>
            {content.map((data, index) => {
                const color = colors[data.tabData.name.length % colors.length];
                
                return (
                    <div key={index} className='flex flex-row gap-2 items-center w-full'>
                        <div className='flex flex-row items-center gap-2 w-[300px]'>
                            {/* <img src={data.tabData.profileUrl} className='rounded-full w-9 h-9' /> */}
                            <span className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-xl text-white capitalize select-none ${color}`}>
                                <span className='translate-x-[0.5px] translate-y-[-0.5px]'>
                                    {data.tabData.name.slice(0)[0]}
                                </span>
                            </span>
                            <span className='h-min'>
                                {data.tabData.name}
                            </span>
                        </div>
                        <div className='flex gap-1 flex-wrap w-full min-w-0'>
                            {data.tabData.roles.map(role => {
                                return <span 
                                    onClick={() => removeRole(role, data.tabData.id)} 
                                    key={`${data.tabData.name} ${role.id}`} 
                                    className={`px-2 py-1 bg-slate-200 rounded-md ${['Admin', 'Default'].indexOf(role.name) === -1 && 'hover:line-through'} hover:bg-slate-300 cursor-pointer select-none`}>
                                        {role.name}
                                    </span>
                            })}
                            <span className='px-2 py-1 leading-tight bg-slate-200 rounded-md hover:bg-slate-300 cursor-pointer select-none'>+</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
    // return (
    //     <TabManager
    //         content={content}
    //         loader={(data) => <ViewPermissions user={data.tabData} />}
    //     />
    // );
}

function ViewRolesWindow({roles}: {roles: Record<string, RoleDTO>}) {
    const content = Object.keys(roles).map(id => {
        return {
            tabTitle: roles[id].name,
            tabContent: {...roles[id]}
        };
    });
    return <TabManager 
        content={content}
        loader={(data) => {
            return (
                <div className='p-6 w-full'>
                    <h1 className='font-semibold text-2xl'>{`${data.tabContent.name} role's permissions`}</h1>
                    {data.tabContent.permissions}
                </div>
            );
        }}
    />
}

function ViewPermissions({user}: {user: UserDTO}) {
    return (
        <div className='p-6 w-full'>
            <h1 className='font-semibold text-2xl'>{user.name}'s roles</h1>
            {user.roles.map(role => {
                return (
                    <div key={`${user.id}-${role.id}`}>
                        {role.name}
                    </div>
                );
            })}
            {/* {user.roles} */}
        </div>
    )
}