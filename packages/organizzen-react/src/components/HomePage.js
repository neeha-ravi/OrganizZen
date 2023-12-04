//import logo from "./logo.svg";
import styles from '../Styles/index.module.css'
import TaskTable from './TaskTable'
import Calendar from './Calendar'
import React, { useState } from 'react'

function HomePage() {
    const [filter, setFilter] = useState(new Set())

    return (
        <div>
            <div className={styles.CalendarTaskContainer}>
                <div className={styles.CalendarDashboard}>
<<<<<<< HEAD
                    <Calendar />
=======
                    <Calendar filter={filter} setFilter={setFilter} />
>>>>>>> 61f7028dc9eebd585e45bdd1e14e0f51e7e0287e
                </div>
                <div className={styles.TaskCalendarDivider} />
                <div className={styles.TaskContainer}>
                    <TaskTable filter={filter} />
                </div>
            </div>
        </div>
    )
}

export default HomePage
