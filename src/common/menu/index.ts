import {
	HORIZONTAL_MENU_ITEMS,
	MENU_ITEMS as DEFAULT_MENU_ITEMS,
	MenuItemTypes,
} from '@/constants/menu'

// Your functions for checking admin status and decoding tokens
const getTokenFromLocalStorage = () => {
	const authData = localStorage.getItem('_CREBOT_AUTH');
  
	if (authData) {
	  try {
		const parsedAuthData = JSON.parse(authData);
		return parsedAuthData.token;
	  } catch (error) {
		console.error('Error parsing auth data:', error);
		return null;
	  }
	} else {
	  return null;
	}
  };
  
  const decodeToken = (token: string) => {
	  try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const decodedData = JSON.parse(atob(base64));
		return decodedData;
	  } catch (error) {
		console.error('Error decoding token:', error);
		return {};
	  }
	};
  
  const isAdmin = () => {
	const token = getTokenFromLocalStorage();
	if (token) {
	  const decodedToken = decodeToken(token);
	  return decodedToken.role === 'admin';
	}
	return false;
  };
  
// const getMenuItems = () => {
// 	// NOTE - You can fetch from server and return here as well
// 	return MENU_ITEMS
// }
const getMenuItems = () => {
	// Make a copy of the default menu items
	const MENU_ITEMS = [...DEFAULT_MENU_ITEMS];
  
	// Check if the user is an admin
	if (isAdmin()) {
	  // If the user is an admin, include the "ADMIN" item in the menu items
	  MENU_ITEMS.push({
		key: 'admin',
		label: 'ADMIN',
		isTitle: false,
		url: '/pages/Admin',
		icon: 'ri-pages-line',
	  });
	}
  
	return MENU_ITEMS;
  };
  

const getHorizontalMenuItems = () => {
	// NOTE - You can fetch from server and return here as well
	return HORIZONTAL_MENU_ITEMS
}

const findAllParent = (
	menuItems: MenuItemTypes[],
	menuItem: MenuItemTypes
): string[] => {
	let parents: string[] = []
	const parent = findMenuItem(menuItems, menuItem.parentKey)

	if (parent) {
		parents.push(parent.key)
		if (parent.parentKey) {
			parents = [...parents, ...findAllParent(menuItems, parent)]
		}
	}
	return parents
}

const findMenuItem = (
	menuItems: MenuItemTypes[] | undefined,
	menuItemKey: MenuItemTypes['key'] | undefined
): MenuItemTypes | null => {
	if (menuItems && menuItemKey) {
		for (let i = 0; i < menuItems.length; i++) {
			if (menuItems[i].key === menuItemKey) {
				return menuItems[i]
			}
			let found = findMenuItem(menuItems[i].children, menuItemKey)
			if (found) return found
		}
	}
	return null
}

export { findAllParent, findMenuItem, getMenuItems, getHorizontalMenuItems }
