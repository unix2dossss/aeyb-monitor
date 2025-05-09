import { useState } from 'react'
import Rating from './components/RadioGroupRating'
import { useNavigate } from 'react-router-dom';
import Button from 'src/utility_components/Button';

export default function AfterMeeting() {
    const [rating, setRating] = useState(3);
    const navigate = useNavigate();

    const navToHomePage = () => {
        navigate('/', { replace: true });
    };

    const [hasComment, setCommentStatus] = useState(true);
    const [leaveMeetingOpen, setLeaveMeetingOpen] = useState(false);

    function handleSubmit() {
        console.log(`
        Rating: ${rating},
        Comments: ${(document.getElementById('comment') as HTMLInputElement).value}`)
    }

    function inputRequired() {
        if ((document.getElementById('comment') as HTMLInputElement).value.length !== 0) {
            setLeaveMeetingOpen(true);
        } else {
            setCommentStatus(false);
        }
    }

    return (
        <div className='h-screen overflow-scroll relative'>
            <div className='h-screen mx-auto py-2 flex items-center flex-col text-[#262B6C] text-center'>
                <h1 className='text-4xl mt-4 mb-10 font-bold'>Meeting A - with Group B</h1>
                <div className='flex flex-col items-center w-5/6 lg:w-1/3 text-center'>

                    <h2 className='text-3xl'>How are you feeling today?</h2>
                    <div className='w-full mt-3 mb-16 flex justify-center'>
                        <Rating setRating={setRating} />
                    </div>
                    <h2 className='text-3xl'>How did you find the meeting?</h2>
                    <textarea id='comment' className=' mt-4 mb-2 w-full border-[#262b6c] border-2 p-2 resize-none' placeholder='Enter Comments' rows={10}></textarea>
                    <p className={`text-red-600 mb-10 w-full text-left ${hasComment ? 'invisible' : 'visible'}`}>*required: please leave a comment</p>
                    <Button extraStyles='border-red-600 border-2 px-6' size='large' color='#fca5a5' onClick={inputRequired}>Submit</Button>
                </div>
            </div>
            {
                leaveMeetingOpen ?
                    <div className='flex items-center justify-center fixed h-screen w-full top-0 left-0 '>
                        <div className='opacity-50 bg-gray-600 w-full h-full absolute top-0 left-0 z-20'></div>
                        <div className='text-5xl bg-white p-10 opacity-100 z-30 rounded-lg'>
                            Are you sure you want to submit?
                            <div className='flex justify-around p-5 mt-20'>
                                <Button size='large' color='#bdc3e3' extraStyles='border-blue-900 border-2 px-6' onClick={() => setLeaveMeetingOpen(false)}>Cancel</Button>
                                <Button size='large' color='#fca5a5' extraStyles='border-red-600 border-2 px-6'
                                    onClick={() => {
                                        handleSubmit();
                                        navToHomePage();
                                    }}>Submit</Button>

                            </div>
                        </div>
                    </div>
                    : null
            }
        </div >

    )
}