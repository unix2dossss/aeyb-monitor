import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react'
import "react-datepicker/dist/react-datepicker.css"
import { useMeetingContext } from '../../../contexts/MeetingContext';
import { useUserContext } from '../../../contexts/UserContext';
import { AddMeetingRequest } from '@shared/requests/MeetingRequests';
import DatePickerUtil from '../../../utility_components/DatePickerUtil';
import { addOneHour, roundToHour } from '../../../utils/timeUtil';
import LoadingSpinner from '../../../utility_components/LoadingSpinner';


const defaultValues = {
    title: '',
    location: '',
    description: '',
    startTime: roundToHour(new Date()),
    finishTime: addOneHour(roundToHour(new Date())),
}

export default function NewMeeting(props) {

    const userContext = useUserContext();
    const meetingContext = useMeetingContext();

    const { isNewMeetingOpen, setIsNewMeetingOpen } = props
    const [formValues, setFormValues] = useState(defaultValues);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };
    const handleStartChange = (date) => {
        setFormValues({
            ...formValues,
            startTime: date,
        })
    }
    const handleFinishChange = (date) => {
        setFormValues({
            ...formValues,
            finishTime: date,
        })
    }


    function handleExit() {
        setIsNewMeetingOpen(false)
        setFormValues(defaultValues)
    }



    async function handleSubmit(event) {
        event.preventDefault();

        if (formValues.startTime.getTime() < Date.now()) {
            alert('Start time cannot be in the past');
            return;
        }

        if (formValues.startTime.getTime() > formValues.finishTime.getTime()) {
            alert('Start time cannot be later than finish time');
            return;
        }

        const meetingRequest: AddMeetingRequest = {
            startTime: formValues.startTime.getTime(),
            finishTime: formValues.finishTime.getTime(),
            location: formValues.location,
            description: formValues.description,
            type: "meeting",
            name: formValues.title,
            attendance: {
                attendedUsers: [],
                absentUsers: new Map(),
                invited: {
                    userIds: [],
                    roleIds: []
                }
            }
        } satisfies AddMeetingRequest;

        console.log(formValues);

        setIsLoading(true);
        const data = await userContext.fetcher('POST /api/meetings', meetingRequest);
        setIsLoading(false);

        if (data) {
            meetingContext.addMeeting(data.meeting);
            setFormValues(defaultValues);
            setIsNewMeetingOpen(false);
        }
    }

    return (
        <>
            {isLoading ? (
                <div className="fixed z-50 top-0 left-0 w-full h-full overflow-hidden bg-gray-800 opacity-50 flex items-center justify-center">
                    <div className="bg-white border py-2 px-5 rounded-lg flex flex-col items-center">
                        <div className="loader-dots grid grid-cols-3 gap-2">
                            <div className="bg-[#7d6ca3] rounded-full w-2 h-2"></div>
                            <div className="bg-[#7d6ca3] rounded-full w-2 h-2"></div>
                            <div className="bg-[#7d6ca3] rounded-full w-2 h-2"></div>
                        </div>
                        <div className="text-gray-500 text-xs font-light mt-2 text-center">
                            Please wait...
                        </div>
                    </div>
                </div>
            ) : (
                isNewMeetingOpen && (
                    <div className='flex items-center justify-center fixed h-screen w-full top-0 left-0 '>
                        <div className='opacity-50 bg-gray-600 w-full h-full absolute top-0 left-0 z-20' ></div >
                        <div className='text-5xl bg-white p-10 opacity-100 z-30 rounded-lg w-1/2 flex flex-col items-center relative'>
                            <button className='bg-red-400 p-2 hover:bg-red-500 rounded-md text-2xl text-white px-5 absolute top-0 right-0 mt-2 mr-2' onClick={handleExit}>
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                            <h1 className='my-5'>Create new meeting</h1>

                            <form className='flex flex-col items-center text-lg w-3/4' onSubmit={handleSubmit}>

                                <input
                                    className='border-[#7d6ca3] border-2 px-1 rounded-md w-full my-2'
                                    name="title"
                                    type="text"
                                    placeholder='Meeting Name'
                                    value={formValues.title}
                                    onChange={handleInputChange}
                                    required={true}
                                />
                                <input
                                    className='border-[#7d6ca3] border-2 px-1 rounded-md w-full my-2'
                                    name="location"
                                    type="text"
                                    placeholder='Location'
                                    value={formValues.location}
                                    onChange={handleInputChange}
                                    required={true}
                                />

                                <DatePickerUtil value={formValues.startTime} handleChange={handleStartChange} />
                                <DatePickerUtil value={formValues.finishTime} handleChange={handleFinishChange} />

                                <textarea
                                    className=' my-2 w-full border-[#7d6ca3] border-2 p-2 rounded-md resize-none'
                                    name="description"
                                    placeholder='Desciption'
                                    rows={5}
                                    value={formValues.description}
                                    onChange={handleInputChange}
                                />
                                <button className='bg-[#7d6ca3] text-white p-2 rounded-md text-3xl  px-5 my-2' type="submit">Submit</button>

                            </form>
                        </div>
                    </div >
                )
            )}
        </>
    );


}