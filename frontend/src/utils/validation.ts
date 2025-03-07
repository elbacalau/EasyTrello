import * as yup from "yup";
export const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required").max(50),
  password: yup.string()
    .required("Required")
    .min(6, "Password is too short - should be 6 chars minimum"),
});

export const addTaskSchema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio"),
  description: yup.string().required("La descripción es obligatoria"),
  dueDate: yup
    .date()
    .required("La fecha de vencimiento es obligatoria")
    .typeError("Ingrese una fecha válida"),
  status: yup.string().required("El estado es obligatorio"),
  priority: yup.string().required("La prioridad es obligatoria"),
  boardId: yup.number().notRequired(), 
  assignedUserId: yup.number().notRequired(), 
  completed: yup.boolean().required(), 
  labels: yup.array().of(yup.string()),
});
