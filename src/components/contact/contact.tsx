import HeroCanvas from "../widgets/hero"
import ContactForm from "./form_contact";

export const contact = () => {
  return (
    <>
      <HeroCanvas title='Contacto' subtitle='¡Contáctanos!' />
      <ContactForm/>
    </>
  )
}
export default contact;