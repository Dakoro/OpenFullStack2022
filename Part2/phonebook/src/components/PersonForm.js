const PersonForm = (props) => {
  const {add} = props
  const {name} = props
  const {changeName} = props
  const {number} = props
  const {changeNumber} = props
  const {checkName} = props
  return(
    <div>
      <form onSubmit={add}>
        <label>
          name: <input value={name} onChange={changeName} />
        </label>
        <label>
          number: <input value={number} onChange={changeNumber} />
        </label>
        <div>
          <button type="submit" onClick={checkName}>add</button>
        </div>
      </form>
      
    </div>
  )
} 

export default PersonForm