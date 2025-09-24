# clean_main.py
input_file = "main.py"       # Archivo que está dando error
output_file = "main_clean.py"  # Nuevo archivo limpio

# Abrir el archivo original en modo binario
with open(input_file, "rb") as f:
    content = f.read()

# Reemplazar todos los null bytes
content_clean = content.replace(b'\x00', b'')

# Guardar contenido limpio en un nuevo archivo
with open(output_file, "wb") as f:
    f.write(content_clean)

print(f"Archivo limpio creado: {output_file}")
