const SetData = ({obj, lang}) => {
    return (
      <>
        <h2>{obj.name.common}</h2>
        <p>capital : {obj.capital}</p>
        <p>area : {obj.area}</p>
        <p><strong>Languages :</strong></p>
        <ul>
          {lang(obj)}
        </ul>
        <img alt="countries flag" src={obj.flags.png} />
      </>
    )
}

export default SetData

