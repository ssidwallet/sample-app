import React from "react";

export type GetCredMenuProps = {
  label: string;
  menuItems: string[];
  activeIdx: number;
};

function GetCredMenu({ label, menuItems, activeIdx }: GetCredMenuProps) {
  return (
    <aside className="menu">
      <p className="menu-label">{label}</p>
      <ul className="menu-list">
        {menuItems.map((item, i) => {
          return (
            <li>
              <span className={activeIdx === i ? "is-active" : ""}>{item}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default GetCredMenu;
