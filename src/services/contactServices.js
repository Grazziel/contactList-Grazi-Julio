const BASE_URL = "https://playground.4geeks.com/contact";

const AGENDA_SLUG = "grazi_4geeks_contacts";

const handleResponse = async (resp, errorMessage) => {
  if (!resp.ok) {
    throw new Error(`${errorMessage} (status ${resp.status})`);
  }
  const text = await resp.text();
  return text ? JSON.parse(text) : null;
};

export const contactServices = {
  createAgenda: async () => {
    const resp = await fetch(`${BASE_URL}/agendas/${AGENDA_SLUG}`, {
      method: "POST",
    });
    return handleResponse(resp, "No se pudo crear la agenda");
  },

  getContacts: async () => {
    const resp = await fetch(`${BASE_URL}/agendas/${AGENDA_SLUG}/contacts`);

    if (resp.status === 404) {
      await contactServices.createAgenda();
      return [];
    }

    const data = await handleResponse(resp, "No se pudieron obtener los contactos");
    return data.contacts;
  },

  createContact: async (contact) => {
    const resp = await fetch(`${BASE_URL}/agendas/${AGENDA_SLUG}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    return handleResponse(resp, "No se pudo crear el contacto");
  },

  updateContact: async (id, contact) => {
    const resp = await fetch(`${BASE_URL}/agendas/${AGENDA_SLUG}/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    return handleResponse(resp, "No se pudo actualizar el contacto");
  },

  deleteContact: async (id) => {
    const resp = await fetch(`${BASE_URL}/agendas/${AGENDA_SLUG}/contacts/${id}`, {
      method: "DELETE",
    });
    return handleResponse(resp, "No se pudo eliminar el contacto");
  },
};