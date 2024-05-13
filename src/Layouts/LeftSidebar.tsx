import { Link } from 'react-router-dom'

//images
import logo from '@/assets/images/logo.png'
import logoDark from '@/assets/images/logo-dark.png'
import logoSm from '@/assets/images/logo-sm.png'
import { getMenuItems } from '@/common'
import AppMenu from './Menu'
import SimpleBar from 'simplebar-react'

import hot1 from '../assets/images/hot1.jpg'
// import animationImage from '../assets/images/feature-card-thumb-1.png'

/* Sidebar content */
const SideBarContent = () => {
	return (
		<>
			<AppMenu menuItems={getMenuItems()} />
			<div className="clearfix" />
		</>
	)
}
const LeftSidebar = () => {
	return (
		<>
			<div
				className="leftside-menu"
				style={{ backgroundImage: `url(${hot1})` }}>
				{/* Brand Logo Light */}
				<Link to="/" className="logo logo-light">
					<span className="logo-lg">
						<img
							src={logo}
							alt="logo"
							style={{ width: '90%', height: 'auto', maxWidth: '500px' }}
						/>
					</span>
					<span className="logo-sm">
						<img src={logoSm} alt="small logo" />
					</span>
					<h1 className="logo-sm" style={{ marginTop: '10px' }}></h1>
				</Link>
				{/* Brand Logo Dark */}
				<a href="index.html" className="logo logo-dark">
					<span className="logo-lg">
						<img src={logoDark} alt="dark logo" />
					</span>
					<span className="logo-sm">
						<img src={logoSm} alt="small logo" />
					</span>
				</a>
				{/* Sidebar -left */}
				<SimpleBar
					className="h-100"
					id="leftside-menu-container"
					data-simplebar="">
					{/*- Sidemenu */}
					<SideBarContent />
					{/*- End Sidemenu */}
					<div className="clearfix" />
				</SimpleBar>
			</div>
		</>
	)
}

export default LeftSidebar
