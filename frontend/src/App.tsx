import { AddMoneyToWallet } from "./components/wallet/AddMoneyToWallet";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";


function App() {
  return (
    <>
      {/* <Navbar /> */}
      {/* <Signup /> */}
      <Signup />
      <Login />
      <AddMoneyToWallet />
      
    </>
  )
}

export default App
