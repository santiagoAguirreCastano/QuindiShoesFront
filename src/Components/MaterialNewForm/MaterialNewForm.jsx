import React, { useState, useRef } from "react";
import axiosClient from "../../api/axion";

export const MaterialNewForm = () => {
  const [material, setMaterial] = useState({
    nombre_material: "",
    material_img: null,
  });
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial({
      ...material,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMaterial((prev) => ({ ...prev, material_img: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setMaterial((prev) => ({ ...prev, material_img: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("nombre_material", material.nombre_material);
      if (material.material_img) {
        formData.append("material_img", material.material_img);
      }

      const response = await axiosClient.post("/material", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("¡Material registrado con éxito!");
      setMaterial({ nombre_material: "", material_img: null });
      setPreview(null);

      const nuevoToken = response.headers["x-renewed-token"];
      if (nuevoToken) {
        localStorage.setItem("token", nuevoToken);
      }
    } catch (error) {
      console.error("Error al registrar material:", error);
      alert("Hubo un error al registrar el material.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro de Material</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre_material"
          placeholder="Nombre del material"
          value={material.nombre_material}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />

        <div
          className="w-full p-4 border-2 border-dashed rounded-md text-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="mx-auto h-24 object-contain" />
          ) : (
            <span>Arrastra una imagen aquí o haz clic para seleccionar</span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Registrar material
        </button>
      </form>
    </div>
  );
};
