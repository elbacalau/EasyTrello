import * as Yup from "yup";
export const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required").max(50),
  password: Yup.string()
    .required("Required")
    .min(6, "Password is too short - should be 6 chars minimum")
    
});
