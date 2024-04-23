// src/NewProjectForm.js

// form for creating new project

import styles from './styles/TimeChangeRequestForm.css'

import React, {useState,useEffect} from 'react';

export default function TimeChangeRequestForm({handleTimeChangeRequest, setShowForm, clockinout}) {
	const [clockIn, setClockIn] = useState(new Date(clockinout.clock_in_time));
	const [clockOut, setClockOut] = useState(null);
	const [day, setDay] = useState(clockIn.getDate());
	const [month, setMonth] = useState(clockIn.getMonth() + 1); 
	const [year, setYear] = useState(clockIn.getFullYear());
	const [hour, setHour] = useState(clockIn.getHours());
	const [minute, setMinute] = useState(clockIn.getMinutes());
	const [second, setSecond] = useState(clockIn.getSeconds());
	const [ampm, setAmPm] = useState(clockIn.getHours() < 12 ? 'AM' : 'PM');

	const [durationHour, setDurationHour] = useState(clockinout.duration.hours);
	const [durationMinute, setDurationMinute] = useState(clockinout.duration.minutes);
	const [durationSecond, setDurationSecond] = useState(clockinout.duration.seconds);

	const [outDay, setOutDay] = useState(clockIn.getDate());
	const [outMonth, setOutMonth] = useState(clockIn.getMonth() + 1);
	const [outYear, setOutYear] = useState(clockIn.getFullYear());
	const [outHour, setOutHour] = useState(clockIn.getHours());
	const [outMinute, setOutMinute] = useState(clockIn.getMinutes());
	const [outSecond, setOutSecond] = useState(clockIn.getSeconds());
	const [outAmPm, setOutAmPm] = useState(clockIn.getHours() < 12 ? 'AM' : 'PM');

	const [flag, setFlag] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setShowForm(false);

		console.log("SUBMTITING");

		const new_clock_in = new Date(year, month - 1, day, ampm === 'PM' ? hour + 12 : hour, minute, second);

		const duration = {
			hours: durationHour,
			minutes: durationMinute,
			seconds: durationSecond
		}

		const durationInMillis = 1000 * (3600*durationHour + 60*durationMinute + durationSecond);

		await handleTimeChangeRequest(clockinout._id, new_clock_in, duration, clockinout.project_id, clockinout.user_id);
		setShowForm(false);
	};

	const handleBackgroundClick = (e) => {
		// Close the form if background is clicked
		if (e.target === e.currentTarget)
		{
			setShowForm(false);
		}
	};

	const updateOutput = () => {
		const durationInMillis = 1000 * (3600 * durationHour + 60 * durationMinute + durationSecond);
		setClockOut(new Date(clockIn.getTime() + durationInMillis));
	};
	
	const formatOutput = () => {
		if (clockOut) {
			const durationInMillis = 1000 * (3600 * durationHour + 60 * durationMinute + durationSecond);
			const new_clock_in = new Date(year, month - 1, day, hour + (ampm === 'PM' && hour !== 12 ? 12 : 0), minute, second);

			const new_clock_out = new Date(new_clock_in.getTime() + durationInMillis);

			setClockOut(new_clock_out);
			setOutDay(clockOut.getDate());
			setOutMonth(clockOut.getMonth() + 1);
			setOutYear(clockOut.getFullYear());
			setOutHour(clockOut.getHours());
			setOutMinute(clockOut.getMinutes());
			setOutSecond(clockOut.getSeconds());
			setOutAmPm(clockOut.getHours() < 12 ? 'AM' : 'PM');
		}
	};
	
	useEffect(() => {
		if (flag)
		{
			updateOutput();
			setFlag(false);
		}
	}, [flag]);
	
	// useEffect(() => {
	// 	formatOutput();
	// }, [clockOut]);

	return (
		<div className='form-background' onClick={handleBackgroundClick}>
			<form className="time-change-request" onSubmit={handleSubmit} onClick={handleBackgroundClick}>
				<h1 id="first" class= "project-title text">Clock In Time</h1>
					<div className='form-section-background'>
						<input
							id="month"
							type="number"
							value={month}
							placeholder={month}
							onChange={(e) => {setMonth(parseInt(e.target.value)); setFlag(true);}}
							required
						/>
						<p>/</p>
						<input
							id="day"
							type="number"
							value={day}
							placeholder={day}
							onChange={(e) => {setDay(parseInt(e.target.value)); setFlag(true);}}
							required
						/>
						<p>/</p>
						<input
							id="year"
							type="number"
							value={year}
							placeholder={year}
							onChange={(e) => {setYear(parseInt(e.target.value)); setFlag(true);}}
							required
						/>
					</div>
					<br/>
					<div className='form-section-background'>
						<input
							id="hour"
							type="number"
							value={hour}
							placeholder={hour}
							onChange={(e) => {setHour(parseInt(e.target.value)); setFlag(true);}}
							required
						/>
						<p>:</p>
						<input
							id="minute"
							type="number"
							value={String(minute).padStart(2, '0')}
							placeholder={String(minute).padStart(2, '0')}
							onChange={(e) => {setMinute(parseInt(e.target.value)); setFlag(true);}}
							required
						/>
						<p>:</p>
						<input
							id="second"
							type="number"
							value={String(second).padStart(2, '0')}
							placeholder={String(second).padStart(2, '0')}
							onChange={(e) => {setSecond(parseInt(e.target.value)); setFlag(true);}}
							required
						/>
						<select value={ampm} onChange={(e) => setAmPm(e.target.value)}>
							<option value="AM">AM</option>
							<option value="PM">PM</option>
						</select>
					</div>
					

				<h1 class= "project-title text" text>Duration</h1>
					<div className='form-section-background'>
						<input
							id="durationHour"
							type="number"
							value={durationHour}
							placeholder={durationHour}
							onChange={(e) => {setDurationHour(parseInt(e.target.value)); setFlag(true);}}
							required
						/>
						<p className="time-suffix">h</p>
						<input
							id="durationMinute"
							type="number"
							value={String(durationMinute).padStart(2, '0')}
							placeholder={String(durationMinute).padStart(2, '0')}
							onChange={(e) => {setDurationMinute(parseInt(e.target.value)); setFlag(true);}}
							required
						/>
						<p className="time-suffix">m</p>
						<input
							id="durationSecond"
							type="number"
							value={String(durationSecond).padStart(2, '0')}
							placeholder={String(durationSecond).padStart(2, '0')}
							onChange={(e) => {setDurationSecond(parseInt(e.target.value)); setFlag(true);}}
							required
						/>
						<p className="time-suffix">s</p>
					</div>
					
				<h1 class= "project-title text">Clock Out Time</h1>
					<div className='form-section-background'>
						<p className="out">{outMonth}/{outDay}/{outYear} {outHour}:{String(outMinute).padStart(2, '0')}:{String(outSecond).padStart(2, '0')} {outAmPm}</p>
					</div>
				<button type="submit" className="submit-project hov">Submit</button>
			</form>
		</div>
	)
};
