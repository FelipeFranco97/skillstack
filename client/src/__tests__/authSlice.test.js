import authReducer, { loginSuccess, logout } from "../redux/authSlice"

describe("authSlice", () => {
  const initialState = {
    token: null,
    user: null,
  }

  test("debería manejar loginSuccess", () => {
    const payload = {
      token: "123abc",
      user: { id: "1", email: "juan@correo.com" },
    }

    const newState = authReducer(initialState, loginSuccess(payload))

    expect(newState.token).toBe("123abc")
    expect(newState.user).toEqual({ id: "1", email: "juan@correo.com" })
  })

  test("debería manejar logout", () => {
    const loggedInState = {
      token: "123abc",
      user: { id: "1", email: "juan@correo.com" },
    }

    const newState = authReducer(loggedInState, logout())

    expect(newState.token).toBeNull()
    expect(newState.user).toBeNull()
  })
})
