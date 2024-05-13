import React, { useState, useEffect } from 'react'
import { Table, Pagination, Tab, Tabs } from 'react-bootstrap'
import { CustomCardPortlet } from '@/components'
import '../../assets/scss/userTable.scss'
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
	signalType: string
}

const Projects = () => {
	const BaseUrl = config.BaseUrl
	const [projects, setProjects] = useState<Project[]>([])
	const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({
		swingTrading: 1,
		intradayBuy: 1,
		intradaySell: 1,
	})
	const [visiblePages, setVisiblePages] = useState<{ [key: string]: number[] }>(
		{
			swingTrading: [],
			intradayBuy: [],
			intradaySell: [],
		}
	)
	const [activeTab, setActiveTab] = useState<string>('swingTrading')
	const [searchQuery, setSearchQuery] = useState('')

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
	}

	const filteredProjects = projects.filter((project) =>
		project.script.toLowerCase().includes(searchQuery.toLowerCase())
	)

	useEffect(() => {
		fetchProjects()
	}, [searchQuery])

	const fetchProjects = async () => {
		try {
			const response = await fetch(`${BaseUrl}/getPublishedSignal`)
			const data = await response.json()
			setProjects(data)
		} catch (error) {
			console.error('Error fetching projects:', error)
		}
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const day = date.getDate().toString().padStart(2, '0') // Pad single-digit days with leading zero
		const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based
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

	const updateVisiblePages = (tab: string, page: number) => {
		let totalPages = 0
		if (tab === 'swingTrading') {
			totalPages = Math.ceil(
				filteredProjects.filter((item) =>
					item.alert_name.includes('swing_trading_1')
				).length / 5
			)
		} else if (tab === 'intradayBuy') {
			totalPages = Math.ceil(
				filteredProjects.filter(
					(item) =>
						item.alert_name.includes('intraday_5min_buy_915') ||
						item.alert_name.includes('best_buy_for_intraday')
				).length / 5
			)
		} else if (tab === 'intradaySell') {
			totalPages = Math.ceil(
				filteredProjects.filter((item) =>
					item.alert_name.includes('intraday_sell_1')
				).length / 5
			)
		}

		let startPage = Math.max(1, page - 1)
		let endPage = Math.min(startPage + 2, totalPages)

		if (endPage - startPage < 2) {
			startPage = Math.max(1, endPage - 2)
		}

		setVisiblePages({
			...visiblePages,
			[tab]: [...Array(endPage - startPage + 1).keys()].map(
				(i) => i + startPage
			),
		})
	}

	const handlePageChange = (tab: string, pageNumber: number) => {
		setCurrentPage({ ...currentPage, [tab]: pageNumber })
		updateVisiblePages(tab, pageNumber)
	}

	const handlePrevClick = (tab: string) => {
		const currentPageNumber = currentPage[tab]
		if (currentPageNumber > 1) {
			handlePageChange(tab, currentPageNumber - 1)
		}
	}

	const handleNextClick = (tab: string) => {
		const totalPages =
			tab === 'swingTrading'
				? Math.ceil(
						filteredProjects.filter((item) =>
							item.alert_name.includes('swing_trading_1')
						).length / 5
					)
				: tab === 'intradayBuy'
					? Math.ceil(
							filteredProjects.filter(
								(item) =>
									item.alert_name.includes('intraday_5min_buy_915') ||
									item.alert_name.includes('best_buy_for_intraday')
							).length / 5
						)
					: Math.ceil(
							filteredProjects.filter((item) =>
								item.alert_name.includes('intraday_sell_1')
							).length / 5
						)
		const currentPageNumber = currentPage[tab]
		if (currentPageNumber < totalPages) {
			handlePageChange(tab, currentPageNumber + 1)
		}
	}

	const indexOfLastItem = currentPage[activeTab] * 5 // Display 5 items per page
	const indexOfFirstItem = indexOfLastItem - 5 // Display 5 items per page

	let displayedProjects: Project[] = []
	if (activeTab === 'swingTrading') {
		displayedProjects = filteredProjects.filter((item) =>
			item.alert_name.includes('swing_trading_1')
		)
	} else if (activeTab === 'intradayBuy') {
		displayedProjects = filteredProjects.filter(
			(item) =>
				item.alert_name.includes('intraday_5min_buy_915') ||
				item.alert_name.includes('best_buy_for_intraday')
		)
	} else if (activeTab === 'intradaySell') {
		displayedProjects = filteredProjects.filter((item) =>
			item.alert_name.includes('intraday_sell_1')
		)
	}

	const currentItems = displayedProjects.slice(
		indexOfFirstItem,
		indexOfLastItem
	)

	const adjustedTriggerPrices = currentItems.map((project) =>
		(project.trigger_price - project.trigger_price * 0.02).toFixed(2)
	)
	const TargetTriggerPrices = currentItems.map((project) =>
		(project.trigger_price * 1.05).toFixed(2)
	)

	return (
		<CustomCardPortlet cardTitle="Projects" titleClass="header-title">
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
			<br></br>
			<Tabs
				id="signal-tabs"
				activeKey={activeTab}
				onSelect={(key: string) => setActiveTab(key)}
				className="mb-3">
				<Tab eventKey="swingTrading" title="Swing Trading">
					<Table hover responsive className="table-nowrap mb-0">
						<thead>
							<tr>
								<th>STOCK NAME</th>
								<th>RECOMMENDED PRICE</th>
								<th>TARGET UPSIDE</th>
								<th>STOP LOSS</th>
								<th>DURATION</th>
								<th>ACTION ZONE</th>
								<th>DATE OF RECOMMENDATION</th>
							</tr>
						</thead>
						<tbody style={{ cursor: 'pointer',textAlign: 'center' }}>
							{currentItems.map((project, idx) => (
								<tr key={idx}>
									<td>{project.script}</td>
									<td><strong>{project.trigger_price}</strong></td>
									<td>{TargetTriggerPrices[idx]} <span style={{ color: 'green' }}>&#9650;</span> 5.0%</td>
									<td>{adjustedTriggerPrices[idx]}</td>
									<td>{"3 - 4 Weeks"}</td>
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
									<td>
										{formatDate(project.created_on)} {project.triggered_at}
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
								onClick={() => handlePrevClick('swingTrading')}
								disabled={currentPage.swingTrading === 1}
							/>
							{visiblePages.swingTrading.map((page) => (
								<Pagination.Item
									key={page}
									active={page === currentPage.swingTrading}
									onClick={() => handlePageChange('swingTrading', page)}>
									{page}
								</Pagination.Item>
							))}
							<Pagination.Next
								onClick={() => handleNextClick('swingTrading')}
								disabled={
									currentPage.swingTrading ===
									Math.ceil(
										filteredProjects.filter((item) =>
											item.alert_name.includes('swing_trading_1')
										).length / 5
									)
								}
							/>
						</Pagination>
					</div>
				</Tab>
				<Tab eventKey="intradayBuy" title="Intraday Buy">
					<Table hover responsive className="table-nowrap mb-0">
					<thead>
							<tr>
								<th>STOCK NAME</th>
								<th>RECOMMENDED PRICE</th>
								<th>TARGET UPSIDE</th>
								<th>STOP LOSS</th>
								<th>DURATION</th>
								<th>ACTION ZONE</th>
								<th>DATE OF RECOMMENDATION</th>
							</tr>
						</thead>
						<tbody style={{ cursor: 'pointer',textAlign: 'center' }}>
							{currentItems.map((project, idx) => (
								<tr key={idx}>
									<td>{project.script}</td>
									<td><strong>{project.trigger_price}</strong></td>
									<td>{TargetTriggerPrices[idx]} <span style={{ color: 'green' }}>&#9650;</span> 5.0%</td>
									<td>{adjustedTriggerPrices[idx]}</td>
									<td>{"3 - 4 Weeks"}</td>
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
									<td>
										{formatDate(project.created_on)} {project.triggered_at}
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
								onClick={() => handlePrevClick('intradayBuy')}
								disabled={currentPage.intradayBuy === 1}
							/>
							{visiblePages.intradayBuy.map((page) => (
								<Pagination.Item
									key={page}
									active={page === currentPage.intradayBuy}
									onClick={() => handlePageChange('intradayBuy', page)}>
									{page}
								</Pagination.Item>
							))}
							<Pagination.Next
								onClick={() => handleNextClick('intradayBuy')}
								disabled={
									currentPage.intradayBuy ===
									Math.ceil(
										filteredProjects.filter(
											(item) =>
												item.alert_name.includes('intraday_5min_buy_915') ||
												item.alert_name.includes('best_buy_for_intraday')
										).length / 5
									)
								}
							/>
						</Pagination>
					</div>
				</Tab>
				<Tab eventKey="intradaySell" title="Intraday Sell">
					<Table hover responsive className="table-nowrap mb-0">
					<thead>
							<tr>
								<th>STOCK NAME</th>
								<th>RECOMMENDED PRICE</th>
								<th>TARGET UPSIDE</th>
								<th>STOP LOSS</th>
								<th>DURATION</th>
								<th>ACTION ZONE</th>
								<th>DATE OF RECOMMENDATION</th>
							</tr>
						</thead>
						<tbody style={{ cursor: 'pointer',textAlign: 'center' }}>
							{currentItems.map((project, idx) => (
								<tr key={idx}>
									<td>{project.script}</td>
									<td><strong>{project.trigger_price}</strong></td>
									<td>{TargetTriggerPrices[idx]} <span style={{ color: 'green' }}>&#9650;</span> 5.0%</td>
									<td>{adjustedTriggerPrices[idx]}</td>
									<td>{"3 - 4 Weeks"}</td>
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
									<td>
										{formatDate(project.created_on)} {project.triggered_at}
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
								onClick={() => handlePrevClick('intradaySell')}
								disabled={currentPage.intradaySell === 1}
							/>
							{visiblePages.intradaySell.map((page) => (
								<Pagination.Item
									key={page}
									active={page === currentPage.intradaySell}
									onClick={() => handlePageChange('intradaySell', page)}>
									{page}
								</Pagination.Item>
							))}
							<Pagination.Next
								onClick={() => handleNextClick('intradaySell')}
								disabled={
									currentPage.intradaySell ===
									Math.ceil(
										filteredProjects.filter((item) =>
											item.alert_name.includes('intraday_sell_1')
										).length / 5
									)
								}
							/>
						</Pagination>
					</div>
				</Tab>
			</Tabs>
		</CustomCardPortlet>
	)
}

export default Projects
