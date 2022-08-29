import mongoose from 'mongoose';
import { UserModel } from './UserModel';
import { AttendanceSchema, Attendance } from './AttendanceModel';

export interface MeetingModel {
    _id: mongoose.Types.ObjectId;
    name: string;
    creator: UserModel;
    time: Date;
    where: string;
    attendance: Attendance;
    description: string;
}

const meetingSchema = new mongoose.Schema<MeetingModel>({
    name: {
        type: String,
        required: [true, "You must specify the meeting's name"],
        trim: true,
    },
    creator: {
        type: String,
        ref: 'User',
        required: [true, "You must specify the creator's id"],
    },
    time: {
        type: Date,
        required: [true, 'You must specify when the event starts'],
    },
    where: {
        type: String,
        required: [true, 'You must specify the where the meeting was held'],
    },
    attendance: {
        type: AttendanceSchema,
        ref: 'Attendance',
        required: [true, 'You must specify the attendance'],
    },
    description: {
        type: String,
    },
});

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
