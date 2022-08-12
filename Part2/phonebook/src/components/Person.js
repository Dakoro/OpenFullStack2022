const Select = ({ person, handleRemove}) => {
    return (
      <p>{person.name} {person.number} <button className={person.id} onClick={ (e) => handleRemove(person.id, e)}>delete</button></p>
    )
  }

const Person = ({filter, handleRemove, e}) => {
  return (
    <div>
      {filter.map(person => 
          <Select key={person.id} e={e} person={person} handleRemove={handleRemove} />
      )}
    </div>
  )
}

export default Person