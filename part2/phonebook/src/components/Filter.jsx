const Filter = ({handleFilterChange}) => {
    return (
        <form>
            <div>
                filter shown with <input type='text' onChange={handleFilterChange} />
            </div>
        </form>
    )
}

export default Filter