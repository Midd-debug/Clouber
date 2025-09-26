import { useState } from "react";
import { Input, Button, Box, Select } from "@chakra-ui/react";
import { registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handleSubmit = async () => 

  navigate("/chat"); // redirige a chat después de logi
  navigate("/login");
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("estudiante");
  const [teacher, setTeacher] = useState("");

  const handleSubmit = async () => {
    try {
      await registerUser({ username, email, password, role, teacher_username: teacher });
      alert("Usuario registrado!");
    } catch (err) {
      alert("Error al registrar usuario");
    }
  };

  return (
    <Box mb={4}>
      <Input placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} mb={2} />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} mb={2} />
      <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} mb={2} />
      <Select value={role} onChange={(e) => setRole(e.target.value)} mb={2}>
        <option value="estudiante">Estudiante</option>
        <option value="docente">Docente</option>
      </Select>
      {role === "estudiante" && <Input placeholder="Usuario del docente" value={teacher} onChange={(e) => setTeacher(e.target.value)} mb={2} />}
      <Button onClick={handleSubmit}>Registrar</Button>
    </Box>
  );
}
