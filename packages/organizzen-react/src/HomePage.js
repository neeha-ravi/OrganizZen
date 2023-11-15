//import logo from "./logo.svg";
import styles from './Styles/index.module.css'

function HomePage() {
    return (
        <div>
            <div className={styles.Header}>O R G A N I Z Z E N</div>
            <div className={styles.CalendarContainer}>
                <div className={styles.CalendarDashboard} />
            </div>
            {/*
      <div className={styles.AddContainer}>
        <div className={styles.AddTaskLabel}>
          <b>ADD TASK</b>
        </div>
        <div className={styles.AddEventLabel}>
          <b>ADD EVENT</b>
        </div>
      </div>
      <div className={styles.Divider}></div>
      */}
            <div className={styles.ToDoListContainer}>
                {/* just testing will fix logic later*/}
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
                <div className={styles.Divider}></div>
                <div className={styles.DateContainer}></div>
            </div>
        </div>
    )
}

export default HomePage
