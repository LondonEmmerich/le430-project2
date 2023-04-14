const HelloUser = (props) => {
  const [username, setUsername] = React.useState(props.username);

  return (
    <div>
      <p>Hello {username}</p>
      <label>Change Name: </label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
    </div>
  )
}

const init = () => {
  ReactDOM.render( <HelloUser username='Austin' />,
    document.getElementById('app'));
};

window.onload = init;
