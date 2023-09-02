import Project from './Project'
import AddButton from './AddButton'
import {useContext} from 'react'
import SkeletonSection from './SkeletonSection'
import { AppContext } from '../_contexts/AppContext'


export default function ProjectsContainer({projects}) {
  const {setShowProjectForm} = useContext(AppContext);

  // console.log(projects)
  const addProject = () => {
    setShowProjectForm(true)
  }


  return (
    <section id="projects-container">
      <div className="header">
        <h3>Projects:</h3>
        <AddButton btnText={"Add Project +"} onClickHandler={addProject}/>
      </div>
      <div className="card-group">
        {
          projects == null ? <SkeletonSection/> :
          (projects < 1 ? 
          <h2 className='empty'>No projects</h2>:
          projects && projects?.map( project => (
            <Project project={project} key={project.id}/>
            )))
        }
      </div>

    </section>
  )
}
