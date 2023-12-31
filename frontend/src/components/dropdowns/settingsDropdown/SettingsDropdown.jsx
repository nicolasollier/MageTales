import { useState, useEffect, useRef, useContext } from "react";
import { logoutUser } from "../../../utils/authApi";
import { deleteConversation } from "../../../utils/localApi";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../../contexts/PlayerContext";
import { SidePanelContext } from "../../../contexts/SidePanelContext";
import SettingsIcon from "../../icons/SettingsIcon";
import styles from "./SettingsDropdown.module.scss";

const SettingsDropdown = () => {
  const navigate = useNavigate();

  const { toggleSidePanel } = useContext(SidePanelContext);
  const { clearPlayerInfos } = useContext(PlayerContext);
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleRemoveConversation = async () => {
    setIsOpen(false);
    clearPlayerInfos();
    await deleteConversation();
    navigate("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={styles.dropdown__button}
        onClick={() => setIsOpen(!isOpen)}
      >
        <SettingsIcon className={styles.button__icon} />
      </button>
      {isOpen && (
        <div className={styles.dropdown__menu}>
          <ul className={styles.dropdown__menu__list}>
            <li className={styles.dropdown__menu__list__item}>
              <span onClick={() => toggleSidePanel()}>Fiche personnage</span>
            </li>
            <li className={styles.dropdown__menu__list__item}>
              <span onClick={() => handleRemoveConversation()}>
                Recommencer
              </span>
            </li>
            <li
              className={`${styles.dropdown__menu__list__item} ${styles.danger}`}
            >
              <span onClick={() => logoutUser()}>Déconnection</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
