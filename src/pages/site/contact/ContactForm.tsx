import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@src/components/Form/FormInput";
import FormTextarea from "@src/components/Form/FormTextArea";
import { QuoteSchemaType, quoteSchema } from "@src/validationType/quote";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { useState } from "react";
import {
  EMAIL_PUBLIC_KEY,
  EMAIL_SERVICE_ID,
  EMAIL_TEMPLATE_ID,
} from "@src/constant/env";
import { Divider } from "primereact/divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<QuoteSchemaType>({
    mode: "onChange",
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      message: "",
      company: "",
      email: "",
      phone: "",
    },
  });
  async function onSubmit(data: QuoteSchemaType) {
    console.log(EMAIL_PUBLIC_KEY);
    console.log(EMAIL_SERVICE_ID);
    console.log(EMAIL_TEMPLATE_ID);
    try {
      setLoading(true);
      await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          from_phone: data.phone,
          from_company: data.company,
          message: data.message,
        },
        {
          publicKey: EMAIL_PUBLIC_KEY,
        }
      );
      toast.success("Success");
      form.reset();
      setLoading(false);
    } catch (err) {
      toast.error("Something went wrong !");
      setLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <p className="text-xl font-semibold">
        <FontAwesomeIcon icon={faMessage} /> Message
      </p>
      <Divider className="my-0" />
      <FormInput
        name="name"
        placeholder="Name"
        title="Name"
        control={form.control}
        required
      />
      <FormInput
        name="phone"
        placeholder="Phone"
        title="Phone"
        control={form.control}
        required
      />
      <FormInput
        name="email"
        placeholder="Email"
        title="Email"
        control={form.control}
        required
      />
      <FormInput
        name="company"
        placeholder="Company"
        title="Company"
        control={form.control}
      />
      <FormTextarea name="message" title="Message" control={form.control} />
      <Button loading={loading} label="Submit" size="small" type="submit" />
    </form>
  );
};

export default ContactForm;
