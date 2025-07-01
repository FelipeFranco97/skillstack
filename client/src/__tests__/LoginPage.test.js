import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import LoginPage from "../pages/login"
import { Provider } from "react-redux"
import { store } from "../redux/store"
import * as redux from "react-redux"
import * as gatsby from "gatsby"

// Mock de navigate
gatsby.navigate = jest.fn()

// Mock del dispatch
const mockDispatch = jest.fn()
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}))

// Mock del fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        token: "mock-token",
        user: { id: "123", email: "juan@correo.com" },
      }),
  })
)

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("permite login exitoso", async () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    )

    // Simula escritura
    fireEvent.change(screen.getByPlaceholderText("Correo"), {
      target: { value: "juan@correo.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "123456" },
    })

    // Simula envío
    fireEvent.click(screen.getByText("Iniciar sesión"))

    await waitFor(() => {
      // Validar dispatch
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "auth/loginSuccess",
        payload: {
          token: "mock-token",
          user: { id: "123", email: "juan@correo.com" },
        },
      })

      // Validar navegación
      expect(gatsby.navigate).toHaveBeenCalledWith("/dashboard")
    })
  })

  test("muestra error si el login falla", async () => {
    // Preparamos el mock para que falle
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            message: "Credenciales inválidas",
          }),
      })
    )

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    )

    fireEvent.change(screen.getByPlaceholderText("Correo"), {
      target: { value: "malo@correo.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "incorrecta" },
    })

    fireEvent.click(screen.getByText("Iniciar sesión"))

    await waitFor(() => {
      // ✅ No debe hacer dispatch
      expect(mockDispatch).not.toHaveBeenCalled()

      // ✅ No debe redirigir
      expect(gatsby.navigate).not.toHaveBeenCalled()

      // ✅ Debe mostrar mensaje de error
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument()
    })
  })

  test("muestra error si hay problema de red", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {})

    // 🧪 Simulamos que fetch lanza un error (como si no hubiera internet)
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")))

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    )

    fireEvent.change(screen.getByPlaceholderText("Correo"), {
      target: { value: "fallo@correo.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "error" },
    })

    fireEvent.click(screen.getByText("Iniciar sesión"))

    await waitFor(() => {
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument()
      expect(mockDispatch).not.toHaveBeenCalled()
      expect(gatsby.navigate).not.toHaveBeenCalled()
    })
  })
})
