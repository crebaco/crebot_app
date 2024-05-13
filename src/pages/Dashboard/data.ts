import profilePic from '@/assets/images/users/avatar-1.jpg'
import profilePic2 from '@/assets/images/users/avatar-5.jpg'
import { ReactNode } from 'react'

interface Statistic {
	title: string
	stats: string
	change: string
	icon: string
	variant: string
}

interface ProjectData {
	id: number;
  buy: string;
  buyValue: string;
  price: number;
  currValue: number;
  triggerTime: string;
  profit: number;
  alert: string; // Make sure to include the 'alert' property
  status: string;
}
export const statistics: Statistic[] = [
	{
		title: 'Daily Visits',
		stats: '8,652',
		change: '2.97%',
		icon: 'ri-eye-line',
		variant: 'text-bg-pink',
	},
	{
		title: 'Revenue',
		stats: '$9,254.62',
		change: '18.25%',
		icon: 'ri-wallet-2-line',
		variant: 'text-bg-purple',
	},
	{
		title: 'Orders',
		stats: '753',
		change: '-5.75%',
		icon: 'ri-shopping-basket-line',
		variant: 'text-bg-info',
	},
	{
		title: 'Users',
		stats: '63,154',
		change: '8.21%',
		icon: 'ri-group-2-line',
		variant: 'text-bg-primary',
	},
]

export const chatMessages = [
	{
		id: 1,
		userPic: profilePic2,
		userName: 'Geneva',
		text: 'Hello!',
		postedOn: '10:00',
	},
	{
		id: 2,
		userPic: profilePic,
		userName: 'Thomson',
		text: 'Hi, How are you? What about our next meeting?',
		postedOn: '10:01',
	},
	{
		id: 3,
		userPic: profilePic2,
		userName: 'Geneva',
		text: 'Yeah everything is fine',
		postedOn: '10:02',
	},
	{
		id: 4,
		userPic: profilePic,
		userName: 'Thomson',
		text: "Wow that's great!",
		postedOn: '10:03',
	},
	{
		id: 5,
		userPic: profilePic2,
		userName: 'Geneva',
		text: 'Cool!',
		postedOn: '10:03',
	},
]

export const projects: ProjectData[] = [
	{
		id: 1,
		buy: "Company A",
		buyValue: "Buy",
		price: 100,
		currValue: 120,
		triggerTime: "2024-04-25",
		profit: 20,
		alert: "High",
		status: "Active"
	  },
	  {
		id: 2,
		buy: "Company B",
		buyValue: "Sell",
		price: 150,
		currValue: 130,
		triggerTime: "2024-04-24",
		profit: -20,
		alert: "Low",
		status: "Inactive"
	  },
	  {
		id: 3,
		buy: "Company A",
		buyValue: "Buy",
		price: 100,
		currValue: 120,
		triggerTime: "2024-04-25",
		profit: 20,
		alert: "High",
		status: "Active"
	  },
	  {
		id: 4,
		buy: "Company B",
		buyValue: "Sell",
		price: 150,
		currValue: 130,
		triggerTime: "2024-04-24",
		profit: -20,
		alert: "Low",
		status: "Inactive"
	  },
	  {
		id: 5,
		buy: "Company A",
		buyValue: "Buy",
		price: 100,
		currValue: 120,
		triggerTime: "2024-04-25",
		profit: 20,
		alert: "High",
		status: "Active"
	  },
	  {
		id: 6,
		buy: "Company B",
		buyValue: "Sell",
		price: 150,
		currValue: 130,
		triggerTime: "2024-04-24",
		profit: -20,
		alert: "Low",
		status: "Inactive"
	  },
	  {
		id: 7,
		buy: "Company A",
		buyValue: "Buy",
		price: 100,
		currValue: 120,
		triggerTime: "2024-04-25",
		profit: 20,
		alert: "High",
		status: "Active"
	  },
	  {
		id: 8,
		buy: "Company B",
		buyValue: "Sell",
		price: 150,
		currValue: 130,
		triggerTime: "2024-04-24",
		profit: -20,
		alert: "Low",
		status: "Inactive"
	  },
]
