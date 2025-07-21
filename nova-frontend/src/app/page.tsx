'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    console.log('Auth state:', { user, isAuthenticated, loading });
  }, [user, isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-5xl">
              La forma más simple de administrar tu dinero
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-purple-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Transferencias seguras, ahorros inteligentes y control total de
              tus finanzas en un solo lugar.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a
                  href={isAuthenticated ? "/home" : "/register"}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  {isAuthenticated ? "Ir al Dashboard" : "Comenzar"}
                </a>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="#features"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-500 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                >
                  Saber Más
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bolsillos Section */}
      <div id="pockets-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">
                Bolsillos
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Organiza tu Dinero Eficazmente
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500">
                Crea bolsillos de ahorro personalizados para cada una de tus
                metas. Define un objetivo, asigna fondos y observa cómo crecen
                tus ahorros para ese viaje soñado, un nuevo gadget o cualquier
                cosa que desees.
              </p>
            </div>
            <div className="mt-10 lg:mt-0" aria-hidden="true">
              <div className="relative h-80 w-full">
                <Image
                  src="/pockets.png"
                  alt="Bolsillos de ahorro"
                  fill
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transacciones Section */}
      <div id="transactions-section" className="py-24 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="mt-10 lg:mt-0 lg:order-first" aria-hidden="true">
              <div className="relative h-80 w-full rounded-lg">
                <Image
                  src="/transactions.png"
                  alt="Historial de transacciones"
                  fill
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
            <div className="lg:text-right">
              <h2 className="text-base text-purple-200 font-semibold tracking-wide uppercase">
                Transacciones
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                Seguimiento Claro y Sencillo
              </p>
              <p className="mt-4 max-w-2xl text-xl text-purple-100 lg:ml-auto">
                Visualiza todas tus transacciones en un solo lugar, con detalles
                claros y categorización automática. Entiende tus patrones de
                gasto y mantén un control total sobre tus movimientos
                financieros.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ahorros Section */}
      <div id="savings-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">
                Ahorros
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Haz Crecer tu Dinero
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500">
                Descubre diferentes opciones de ahorro e inversión diseñadas
                para ayudarte a alcanzar tus metas financieras más rápido. Desde
                ahorros flexibles hasta opciones con mayores rendimientos.
              </p>
            </div>
            <div className="mt-10 lg:mt-0" aria-hidden="true">
              <div className="relative h-80 w-full rounded-lg">
                <Image
                  src="/savings.png"
                  alt="Estadísticas de ahorro"
                  fill
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">
              Características
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Una mejor manera de administrar el dinero
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Nova combina todas las herramientas que necesitas para tomar el
              control de tus finanzas.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 text-center gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm transition duration-300 ease-in-out card-hover flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white ">
                  <i className="fas fa-exchange-alt text-xl"></i>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Transferencias Instantáneas
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Envía y recibe dinero instantáneamente sin comisiones entre
                    usuarios de Nova.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm transition duration-300 ease-in-out card-hover flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white ">
                  <i className="fas fa-piggy-bank text-xl"></i>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Ahorros Inteligentes
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Ahorra dinero automáticamente con nuestros algoritmos
                    inteligentes y gana intereses.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm transition duration-300 ease-in-out card-hover flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white ">
                  <i className="fas fa-shield-alt text-xl"></i>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Seguridad Bancaria
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Tu dinero está protegido con medidas de seguridad líderes en
                    la industria.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm transition duration-300 ease-in-out card-hover flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white ">
                  <i className="fas fa-chart-pie text-xl"></i>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Análisis de Gastos
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Obtén informes detallados y perspectivas sobre tus hábitos
                    de gasto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">
              Cómo funciona
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comienza en minutos
            </p>
          </div>

          <div className="mt-10">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-gray-50 text-lg font-medium text-gray-900">
                  Pasos simples
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
              {/* Step 1 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full shadow-sm">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                        <span className="text-xl font-bold text-white">1</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Crea una cuenta
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Ingresa a Nova y regístrate con tu correo electrónico o
                      número de teléfono. La verificación toma menos de un
                      minuto.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full shadow-sm">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                        <span className="text-xl font-bold text-white">2</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Agrega dinero
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Agrega dinero a tu cuenta de Nova. Este dinero estará
                      disponible para transferir a otras cuentas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full shadow-sm">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                        <span className="text-xl font-bold text-white">3</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Comienza a administrar
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Envía dinero, crea metas de ahorro, rastrea gastos y
                      disfruta del control financiero completo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
            <span className="block text-purple-600">
              Empieza a usar Nova hoy.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Regístrate
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-gray-100 hover:bg-gray-50"
              >
                Inicia sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
