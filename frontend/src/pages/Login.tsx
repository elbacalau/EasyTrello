
import { Description, Field, Label } from "../../components/fieldset";
import { Input } from "../../components/input";


function Login() {
  return (
    <Field>
      <Label>Product name</Label>
      <Description>
        Use the name you'd like people to see in their cart.
      </Description>
      <Input name="product_name" />
    </Field>
  );
}

export default Login;
