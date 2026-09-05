import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const ContactCard = ({ contact, onDeleteClick }) => {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h5 className="card-title mb-2">{contact.name}</h5>
          <p className="card-text mb-1 text-secondary">
            <i className="fa-solid fa-location-dot me-2"></i>
            {contact.address || "Sin dirección"}
          </p>
          <p className="card-text mb-1 text-secondary">
            <i className="fa-solid fa-phone me-2"></i>
            {contact.phone || "Sin teléfono"}
          </p>
          <p className="card-text mb-0 text-secondary">
            <i className="fa-solid fa-envelope me-2"></i>
            {contact.email || "Sin email"}
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to={`/addcontact/${contact.id}`} className="btn btn-outline-secondary btn-sm">
            <i className="fa-solid fa-pen"></i> Editar
          </Link>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDeleteClick(contact)}
          >
            <i className="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

ContactCard.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};