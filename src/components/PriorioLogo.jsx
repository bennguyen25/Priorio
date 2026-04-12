import logo from '../assets/Priorio.jpg'

export default function PriorioLogo({ size = 120 }) {
  return (
    <img
      src={logo}
      alt="Priorio logo"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}
