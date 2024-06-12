import { useDispatch } from "react-redux"
import { filterChange } from "../reducers/filterReducer"

const SearchFilter = () => {
    const dispatch = useDispatch()

    return (
        <p>Filter: <input type='text' onChange={(event) => dispatch(filterChange(event.target.value))} /></p>
    )
}

export default SearchFilter