
import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function App() {
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "" });

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckout = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        name: form.name,
        email: form.email,
        address: form.address,
        cart,
        total: cart.reduce((acc, item) => acc + item.price, 0),
        createdAt: Timestamp.now()
      });
      alert("Pedido confirmado y guardado. ¡Gracias por tu compra!");
    } catch (error) {
      alert("Hubo un error al guardar el pedido. Intenta nuevamente.");
      console.error("Firebase error:", error);
    }

    setCart([]);
    setForm({ name: "", email: "", address: "" });
    setCheckout(false);
  };

  const products = [
    { id: 1, name: "Sweater NAREA", price: 27000 },
    { id: 2, name: "Conjunto Otoñal", price: 32000 },
    { id: 3, name: "Accesorios", price: 5000 },
  ];

  return (
    <main className="min-h-screen bg-[#f8f4f0] text-[#333]">
      <section className="text-center py-12">
        <h1 className="text-4xl font-serif text-[#6e5849]">El otoño se acerca</h1>
        <p className="text-lg mt-4">Descubrí la colección más sofisticada para esta temporada</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-16 py-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-md p-4">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <h3 className="mt-4 font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-600">${product.price.toLocaleString()}</p>
            <button
              className="mt-2 bg-[#6e5849] text-white py-1 px-4 rounded-full"
              onClick={() => addToCart(product)}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </section>

      <section className="bg-[#f1ede9] py-8 px-6 md:px-24">
        <h2 className="text-2xl font-serif text-[#6e5849] mb-4">Carrito</h2>
        {cart.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="text-gray-700">
              {cart.map((item, index) => (
                <li key={index} className="mb-2 flex justify-between">
                  <span>{item.name} - ${item.price.toLocaleString()}</span>
                  <button
                    className="text-red-500 text-sm ml-4"
                    onClick={() => removeFromCart(index)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
            <p className="font-semibold mt-4">
              Total: ${cart.reduce((acc, item) => acc + item.price, 0).toLocaleString()}
            </p>
            <button
              className="mt-4 bg-[#6e5849] text-white py-1 px-4 rounded-full"
              onClick={() => setCheckout(true)}
            >
              Finalizar compra
            </button>
          </>
        )}
      </section>

      {checkout && (
        <section className="bg-white py-10 px-6 md:px-24">
          <h2 className="text-2xl font-serif text-[#6e5849] mb-4">Completar datos</h2>
          <form className="grid gap-4 max-w-xl">
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              className="border rounded-xl p-2"
              value={form.name}
              onChange={handleFormChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="border rounded-xl p-2"
              value={form.email}
              onChange={handleFormChange}
            />
            <textarea
              name="address"
              placeholder="Dirección completa"
              className="border rounded-xl p-2"
              value={form.address}
              onChange={handleFormChange}
            />
            <button
              type="button"
              className="bg-[#6e5849] text-white py-2 px-4 rounded-full"
              onClick={handleCheckout}
            >
              Confirmar pedido
            </button>
          </form>
        </section>
      )}

      <footer className="bg-[#dcd6cf] text-center py-6 mt-12 text-sm text-gray-700">
        © 2025 NAREA - Moda minimalista & sofisticada
      </footer>
    </main>
  );
}
