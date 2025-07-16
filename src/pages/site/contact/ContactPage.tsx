import ContactForm from "./ContactForm";
import ContactInformation from "./ContactInformation";

const ContactPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="col-span-3">
        <ContactForm />
      </div>
      <div className="hidden lg:block col-span-2">
        <ContactInformation />
      </div>
    </div>
  );
};

export default ContactPage;
