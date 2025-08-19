import { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/");
      const data = await res.json();
      setMessage(data.msg);
    } catch (error) {
      setMessage("Error al conectar con Clouber 😥");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-white">
      <motion.h1
        className="text-4xl font-bold mb-6 text-blue-400"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Clouber Nica Educativo 🚀
      </motion.h1>

      <motion.button
        onClick={getMessage}
        className="px-6 py-3 bg-blue-500 rounded-2xl shadow-lg hover:bg-blue-600 transition"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        Consultar API
      </motion.button>

      <motion.div
        className="mt-6 p-4 bg-gray-800 rounded-2xl shadow-lg w-full max-w-xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <motion.p
            className="text-gray-400"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Cargando...
          </motion.p>
        ) : (
          <p className="text-lg">{message || "Presiona el botón para hablar con Clouber 😉"}</p>
        )}
      </motion.div>
    </div>
  );
}
