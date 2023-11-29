//import logo from "./logo.svg";
import styles from '../Styles/index.module.css'
import TaskTable from './TaskTable'

function HomePage() {
    return (
        <div>
            <div className={styles.CalendarTaskContainer}>
                <div className={styles.CalendarDashboard} />
                <div className={styles.TaskCalendarDivider} />
                <div className={styles.TaskContainer}>
                    <TaskTable />
                </div>
            </div>
        </div>
    )
}

export default HomePage
