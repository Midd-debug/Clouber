import { useState } from "react";
import { Input, Button, Box } from "@chakra-ui/react";
import { loginUser, setToken } from "../api/api";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handleSubmit = async () => {
  
  navigate("/chat"); // redirige a chat después de login
};
export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await loginUser({ username, password });
      const { access_token } = res.data;
      setToken(access_token);
      onLogin(access_token, "estudiante"); // cambiar según tu rol real
    } catch (err) {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Box mb={4}>
      <Input placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} mb={2} />
      <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} mb={2} />
      <Button onClick={handleSubmit}>Login</Button>
    </Box>
  );
}
