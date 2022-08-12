const SuccesMessage = ({succes}) => {
    if (succes === null) return null
    return (
        <div className="succes">
            {succes}
        </div>
    )
}
export default SuccesMessage