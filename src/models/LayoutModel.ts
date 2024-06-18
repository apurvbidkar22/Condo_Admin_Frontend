
export interface ISidebarMenu {
    id: string;
    label: string;
    path?: string;
    icon: string;
    subMenu?: ISidebarSubMenu[];
}

export interface ISidebarSubMenu {
    id: string;
    label: string;
    path: string;
}
