import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Meeting from '../models/MeetingModel';
import { TypedRequest, TypedRequestParams, TypedRequestQuery, TypedResponse } from '../types/UtilTypes';
import { AttendanceIdParam, MeetingIdParam } from '@shared/params';
import PaginationHandler from '../classes/PaginationHandler';
import {
    AddMeetingData,
    GetAllMeetingsData,
    GetAttendanceData,
    GetMeetingData,
    UpdateMeetingData,
} from '@shared/responses/MeetingResponses';
import { AddMeetingRequest, UpdateMeetingRequest } from '@shared/requests/MeetingRequests';
import { GetAllMeetingsQuery } from '@shared/queries/MeetingQueries';

const paginationOptions = PaginationHandler.createOptions();

/**
 * @desc 	Get all the meetings
 * @route 	GET /api/meetings
 */
const getAllMeetings = asyncHandler(
    async (req: TypedRequestQuery<GetAllMeetingsQuery>, res: TypedResponse<GetAllMeetingsData>) => {
        let query = Meeting.find();

        const filterHandlers: Record<string, (value: string) => void> = {
            before: (value) => (query = query.where('time').lt(Number.parseInt(value))),
            after: (value) => (query = query.where('time').gt(Number.parseInt(value))),
            creator: (value) => (query = query.where('creator').equals(value)),
            name: (value) => (query = query.where('name', new RegExp(value, 'i'))),
            location: (value) => (query = query.where('location', new RegExp(value, 'i'))),
            type: (value) => (query = query.where('type', new RegExp(value, 'i'))),
        };

        Object.entries(req.query)
            .filter(([query]) => filterHandlers[query])
            .forEach(([query, value]: [string, string]) => filterHandlers[query](value));

        if (!req.query.passed || req.query.passed !== 'true') {
            query = query.where('time').gte(Date.now()); // Only get events that haven't passed
        }

        query = query.sort({ time: 'ascending' });

        const { response, data } = await PaginationHandler.paginate(query, req.query, paginationOptions);
        res.ok({
            ...response,
            meetings: await Promise.all(data.map((meeting) => meeting.asPopulated())),
        });
    },
);

/**
 * @desc    Get a specific meeting
 * @route   GET /api/meetings/:meetingId
 */
const getMeeting = asyncHandler(async (req: TypedRequestParams<MeetingIdParam>, res: TypedResponse<GetMeetingData>) => {
    const meeting = await Meeting.findById(req.params.meetingId);
    if (!meeting) {
        return res.notFound(`There is no meeting with the id ${req.params.meetingId}`);
    }

    res.ok({ meeting: await meeting.asPopulated() });
});

/**
 * @desc    Get the attendance for a specific meeting
 * @route   GET /api/meetings/:meetingId/attendances
 */

const getMeetingAttendance = asyncHandler(
    async (req: TypedRequestParams<MeetingIdParam>, res: TypedResponse<GetMeetingData>) => {
        const meeting = await Meeting.findById(req.params.meetingId);

        const attendance = meeting.attendance;

        if (attendance.length == 0) {
            return res.notFound(`There is no attendance in the meeting with the id ${req.params.meetingId}`);
        }

        res.ok({ meeting: await meeting.asPopulated() });
    },
);

/**
 * @desc    Modify attendance for a specific meeting
 * @route   POST /api/meetings/:meetingId/users/:userId/attendances
 */

const modifyMeetingAttendance = asyncHandler(
    async (req: TypedRequest<UpdateMeetingRequest, AttendanceIdParam>, res: TypedResponse<UpdateMeetingData>) => {
        const meeting = await Meeting.findByIdAndUpdate(req.params.meetingId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!meeting) {
            res.notFound(`There is no meeting with the id ${req.params.meetingId}`);
            return;
        }

        res.ok({ meeting: await meeting.asPopulated() });
    },
);
/**
 * @desc    Add feedback for a specific meeting
 * @route   POST /api/meetings/:meetingId/feedback
 */

const addMeetingFeedback = asyncHandler(
    async (req: TypedRequest<UpdateMeetingRequest, MeetingIdParam>, res: TypedResponse<UpdateMeetingData>) => {
        const meeting = await Meeting.findByIdAndUpdate(req.params.meetingId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!meeting) {
            res.notFound(`There is no meeting with the id ${req.params.meetingId}`);
            return;
        }

        res.ok({ meeting: await meeting.asPopulated() });
    },
);

/**
 * @desc    Update feedback for a specific meeting
 * @route   PATCH /api/meetings/:meetingId/feedback
 */

const updateMeetingFeedback = asyncHandler(
    async (req: TypedRequest<UpdateMeetingRequest, AttendanceIdParam>, res: TypedResponse<UpdateMeetingData>) => {
        const meeting = await Meeting.findByIdAndUpdate(req.params.meetingId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!meeting) {
            res.notFound(`There is no meeting with the id ${req.params.meetingId}`);
            return;
        }
        res.ok({ meeting: await meeting.asPopulated() });
    },
);

/**
 * @desc 	Get a user's feedback for a specific meeting
 * @route 	GET /api/meetings/:meetingId/attendances/:userId
 */

const getMeetingFeedbackForUser = asyncHandler(
    async (req: TypedRequest<UpdateMeetingRequest, AttendanceIdParam>, res: TypedResponse<GetAttendanceData>) => {
        const meeting = await Meeting.findById(req.params.meetingId);

        if (!meeting) {
            res.notFound(`There is no meeting with the id ${req.params.meetingId}`);
            return;
        }

        const filteredAttendances = meeting.attendance.filter((dto) => dto.user.id === req.params.userId);

        const filteredFeedback = filteredAttendances.map((dto) => {
            const { user, didAttend, ...rest } = dto;
            return rest;
        })[0];

        res.ok({ attendance: filteredFeedback });
    },
);

/**
 * @desc 	Add a new meetings
 * @route 	POST /api/meetings
 */
const addMeeting = asyncHandler(async (req: TypedRequest<AddMeetingRequest>, res: TypedResponse<AddMeetingData>) => {
    const newMeeting = await Meeting.create({
        ...req.body,
        creator: req.body.requester,
    });

    res.ok({ meeting: await newMeeting.asPopulated() });
});

/**
 * @desc    Edit a specific meeting
 * @route   PATCH /api/meetings/:meetingId
 */
const updateMeeting = asyncHandler(
    async (req: TypedRequest<UpdateMeetingRequest, MeetingIdParam>, res: TypedResponse<UpdateMeetingData>) => {
        const meeting = await Meeting.findByIdAndUpdate(req.params.meetingId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!meeting) {
            res.notFound(`There is no meeting with the id ${req.params.meetingId}`);
            return;
        }
        res.ok({ meeting: await meeting.asPopulated() });
    },
);

/**
 * @desc 	Delete a specific meeting
 * @route 	DELETE /api/meetings/:meetingId
 */
const deleteMeeting = asyncHandler(async (req: TypedRequestParams<MeetingIdParam>, res: Response) => {
    const meeting = await Meeting.findByIdAndDelete(req.params.meetingId);
    if (!meeting) {
        return res.notFound(`There is no meeting with the id ${req.params.meetingId}`);
    }
    res.sendStatus(204);
});

export {
    getAllMeetings,
    getMeeting,
    getMeetingAttendance,
    addMeeting,
    deleteMeeting,
    updateMeeting,
    getMeetingFeedbackForUser,
    addMeetingFeedback,
    updateMeetingFeedback,
};
