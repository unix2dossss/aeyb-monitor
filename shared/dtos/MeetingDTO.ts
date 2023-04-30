import AttendanceDTO from './AttendanceDTO';
import { UnpopulatedUserDTO } from './UserDTO';

export const MeetingTypes = ['meeting', 'event'] as const;
export type MeetingType = typeof MeetingTypes[number];

export default interface MeetingDTO {
    id: string;
    type: MeetingType;
    creator: UnpopulatedUserDTO;
    name: string;

    /** The time value in ms when this meeting is scheduled for. */
    startTime: number;
    endTime: number;
    location: string;
    attendance: AttendanceDTO;

    /** The optional description for this meeting. */
    description?: string;
}
