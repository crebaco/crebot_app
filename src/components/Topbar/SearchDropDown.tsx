import { useState } from 'react'
import { Dropdown } from 'react-bootstrap'

const SearchDropDown = ( ) => {
	const [dropDownOpen, setDropDownOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')

	/**
	 * Toggle Profile DropDown
	 */
	const toggleDropDown = () => {
		setDropDownOpen(!dropDownOpen)
	}

	/**
	 * Handle search query change
	 * @param {string} query - Search query
	 */
	const handleChange = (query:any) => {
		setSearchQuery(query)
		// Optionally, you can call the handleSearch function here
		// handleSearch(query);
	}

	/**
	 * Handle form submit (optional)
	 * @param {Event} event - Form submission event
	 */
	const handleSubmit = (event :any) => {
		event.preventDefault()
		// Optionally, you can call the handleSearch function here
		// handleSearch(searchQuery);
	}

	return (
		<Dropdown show={dropDownOpen} onToggle={toggleDropDown}>
			<Dropdown.Toggle
				as="a"
				className="nav-link dropdown-toggle arrow-none"
				role="button">
				<i className="ri-search-line " />
			</Dropdown.Toggle>
			<Dropdown.Menu className="dropdown-menu-animated dropdown-lg p-0">
				<form className="p-3" onSubmit={handleSubmit}>
					<input
						type="search"
						className="form-control"
						placeholder="Search ..."
						aria-label="Recipient's username"
						value={searchQuery}
						onChange={(e) => handleChange(e.target.value)}
					/>
				</form>
			</Dropdown.Menu>
		</Dropdown>
	)
}

export default SearchDropDown
