const Notification = ({ message, classMessage }) => {
  if (message === null) return null
  else return (
    <div className={ classMessage }>{ message }</div>
  )
}


export default Notification