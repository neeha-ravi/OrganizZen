//import logo from "./logo.svg";
import styles from '../Styles/index.module.css'
import TaskTable from './TaskTable'

function HomePage() {
    return (
        <div>
            <div className={styles.Header}>O R G A N I Z Z E N</div>
            <div className={styles.CalendarContainer}>
                <div className={styles.CalendarDashboard} />
            </div>
            <div className="Divider"></div>
            <TaskTable />
        </div>
    )
}

export default HomePage
