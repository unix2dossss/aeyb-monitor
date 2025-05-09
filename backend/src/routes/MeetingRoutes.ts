import { Router } from 'express';
import protect from '../middleware/AuthMiddleware';

import {
    getAllMeetings,
    getMeeting,
    addMeeting,
    deleteMeeting,
    updateMeeting,
    getMeetingAttendance,
    modifyMeetingAttendance,
    modifyMeetingAttendances,
    getMeetingAttendanceForUser,
    getMeetingFeedbackForUser,
    addMeetingFeedback,
    updateMeetingFeedback,
    getMeetingFeedback,
    endMeeting,
    deleteMeetingAttendanceList,
} from '../controllers/MeetingController';

const MeetingRouter = Router();

MeetingRouter.route('/').get(protect(), getAllMeetings).post(protect('MANAGE_MEETINGS'), addMeeting);

MeetingRouter.route('/:meetingId')
    .get(protect('VIEW_MEETINGS'), getMeeting)
    .delete(protect('MANAGE_MEETINGS'), deleteMeeting)
    .patch(protect('MANAGE_MEETINGS'), updateMeeting);
MeetingRouter.route('/:meetingId/end').patch(protect('MANAGE_MEETINGS'), endMeeting);

MeetingRouter.route('/:meetingId/attendances')
    .get(protect('VIEW_MEETINGS'), getMeetingAttendance)
    .patch(protect('MANAGE_MEETINGS'), modifyMeetingAttendances);
MeetingRouter.route('/:meetingId/attendances/users/:userId')
    .get(protect('VIEW_MEETINGS'), getMeetingAttendanceForUser)
    .patch(protect('MANAGE_MEETINGS'), modifyMeetingAttendance);

MeetingRouter.route('/:meetingId/feedback')
    .get(protect('VIEW_MEETINGS'), getMeetingFeedback)
    .patch(protect('MANAGE_MEETINGS'), updateMeetingFeedback);
MeetingRouter.route('/meetings/:meetingId/feedback/users/:userId')
    .post(protect('MANAGE_MEETINGS'), addMeetingFeedback)
    .get(protect('VIEW_MEETINGS'), getMeetingFeedbackForUser);

MeetingRouter.route('/attendance/:meetingId')
    .get(protect('VIEW_MEETINGS'), getMeetingAttendance)
    .delete(protect('MANAGE_MEETINGS'), deleteMeetingAttendanceList);

export default MeetingRouter;
