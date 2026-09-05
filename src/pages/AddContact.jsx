import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { contactServices } from "../services/contactServices";

const emptyContact = { name: "", email: "", phone: "", address: "" };

export const AddContact = () => {
  const { store, dispatch } = useGlobalReducer();
  const { contactId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(contactId);

  const [formData, setFormData] = useState(emptyContact);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    const loadExistingContact = async () => {
      if (!isEditing) return;

      let contacts = store.contacts;
      if (contacts.length === 0) {
        try {
          contacts = await contactServices.getContacts();
          dispatch({ type: "set_contacts", payload: contacts });
        } catch (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
      }

      const existing = contacts.find((c) => c.id === parseInt(contactId));
      if (existing) {
        setFormData({
          name: existing.name || "",
          email: existing.email || "",
          phone: existing.phone || "",
          address: existing.address || "",
        });
      } else {
        setError("No se encontró ese contacto.");
      }
      setLoading(false);
    };

    loadExistingContact();
  }, [isEditing, contactId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isEditing) {
        const updated = await contactServices.updateContact(parseInt(contactId), formData);
        dispatch({ type: "update_contact", payload: updated });
      } else {
        const created = await contactServices.createContact(formData);
        dispatch({ type: "add_contact", payload: created });
      }
      navigate("/contact");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4" style={{ maxWidth: "500px" }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h1>{isEditing ? "Editar contacto" : "Nuevo contacto"}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <Link to="/contact" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};