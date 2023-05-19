import Switch from '@mui/material/Switch';
import { Permission } from '@shared/utils/Permission';
import { useUserContext } from '../../../contexts/UserContext';

//groups each permission by type
const PermissionsLists: { roles: Permission[], users: Permission[], meetings: Permission[] } = {
    roles: ["VIEW_ROLES", "MANAGE_ROLES"],
    users: ["VIEW_USERS", "MANAGE_USERS"],
    meetings: ["VIEW_MEETINGS", "MANAGE_MEETINGS"]
}

const allPermissions = Object.values(PermissionsLists).flat()

interface Props {
    activeRole: string;
    permissions: Permission[];
    setPermissions: (newPermissions: Permission[]) => void;
}

export default function PermissionsList(props: Props) {
    const userContext = useUserContext();
    //toggle all / section states
    const allChecked = allPermissions.every(permission => props.permissions.includes(permission));

    //Toggles all permissions in a section
    function toggleSection(sectionPermissions: Permission[], isChecked: boolean) {
        if (isChecked) {
            props.setPermissions([...new Set([...sectionPermissions, ...props.permissions])]);
        } else {
            props.setPermissions(props.permissions.filter(permission => !sectionPermissions.includes(permission)));
        }
    }
    return (
        <>
            <div className="flex items-center flex-row justify-between text-[#262B6C]">
                <h1 className="text-3xl font-semibold">{props.activeRole}</h1>

                {/* Select all */}
                <div className="flex sm:justify-end pt-2">
                    <h2 className="text-2xl">Select all</h2>
                    <Switch
                        checked={allChecked}
                        onChange={(e) => props.setPermissions(e.target.checked ? allPermissions : [])}
                        disabled={!userContext.hasPermission('MANAGE_ROLES')}
                    />
                </div>
            </div>

            <div className="flex flex-col overflow-scroll mt-2 ">
                {/* Map through each section permission section */}
                {Object.entries(PermissionsLists).map(
                    ([key, value]) => {
                        return (
                            <div className="md:grid grid-cols-2 gap-2 mb-3" key={key}>
                                {/* Section header */}
                                <div className="col-span-2 flex text-[#262b6c]">
                                    {/* Section nam */}
                                    <h1 className="text-3xl">
                                        {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                                    </h1>
                                    {/* Toggle section switch */}
                                    <Switch
                                        onChange={(e) => toggleSection(value, e.target.checked)}
                                        checked={value.every((permission) => props.permissions.includes(permission))}
                                        disabled={!userContext.hasPermission('MANAGE_ROLES')}
                                    />
                                </div>
                                {/* Map through each permission in the section */}
                                {value.map((permission) => {
                                    return (
                                        <div
                                            className="p-2 text-[#262b6c] text-2xl bg-[#bdc3e3] mt-1 flex justify-between align-bottom"
                                            key={permission}
                                        >
                                            {/* Permission name */}
                                            <p>
                                                {(
                                                    permission.charAt(0).toUpperCase() +
                                                    permission.slice(1).toLowerCase()
                                                ).replace('_', ' ')}
                                            </p>

                                            {/* Toggle individual permission switch */}
                                            <Switch
                                                color="secondary"
                                                checked={props.permissions.includes(permission)}
                                                onChange={(e) => {
                                                    props.setPermissions(e.target.checked
                                                        ? [...props.permissions, permission]
                                                        : props.permissions.filter(perm => perm !== permission))
                                                }}
                                                disabled={!userContext.hasPermission('MANAGE_ROLES')}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    },
                )}
            </div>
        </>
    );
}
 //