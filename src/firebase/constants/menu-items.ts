import { LucideIcon, Menu } from "lucide-react";
import { Pencil, Trash2, X, Pin } from "lucide-react";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  submenu?: MenuItem[];
  disabled?: boolean;
}

interface MenuGroup {
  items: MenuItem[];
}

interface MenuStructure {
  groups: MenuGroup[];
}

export type { MenuItem, MenuGroup, MenuStructure };

const menuItems: MenuStructure = {
  groups: [
    {
      items: [
        { icon: Pencil, label: "Edit title" },
        { icon: Pin, label: "Pin discussion" },
        { icon: Trash2, label: "Delete" },
        { icon: X, label: "Close discussion" },
      ],
    },
  ],
};

export default menuItems;
