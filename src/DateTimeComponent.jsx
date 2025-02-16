import React, {useState, useEffect} from 'react';

function DateTimeComponent(){
    const [dtime, setDtime] = useState(new Date());

    useEffect(()=>{
        const intervalID = setInterval(()=>{
            setDtime(new Date());
        },1000);

        return ()=>{
            clearInterval(intervalID);
        }
    },[]);

    function dtimeFormat(){
        const year= dtime.getFullYear();
        const monthName = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const month=monthName[dtime.getMonth()];
        const day = dtime.getDate();

        const hours = dtime.getHours();
        const minutes = dtime.getMinutes();
        const seconds = dtime.getSeconds();
        const meridiem = hours>=12 ? "PM" : "AM";

        return `${padZero(day)} ${month} ${year} | ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${meridiem}`;
    }

    function padZero(number){
        return (number<10 ? "0" : "")+number;
    }

    return(
            <div className="date-time-container">
                    <div className="date-time">
                        <p>{dtimeFormat()}</p>
                    </div>
            </div>
        );
}

export default DateTimeComponent;