
import SkeletonPage from './SkeletonSection';
import Task from './Task';

export default function TasksContainer({tasks}) {


  return (
    <section id="tasks-container container">
      <div className="header">
      <h3>Tasks:</h3>
      </div>
      <div className="card-group">
      {
        tasks == null ? <SkeletonPage/> :
        (tasks < 1 ? 
          <h2 className='empty'>No Tasks</h2> :
          tasks && tasks.map( task => (
            <Task task = {task} key={task.id}/>)
          )
        )
      }
      </div>
    </section>
  )
}
