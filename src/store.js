export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    // Lista de contactos que vive en el Context y que llenamos desde la API.
    contacts: []
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'add_task':

      const { id, color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    // Reemplaza la lista completa de contactos (por ejemplo tras hacer el fetch inicial).
    case 'set_contacts':
      return {
        ...store,
        contacts: action.payload
      };

    // Agrega un contacto nuevo que ya fue creado en la API.
    case 'add_contact':
      return {
        ...store,
        contacts: [...store.contacts, action.payload]
      };

    // Actualiza en el store el contacto que ya fue editado en la API.
    case 'update_contact':
      return {
        ...store,
        contacts: store.contacts.map((contact) =>
          contact.id === action.payload.id ? action.payload : contact
        )
      };

    // Quita del store el contacto que ya fue borrado en la API.
    case 'delete_contact':
      return {
        ...store,
        contacts: store.contacts.filter((contact) => contact.id !== action.payload)
      };

    case 'set_message':
      return {
        ...store,
        message: action.payload
      };

    default:
      throw Error('Unknown action.');
  }
}