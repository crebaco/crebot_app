import { ReactNode } from 'react'
// import { Breadcrumb, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
// import { Link } from 'react-router-dom'

interface PageTitleProps {
	subName?: string
	title: string
	addedChild?: ReactNode
}
const PageBreadcrumb = ({  title}: PageTitleProps) => {
	return (
		<>
			<Helmet>
				<title>
					{title} | BLUEASTER CAPITAL (CREB@T)
				</title>
			</Helmet>
		</>
	)
}

export default PageBreadcrumb
