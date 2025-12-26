import { AddMoneyToWallet } from "./components/AddMoneyToWallet";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import { TestRefresh } from "./components/TestRefresh";

function App() {
  return (
    <>
      {/* <Navbar /> */}
      {/* <Signup /> */}
      <Signup />
      <Login />
      <AddMoneyToWallet />
      <TestRefresh />
    </>
  )
}

export default App
