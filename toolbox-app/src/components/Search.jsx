import React, {useState} from "react";
import InputGroup from "react-bootstrap/InputGroup";
import {FormControl} from "react-bootstrap";

const Search = ({path, func}) => {

    const [ search , setSearch ] = useState("")

    const handleSearch = (e) => {
        e.preventDefault()
        setSearch(e.target.value)
    }

    const handleBot=()=>{
        func(path + `${search}`)
    }

    return (
        <InputGroup className="mb-3 col-12 mt-2">
            <FormControl
                placeholder="Search"
                aria-label="Search"
                onChange={handleSearch}
                value={search}
            />
            <button onClick={handleBot} style={{border:"none", backgroundColor:"white", margin:"10px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-search" viewBox="0 0 15 15">
                    <path
                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </button>
        </InputGroup>
    )

}

export default Search
