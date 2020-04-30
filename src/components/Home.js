import React from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

export default function Home() {
<<<<<<< HEAD
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const tasks = await loadTasks();

        setTasks(tasks);

        console.log("LOADED TASKS");
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadTasks() {

    return API.get("tasks", "/tasks");
    
  }

  function renderTasksList(tasks) {
    return [{}].concat(tasks).map((task, i) =>
      i !== 0 ? (
        <LinkContainer key={task.taskId} to={`/tasks/${task.taskId}`}>
          <ListGroupItem header={task.content.trim().split("\n")[0]}>
            {"Created: " + new Date(task.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/tasks/new">

          <ListGroupItem>
          {console.log("here")}
            <h4>
              <b>{"\uFF0B"}</b> Create a new task
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )

      
    );
  }

  function renderLander() {
    return (
=======
  return (
    <div className="Home">
>>>>>>> parent of e885276... Started on Task Posting
      <div className="lander">
        <h1>Learn Together</h1>
        <p>Lorem ipsum</p>

        <LinkContainer to="/postTask">
          <Button> Post A Task </Button>
        </LinkContainer>
        <Button> Search Tasks</Button>
      </div>
    </div>
  );
}
