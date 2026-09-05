import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { contactServices } from "../services/contactServices";
import { ContactCard } from "../components/ContactCard";
import { DeleteModal } from "../components/DeleteModal";

export const Contact = () => {
  const { store, dispatch } = useGlobalReducer();
  const [contactToDelete, setContactToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const contacts = await contactServices.getContacts();
      dispatch({ type: "set_contacts", payload: contacts });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await contactServices.deleteContact(contactToDelete.id);
      dispatch({ type: "delete_contact", payload: contactToDelete.id });
    } catch (err) {
      setError(err.message);
    } finally {
      setContactToDelete(null);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="mb-0">Mis contactos</h1>
        <Link to="/addcontact" className="btn btn-success">
          <i className="fa-solid fa-plus me-2"></i>
          Añadir nuevo contacto
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Cargando contactos...</p>}

      {!loading && store.contacts.length === 0 && !error && (
        <p className="text-muted">Todavía no tienes contactos. ¡Añade el primero!</p>
      )}

      {store.contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} onDeleteClick={setContactToDelete} />
      ))}

      <DeleteModal
        contact={contactToDelete}
        onCancel={() => setContactToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};