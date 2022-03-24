import Button from "@material-ui/core/Button";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const SingleItem = ({ href, icon, label }) => {
  const { pathname } = useLocation();
  const isSelected = `#${pathname}`.includes(href);
  const style = isSelected ? { backgroundColor: "#245c56", color: "#fff" } : {};
  return (
    <li>
      <Button href={href} style={style}>
        <i className={`zmdi zmdi-${icon} zmdi-hc-fw`} />
        <span className="nav-text">
          <span>{label}</span>
        </span>
      </Button>
    </li>
  );
};

const MultiItem = ({ items, hide, label, icon }) => {
  const { pathname } = useLocation();
  let isSelected = false;
  const [isOpen, setIsOpen] = useState(false);
  const pItems = items?.map((item, index) => {
    const selected = `#${pathname}`.includes(item.href) && !item.hide;
    isSelected = isSelected || selected;
    return {
      ...item,
      selected,
    };
  });

  useEffect((_) => {
    setIsOpen(isSelected);
  }, []);

  useEffect(
    (_) => {
      if (!isSelected && isOpen) {
        setIsOpen(false);
      }
      if (isSelected && !isOpen) {
        setIsOpen(true);
      }
    },
    [pathname]
  );
  const style = { backgroundColor: "#245c56", color: "#fff" };
  return (
    <li
      className={`menu ${isOpen && "open"}`}
      style={{
        display: hide ? "none" : "inherit",
      }}
    >
      <a
        onClick={(_) => {
          setIsOpen(!isOpen);
        }}
        style={{ cursor: "pointer" }}
      >
        <i className={`zmdi zmdi-${icon} zmdi-hc-fw`} />
        <span className="nav-text">{label}</span>
      </a>
      <ul className="sub-menu open">
        {pItems.map((item, index) => {
          if (item.hide) return null;
          return (
            <li key={index} style={item.selected ? { ...style } : {}}>
              <Button className="prepend-icon" href={item.href}>
                <span
                  className="nav-text"
                  style={item.selected ? { ...style } : {}}
                >
                  {item.label}
                </span>
              </Button>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

const SideNavContent = (_) => {
  const { UserSession } = useSelector((state) => {
    const { settings, UserSession } = state;
    return {
      UserSession,
      settings,
    };
  });

  return (
    <ul className="nav-menu nav-menu-scrollbar">
      <MultiItem
        hide={!UserSession.visibleInfra}
        label="Infrastructure"
        icon="city"
        items={[
          {
            href: "#/app/edges",
            label: "Clusters",
          },
          {
            href: "#/app/locations",
            label: "Locations",
          },
        ]}
      />
      <div style={{ paddingBottom: "500px" }} />
    </ul>
  );
};

export default SideNavContent;
