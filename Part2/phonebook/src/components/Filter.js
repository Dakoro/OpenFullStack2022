const Filter = (props) => {
  const {filterName}= props
  const {handleFilterName} = props
  return (
      <div>
        filter shown with <input value={filterName} onChange={handleFilterName} />
      </div>
    )
}
export default Filter