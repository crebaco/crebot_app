import React, { useState, useEffect } from 'react'
import { Table, Modal, Button, Pagination, Form } from 'react-bootstrap'
import { FaEdit, FaTrash, FaFilter } from 'react-icons/fa'
import { CustomCardPortlet } from '@/components'
import { toast } from 'react-toastify'
import Pusher from 'pusher-js'
import 'react-toastify/dist/ReactToastify.css'
import config from '@/config'
interface Project {
	status: string
	script_id: number
	script: string
	buy_sell: string
	trigger_price: number
	current_price: number
	created_on: string
	profit_percentage: number
	alert_name: string
	is_published:string
	source:string
}

interface Data {
	message: string;
  }

const Admin = () => {
	const BaseUrl = config.BaseUrl;
	const [projects, setProjects] = useState<Project[]>([])
	const [filteredByDateProjects, setfilteredByDateProjects] = useState<
		Project[]
	>([])
	const [selectedProject, setSelectedProject] = useState<Project | null>(null)
	const [selectedProjectToDelete, setSelectedProjectToDelete] =
		useState<Project | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [visiblePages, setVisiblePages] = useState<number[]>([])
	const [showAddModal, setShowAddModal] = useState(false)
	const [newMessage, setMessage] = useState([])
	const [searchQuery, setSearchQuery] = useState('')

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
	}

	const filteredProjects = projects.filter(
		(project) =>
			project.script.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.script_id.toString().includes(searchQuery)
	)

	const [showFilterModal, setShowFilterModal] = useState(false)
	// const [priceRange, setPriceRange] = useState<number>(0)
	const [filterCriteria, setFilterCriteria] = useState({
		date: '',
		date2: '',
	})

	useEffect(() => {
		// @ts-ignore
		const pusher = new Pusher('6effc58e879ccfe7c269', {
			cluster: 'ap2',
			encrypted: true,
		})

		const channel = pusher.subscribe('signals')

		channel.bind('new-record-added', (data: Data) => {
			toast.success(data)
			setMessage(data.message)
		})

		return () => {
			channel.unbind_all()
			channel.unsubscribe()
		}
	})

	const pushNotification = (message) => {
		toast(message, {
			autoClose: 3000,
			position: 'top-right',
			pauseOnHover: false,
			draggable: false,
			closeButton: false,
		})
	}

	useEffect(() => {
		pushNotification(newMessage)
	}, [newMessage])

	useEffect(() => {
		fetchProjects()
	}, [newMessage, searchQuery, filteredProjects, filteredByDateProjects])

	const fetchProjects = async () => {
		try {
			const response = await fetch(`${BaseUrl}/signals`)
			const data = await response.json()
			setProjects(data)
		} catch (error) {
			console.error('Error fetching projects:', error)
		}
	}

	const applyFilters = () => {
		// const filteredProjects = projects.filter((project) => {

		// 	console.log(project.trigger_price.toFixed(2) === filterCriteria.price.toFixed(2))
		// 	return project.trigger_price === filterCriteria.price.toFixed(2)
		// })
		const filteredByDateProjects = projects.filter((project) => {
			// Assuming filterCriteria contains minimum and maximum price values
			const fromdate = new Date(filterCriteria.date)
			let todate = new Date(filterCriteria.date2)

			// Set the time part of todate to the end of the day
			todate.setHours(23, 59, 59, 999)

			// Convert project's created_on date to a Date object for comparison
			const projectDate = new Date(project.created_on)

			// Check if project's created_on date falls within the specified range
			return projectDate >= fromdate && projectDate <= todate
		})

		console.log('Filtered projects:', filteredByDateProjects)

		setfilteredByDateProjects(filteredByDateProjects)
		updateVisiblePages(currentPage, filteredByDateProjects.length)
		setShowFilterModal(false)
	}

	// const handlePriceRangeChange = (value) => {
	// 	setPriceRange(parseFloat(value))
	// 	setFilterCriteria({ ...filterCriteria, price: value })
	// }

	const toggleFilterModal = () => {
		setShowFilterModal(!showFilterModal)
	}
	// const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const { name, value } = e.target
	// 	setFilterCriteria({ ...filterCriteria, [name]: value })
	// }

	const updateVisiblePages = (page: number, totalItems: number) => {
		const totalPages = Math.ceil(totalItems / 5)
		let startPage = Math.max(1, page - 1)
		let endPage = Math.min(startPage + 2, totalPages)

		if (endPage - startPage < 2) {
			startPage = Math.max(1, endPage - 2)
		}

		setVisiblePages(
			[...Array(endPage - startPage + 1).keys()].map((i) => i + startPage)
		)
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		return `${day}/${month}/${year}`
	}

	const formatProfitPercentage = (percentage: number) => {
		const formattedPercentage = Math.abs(percentage).toFixed(2)
		const sign = percentage >= 0 ? '+' : '-'
		const textColor = percentage < 0 ? 'red' : 'green'
		return (
			<span
				className="badge"
				style={{ fontSize: '13px', backgroundColor: textColor }}>
				{sign}
				{formattedPercentage}%
			</span>
		)
	}

	const formatProfitPercentageIntradaySell = (percentage: number) => {
		const formattedPercentage = Math.abs(percentage).toFixed(2)
		const sign = percentage >= 0 ? '-' : '+'
		const textColor = percentage < 0 ? 'green' : 'red'
		return (
			<span
				className="badge"
				style={{ fontSize: '13px', backgroundColor: textColor }}>
				{sign}
				{formattedPercentage}%
			</span>
		)
	}


	const formatProfitPercentagestatus = (percentage: number) => {
		const sign = percentage >= 0 ? '+' : '-';
		const formattedPercentage = Math.abs(percentage).toFixed(2);
		return `${sign}${parseFloat(formattedPercentage)}`;
	}
	
	const formatProfitPercentageIntradaySellstatus = (percentage: number) => {
		const sign = percentage >= 0 ? '-' : '+';
		const formattedPercentage = Math.abs(percentage).toFixed(2);
		return `${sign}${parseFloat(formattedPercentage)}`;
	}
	

	const handleCloseModal = () => {
		setSelectedProject(null)
	}

	// const handlePageChange = (pageNumber: number) => {
	// 	setCurrentPage(pageNumber)
	// 	updateVisiblePages(pageNumber, filteredProjects.length)
	// }
	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		 if (filteredByDateProjects && filteredByDateProjects.length > 0) {
			updateVisiblePages(pageNumber, filteredByDateProjects.length)
		}
		else if (filteredProjects && filteredProjects.length > 0) {
			updateVisiblePages(pageNumber, filteredProjects.length)
		}
		
		 else {
			updateVisiblePages(pageNumber, projects.length)
		}
	}

	const handleRowClick = (project: Project) => {
		setSelectedProject(project)
	}

	const handleEdit = (project: Project) => {
		setSelectedProject(project)
		fetch(`${BaseUrl}/updateSignal`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(editProject),
		})
			.then((response) => {
				if (response.ok) {
					fetchProjects()
					toast.success('Script updated successfully')
					handleCloseModal()
				} else {
					toast.error('Failed to updated script')
				}
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)

	const handleSignalClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		project: Project
	) => {
		handleDeleteClick(project)

		setShowConfirmationDialog(true)
	}

	const handleDeleteClick = (project: Project) => {
		setSelectedProjectToDelete(project)
	}

	const handleConfirmDelete = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		project: Project
	) => {
		setShowConfirmationDialog(false)
		handleDelete(e)
	}

	const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		const scriptToDelete = selectedProjectToDelete?.script_id

		if (!scriptToDelete) {
			toast.error('No project selected for deletion')
			return
		}

		fetch(`${BaseUrl}/deleteSignal`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ script_id: scriptToDelete }),
		})
			.then((response) => {
				if (response.ok) {
					fetchProjects()
					toast.success('Script deleted successfully')
					handleAddModalClose()
					setSelectedProjectToDelete(null)
				} else {
					toast.error('Failed to delete script')
				}
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	const handleAddClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation()
		setShowAddModal(true)
	}

	const handleAddModalClose = () => {
		setShowAddModal(false)
	}

	const [newProject, setNewProject] = useState({
		script: '',
		trigger_price: '',
		created_on: '',
		alert_name: '',
		action: '',
	})

	const handleInputChange = (name:any, value:any) => {
		setNewProject({
			...newProject,
			[name]: value,
		})
	}

	const handleAddProject = () => {
		fetch(`${BaseUrl}/addSignal`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newProject),
		})
			.then((response) => {
				if (response.ok) {
					fetchProjects()
					toast.success('New Script added successfully')
					handleAddModalClose()
				} else {
					toast.error('Failed to add script')
				}
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	const [editProject, setEditProject] = useState({
		script_id: '',
		trigger_price: '',
		action: '',
	})

	useEffect(() => {
		setEditProject((prevState) => ({
			...prevState,
			script_id: selectedProject?.script_id,
			trigger_price: selectedProject?.trigger_price,
			action: selectedProject?.buy_sell,
		}))
	}, [selectedProject])

	const handleEditInputChange = (name, value) => {
		setEditProject({
			...editProject,
			[name]: value,
		})
	}

	const indexOfLastItem = currentPage * 5
	const indexOfFirstItem = indexOfLastItem - 5
	const filteredProjectsByDate =
		filteredByDateProjects.length > 0 ? filteredByDateProjects : []
	const filteredProjectsByDefault =
		filteredProjects.length > 0 ? filteredProjects : []
	const allProjects = projects.length > 0 ? projects : []

	const allFilteredProjects =
		filteredProjectsByDate.length > 0
			? filteredProjectsByDate
			: filteredProjectsByDefault.length > 0
				? filteredProjectsByDefault
				: allProjects

	// .concat(filteredProjectsByDefault)
	// .concat(allProjects)

	const currentItems = allFilteredProjects.slice(
		indexOfFirstItem,
		indexOfLastItem
	)

	// const currentItems =
	// 	filteredByDateProjects.slice(indexOfFirstItem, indexOfLastItem) ||
	// 	filteredProjects.slice(indexOfFirstItem, indexOfLastItem) ||
	// 	projects.slice(indexOfFirstItem, indexOfLastItem)

	const getTokenFromLocalStorage = () => {
		const authData = localStorage.getItem('_CREBOT_AUTH')

		if (authData) {
			try {
				const parsedAuthData = JSON.parse(authData)
				return parsedAuthData.token
			} catch (error) {
				console.error('Error parsing auth data:', error)
				return null
			}
		} else {
			return null
		}
	}

	const isAdmin = () => {
		const token = getTokenFromLocalStorage()
		if (token) {
			const decodedToken = decodeToken(token)
			return decodedToken.role === 'admin'
		}
		return false
	}

	const decodeToken = (token: string) => {
		try {
			const base64Url = token.split('.')[1]
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
			const decodedData = JSON.parse(atob(base64))
			return decodedData
		} catch (error) {
			console.error('Error decoding token:', error)
			return {}
		}
	}

	if (!isAdmin()) {
		return (
			<div className="auth-message">
				<p>You are not authorized to view this page.</p>
			</div>
		)
	}
	const [showConfirmationPublishDialog, setShowConfirmationPublishDialog] =
		useState(false)
	// const [publishStatus, setPublishStatus] = useState('')
	const [selectedProjectToPublish, setSelectedProjectToPublish] =
		useState<Project | null>(null)

	const handlePublishClick = async (project: Project) => {
		await setSelectedProjectToPublish(project)
		await fetchSignalStatus()
		setShowConfirmationPublishDialog(true)
	}

	const fetchSignalStatus = async () => {
		try {
			const scriptId = selectedProjectToPublish?.script_id
			const response = await fetch(
				`${BaseUrl}/getPublishStatus?script_id=${scriptId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			if (response.ok) {
				const data = await response.json()
				fetchProjects()
				setPublishStatus(data[0]?.is_published)
			} else {
				throw new Error('Failed to update publish status')
			}
		} catch (error) {
			console.error('Error updating publish status:', error)
		}
	}

	const handleSwitchToggle = async (event:any, project: Project) => {
		event.stopPropagation()
		await handlePublishClick(project)
		const switchvalue =
			selectedProjectToPublish?.is_published === 'Y' ? 'N' : 'Y'
		setShowConfirmationPublishDialog(true)
		const script_id = selectedProjectToPublish?.script_id
		await fetch(`${BaseUrl}/updatePublish`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				script_id: script_id,
				is_publish: switchvalue,
			}),
		})
			.then((response) => {
				if (response.ok) {
					fetchProjects()
					setShowConfirmationPublishDialog(false)
					if (switchvalue === 'Y') {
						toast.success('The record has been successfully published.')
					} else {
						toast.success('The record has been successfully unpublished.')
					}
				} else {
					throw new Error('Failed to update publish status')
				}
			})
			.catch((error) => {
				console.error('Error updating publish status:', error)
			})
	}

	const adjustedTriggerPrices = currentItems.map((project) =>
		(project.trigger_price - project.trigger_price * 0.02).toFixed(2)
	)
	const TargetTriggerPrices = currentItems.map((project) =>
		(project.trigger_price * 1.05).toFixed(2)
	)

	return (
		<CustomCardPortlet cardTitle="Projects" titleClass="header-title">
			{/* <Form.Group controlId="formSearch">
           <Form.Control
          type="text"
          placeholder="Search by script name..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </Form.Group> */}

			<Modal show={showConfirmationPublishDialog} onHide={handleAddModalClose}>
				<div>
					<Modal.Header>
						<Modal.Title>Confirm</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h3>
							{selectedProjectToPublish?.is_published === 'N'
								? 'Are you sure you want to publish this record?'
								: 'Are you sure you want to unpublish this record?'}
						</h3>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant={
								selectedProjectToPublish?.is_published === 'N'
									? 'primary'
									: 'danger'
							}
							onClick={handleSwitchToggle}>
							{selectedProjectToPublish?.is_published === 'N'
								? 'Publish'
								: 'Unpublish'}
						</Button>
						<Button
							variant="dark"
							onClick={() => setShowConfirmationPublishDialog(false)}>
							Cancel
						</Button>
					</Modal.Footer>
				</div>
			</Modal>

			<Modal show={showConfirmationDialog} onHide={handleAddModalClose}>
				<div>
					<Modal.Header>
						<Modal.Title>Confirm</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h3>Are you sure you want to delete this record?</h3>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="danger" onClick={handleConfirmDelete}>
							Confirm
						</Button>
						<Button onClick={() => setShowConfirmationDialog(false)}>
							Cancel
						</Button>
					</Modal.Footer>
				</div>
			</Modal>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: '20px',
					marginRight: '15px',
				}}>
				{/* <h2 style={{ display: 'flex' }}>ADMIN</h2> */}
				{/* <div className="navbar-custom"> */}
				<div className="topbar">
					<div className="d-flex align-items-center">
						<div className="app-search d-flex justify-content-end  d-lg-block">
							<form className="d-flex justify-content-end ">
								<div className="input-group">
									<input
										type="search"
										className="form-control"
										placeholder="Search..."
										onChange={handleSearch}
									/>
									<span className="ri-search-line search-icon text-muted" />
								</div>
							</form>
						</div>
					</div>
				</div>

				{/* </div> */}
				<div>
					<Button
						variant="primary"
						style={{ cursor: 'pointer', margin: '0' }}
						onClick={toggleFilterModal}>
						<FaFilter /> Filter
					</Button>
					&nbsp;
					<Button
						variant="primary"
						style={{ cursor: 'pointer', margin: '0' }}
						onClick={handleAddClick}>
						Add New Script
					</Button>
				</div>
			</div>
			<Modal show={showFilterModal} onHide={toggleFilterModal}>
				<Modal.Header closeButton>
					<Modal.Title>Filter</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* Form inputs for filtering criteria */}
					{/* Date */}
					<Form.Group controlId="formDate1">
						<Form.Label>FROM</Form.Label>
						<Form.Control
							type="date"
							value={filterCriteria.date}
							onChange={(e) =>
								setFilterCriteria({ ...filterCriteria, date: e.target.value })
							}
						/>
					</Form.Group>
					<Form.Group controlId="formDate1">
						<Form.Label>TO</Form.Label>
						<Form.Control
							type="date"
							value={filterCriteria.date2}
							onChange={(e) =>
								setFilterCriteria({ ...filterCriteria, date2: e.target.value })
							}
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					{/* Apply and Close buttons */}
					<Button variant="primary" onClick={applyFilters}>
						Apply
					</Button>
					<Button variant="secondary" onClick={toggleFilterModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showAddModal} onHide={handleAddModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>New_Script</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formScript">
							<Form.Label>Script Name</Form.Label>
							<Form.Control
								type="text"
								name="script"
								value={newProject.script}
								onChange={(e) => handleInputChange('script', e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="formPrice">
							<Form.Label>Price</Form.Label>
							<Form.Control
								type="number"
								name="trigger_price"
								value={newProject.trigger_price}
								onChange={(e) =>
									handleInputChange('trigger_price', e.target.value)
								}
							/>
						</Form.Group>
						<Form.Group controlId="formAction">
							<Form.Label>Buy/Sell</Form.Label>
							<Form.Select
								name="action"
								value={newProject.action}
								onChange={(e) => handleInputChange('action', e.target.value)}>
								<option value="">Select...</option>
								<option value="buy">Buy</option>
								<option value="sell">Sell</option>
							</Form.Select>
						</Form.Group>

						<Form.Group controlId="formAlert">
							<Form.Label>Alert Name</Form.Label>
							<Form.Control
								type="text"
								name="alert_name"
								value={newProject.alert_name}
								onChange={(e) =>
									handleInputChange('alert_name', e.target.value)
								}
							/>
						</Form.Group>

						<Form.Group controlId="formCreatedOn">
							<Form.Label>Triggered On</Form.Label>
							<Form.Control
								type="text"
								name="created_on"
								value={newProject.created_on}
								onChange={(e) =>
									handleInputChange('created_on', e.target.value)
								}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleAddModalClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleAddProject}>
						Add
					</Button>
				</Modal.Footer>
			</Modal>
			<Table hover responsive className="table-nowrap mb-0">
				<thead>
					<tr>
						<th>I_D</th>
						<th>SYMBOL</th>
						<th>STATUS</th>
						<th>SIDE</th>
						<th>TRIGGERED PRICE</th>
						<th>CURRENT PRICE</th>
						<th>TARGET PRICE</th>
						<th>STOP LOSS</th>
						<th>TRIGGERED ON</th>
						<th>PROFIT %</th>
						<th>NIFTY_200</th>
						<th>NIFTY_500</th>
						<th>ALERT NAME</th>
						<th>ACTION</th>
						<th>PUBLISH</th>
					</tr>
				</thead>
				<tbody style={{ cursor: 'pointer',textAlign: 'center' }}>
					{currentItems.map((project, idx) => (
						<tr key={idx}>
							<td>{project.script_id}</td>
							<td>{project.script}</td>
							<td>
								<span
									className="badge"
									style={{
										fontSize: '13px',
										backgroundColor:
											project.alert_name === 'intraday_sell_1'
												? formatProfitPercentageIntradaySellstatus(
														project.profit_percentage
													) >= -2 &&
													formatProfitPercentageIntradaySellstatus(
														project.profit_percentage
													) <= 5
													? 'green'
													: '#000000'
												: formatProfitPercentagestatus(
															project.profit_percentage
													  ) >= -2 &&
													  formatProfitPercentagestatus(
															project.profit_percentage
													  ) <= 5
													? 'green'
													: '#000000',
									}}>
									{/* {project.is_closed === 'N' ? 'Open' : 'Closed'} */}
									{project.alert_name === 'intraday_sell_1'
										? formatProfitPercentageIntradaySellstatus(
												project.profit_percentage
											) >= -2 &&
											formatProfitPercentageIntradaySellstatus(
												project.profit_percentage
											) <= 5
											? 'Open'
											: 'Closed'
										: formatProfitPercentagestatus(project.profit_percentage) >=
													-2 &&
											  formatProfitPercentagestatus(
													project.profit_percentage
											  ) <= 5
											? 'Open'
											: 'Closed'}
																						
								</span>
							</td>

							<td>
								<span
									className="badge"
									style={{
										fontSize: '13px',
										backgroundColor:
											project.alert_name === 'intraday_sell_1'
												? 'red'
												: project.alert_name === 'best_buy_for_intraday' ||
													  project.alert_name === 'swing_trading_1' ||
													  project.alert_name === 'intraday_5min_buy_915'
													? 'green'
													: 'grey',
									}}>
									{project.alert_name === 'intraday_sell_1'
										? 'Sell'
										: project.alert_name === 'best_buy_for_intraday' ||
											  project.alert_name === 'swing_trading_1' ||
											  project.alert_name === 'intraday_5min_buy_915'
											? 'Buy'
											: 'N/A'}
								</span>
							</td>
							<td>{project.trigger_price}</td>
							<td>
								<strong>{project.current_price}</strong>
							</td>
							<td>{TargetTriggerPrices[idx]}</td>
							<td>{adjustedTriggerPrices[idx]}</td>
							<td>
								{formatDate(project.created_on)} {project.triggered_at}
							</td>
							<td>
								{project.alert_name === 'intraday_sell_1'
									? formatProfitPercentageIntradaySell(
											project.profit_percentage
										)
									: formatProfitPercentage(project.profit_percentage)}
							</td>

							{/* <td>
								{project.source === 'Both' || project.source === 'Nifty_200' ? "Yes" : "No"}
							</td>
							<td>
								{project.source === 'Both' || project.source === 'Nifty_500' ? "Yes" : "No"}
							</td> */}
							<td>
								<input
									type="checkbox"
									checked={
										project.source === 'Both' || project.source === 'Nifty_200'
									}
									style={{
										backgroundColor:
											project.source === 'Both' ||
											project.source === 'Nifty_200'
												? 'green'
												: 'inherit',
									}}
									readOnly
								/>
							</td>

							<td>
								<input
									type="checkbox"
									checked={
										project.source === 'Both' || project.source === 'Nifty_500'
									}
									style={{
										backgroundColor:
											project.source === 'Both' ||
											project.source === 'Nifty_500'
												? 'green'
												: 'inherit',
									}}
									readOnly
								/>
							</td>

							<td>
								{project.alert_name.length > 5
									? `${project.alert_name.slice(0, 13)}..`
									: project.alert_name}
							</td>

							<td>
								<div
									style={{ display: 'flex', justifyContent: 'space-evenly' }}>
									<FaEdit
										className="action-icon"
										onClick={() => handleRowClick(project)}
									/>
									<FaTrash
										className="action-icon"
										onClick={(e) => handleSignalClick(e, project)}
									/>
								</div>
							</td>
							<td>
								<Form.Check
									type="switch"
									id={`publish-switch-${project.script_id}`}
									label=""
									checked={project.is_published === 'Y'}
									onChange={() => handlePublishClick(project)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			<div
				className="pagination-wrapper"
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: '20px',
				}}>
				<Pagination>
					<Pagination.Prev
						onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
						disabled={currentPage === 1}
					/>
					{visiblePages.map((page) => (
						<Pagination.Item
							key={page}
							active={page === currentPage}
							onClick={() => handlePageChange(page)}>
							{page}
						</Pagination.Item>
					))}
					<Pagination.Next
						onClick={() =>
							handlePageChange(
								Math.min(
									currentPage + 1,
									Math.ceil(
										filteredProjects && filteredProjects.length > 0
											? filteredProjects.length / 5
											: filteredByDateProjects &&
												  filteredByDateProjects.length > 0
												? filteredByDateProjects.length / 5
												: projects.length / 5
									)
								)
							)
						}
						disabled={
							currentPage ===
							Math.ceil(
								filteredProjects && filteredProjects.length > 0
									? filteredProjects.length / 5
									: filteredByDateProjects && filteredByDateProjects.length > 0
										? filteredByDateProjects.length / 5
										: projects.length / 5
							)
						}
					/>
				</Pagination>
			</div>
			<Modal show={selectedProject !== null} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Script</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedProject && (
						<Form>
							<Form.Group controlId="formScript">
								<Form.Label>Script Name</Form.Label>
								<Form.Control
									type="text"
									value={selectedProject.script}
									onChange={(e) =>
										handleEditInputChange('script', e.target.value)
									}
									readOnly
								/>
							</Form.Group>
							{/* <Form.Group controlId="formAction">
								<Form.Label>Buy/Sell</Form.Label>
								<Form.Select
									name="action"
									value={editProject.action}
									onChange={(e) =>
										handleEditInputChange('action', e.target.value)
									}>
									<option value="">Select...</option>
									<option value="buy">Buy</option>
									<option value="sell">Sell</option>
								</Form.Select>
							</Form.Group> */}
							<Form.Group controlId="formPrice">
								<Form.Label>Price</Form.Label>
								<Form.Control
									type="number"
									name="trigger_price"
									value={editProject.trigger_price}
									onChange={(e) =>
										handleEditInputChange('trigger_price', e.target.value)
									}
								/>
							</Form.Group>

							<Form.Group controlId="formAlert">
								<Form.Label>Alert</Form.Label>
								<Form.Control
									type="text"
									value={selectedProject.alert_name}
									onChange={(e) =>
										handleEditInputChange('alert_name', e.target.value)
									}
									readOnly
								/>
							</Form.Group>
						</Form>
					)}
				</Modal.Body>
				<Modal.Footer style={{ display: 'flex', justifyContent: 'flex-start' }}>
					<Button variant="primary" onClick={handleEdit}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</CustomCardPortlet>
	)
}

export default Admin
