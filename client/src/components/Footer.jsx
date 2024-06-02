import "../styles/Footer.scss"
import { LocationOn, LocalPhone, Email, Home } from "@mui/icons-material"
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_left">
        <a href="/"><img src="/assets/logo.ico" alt="logo" style={{width:'60px'}}/></a>
      </div>

      <div className="footer_center">
        <h3>Useful Links</h3>
        <ul>
          <li>About Us</li>
          <li>Terms and Conditions</li>
        </ul>
      </div>

      <div className="footer_right">
        <h3>Contact</h3>
        <div className="footer_right_info">
          <LocalPhone />
          <p>09129299090, 09128288080</p>
        </div>
        <div className="footer_right_info">
          <Email />
          <p>idabo.lagos@idabohomes.com</p>
        </div>
        <div className="footer_right_info">
          <Home />
          <p>Lagos, Nigeria</p>
        </div>
      </div>
    </div>
  )
}

export default Footer