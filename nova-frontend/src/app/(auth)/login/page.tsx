"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import apiClient from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { decodeToken } from "@/utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting login with:', formData.email);
      const response = await apiClient.login(formData.email, formData.password);
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        console.log('Login successful, decoding token...');
        
        // Decode the JWT token to get user data
        const decodedToken = decodeToken(response.data);
        
        if (decodedToken) {
          console.log('Token decoded successfully:', decodedToken);
          
          // Set user data in API client for future requests
          apiClient.setUserId(decodedToken.userID);
          apiClient.setUserEmail(decodedToken.email);
          apiClient.setUsername(decodedToken.username);
          
          // Store user data in AuthContext
          login(decodedToken);
          
          // Redirect to home page
          router.push('/home');
        } else {
          console.error('Failed to decode token');
          setError("Error al procesar la autenticación");
        }
      } else {
        setError(response.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-black"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-black"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-bg text-white py-2.5 px-4 rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 font-medium"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </div>
      </form>
    </div>
  );
}
