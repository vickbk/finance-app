# Authentication FE Tasklist

## UI Implemetation

- [ ] **Auth Layout Shell & Visual Base**
- **Status**: 🔄 In Progress
- **Target**: 2026-09-10
- **Description**: Build the shared HTML layout wrapper, responsive grid container, and styling base for all authentication-related pages.
- **Steps**:
  - [x] Create shared auth HTML template shell with responsive split-screen branding banner and central card container
  - [ ] Integrate core typography, CSS styling tokens, and accessible color contrast rules
  - [x] Configure semantic landmarks (`<form>`, distinct `aria-labels`) for full screen-reader compliance

- [ ] **Signup View & Form Layout**
- **Status**: ⏳ Todo
- **Target**: 2026-09-11
- **Description**: Implement the user registration HTML view with multi-input form structure, password visibility controls, and form error feedback UI.
- **Steps**:
- [ ] Build Signup HTML form structure (Name, Email, Password, Confirm Password)
- [ ] Add password show/hide toggle controls and inline field error hint containers
- [ ] Add navigation footer link pointing to the Login page (`/login`)

- [ ] **Login View & Password Recovery UI**
- **Status**: ⏳ Todo
- **Target**: 2026-09-12
- **Description**: Build the user sign-in HTML view with "Remember Me" persistent option and "Forgot Password" UI state.
- **Steps**:
- [ ] Build Login HTML form structure (Email, Password, Remember Me checkbox)
- [ ] Create dedicated "Forgot Password" request form view layout (`/forgot-password`)
- [ ] Wire error banner container for invalid credential presentation

- [ ] **Google OAuth Button & Callback View**
- **Status**: ⏳ Todo
- **Target**: 2026-09-13
- **Description**: Implement the "Continue with Google" social authentication button component and post-redirect callback state view.
- **Steps**:
- [ ] Create accessible "Continue with Google" branded button component with official Google SVG icon
- [ ] Embed Google OAuth action button into both Login and Signup form card layouts
- [ ] Build `/auth/callback` HTML view depicting authentication verification and redirection pending states

- [ ] **Fiber Auth View Routes & Integration Tests**
- **Status**: ⏳ Todo
- **Target**: 2026-09-15
- **Description**: Wire Fiber v3 GET handlers to serve auth HTML templates and write route integration tests.
- **Steps**:
- [ ] Register Fiber view routes for `/login`, `/signup`, `/forgot-password`, and `/auth/callback`
- [ ] Wire form POST action endpoints with stub redirects (`302 Found`) to `/` or `/login`
- [ ] Implement unit tests in `auth_test.go` verifying 200 OK responses and proper HTML template rendering for all auth endpoints
